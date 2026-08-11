import type { FormInstance } from "antd";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { adminCatalogItemsApi } from "../_lib/admin-api";
import { backendItemToAdminOption, buildCatalogItemPayload, getSourceLanguage, optionFormToAdminOption, optionToFormValues } from "../_lib/admin-mappers";
import type { AdminLanguage, AdminService, AdminServiceOption, ServiceOptionForm } from "../_lib/types";

type UseAdminCatalogItemsParams = {
  adminLanguage: AdminLanguage;
  form: FormInstance<ServiceOptionForm>;
  selectedService?: AdminService;
  selectedServiceId: string;
};

export function useAdminCatalogItems({ adminLanguage, form, selectedService, selectedServiceId }: UseAdminCatalogItemsParams) {
  const [catalogOptions, setCatalogOptions] = useState<Record<string, AdminServiceOption[]>>({});
  const [optionModalOpen, setOptionModalOpen] = useState(false);
  const [editingOptionIndex, setEditingOptionIndex] = useState<number | null>(null);

  const selectedOptions = catalogOptions[selectedServiceId] ?? [];

  const loadCatalogOptions = useCallback(async (serviceBackendId: string, serviceKey: string) => {
    const items = await adminCatalogItemsApi.list(serviceBackendId);
    const nextOptions = items
      .filter((item) => item.active !== false)
      .map(backendItemToAdminOption);

    setCatalogOptions((current) => ({
      ...current,
      [serviceKey]: nextOptions,
    }));

    return nextOptions;
  }, []);

  useEffect(() => {
    if (!selectedService?.backendId) {
      return;
    }

    adminCatalogItemsApi.list(selectedService.backendId)
      .then((items) => {
        setCatalogOptions((current) => ({
          ...current,
          [selectedServiceId]: items
            .filter((item) => item.active !== false)
            .map(backendItemToAdminOption),
        }));
      })
      .catch((error) => {
        setCatalogOptions((current) => ({ ...current, [selectedServiceId]: [] }));
        if (error instanceof Error) {
          toast.warning(error.message);
        }
      });
  }, [selectedService?.backendId, selectedServiceId]);

  const closeOptionEditor = () => {
    setOptionModalOpen(false);
    setEditingOptionIndex(null);
    form.resetFields();
  };

  const openOptionEditor = (index?: number) => {
    const option = index === undefined ? null : selectedOptions[index];
    setEditingOptionIndex(index ?? null);
    form.setFieldsValue(optionToFormValues(option, selectedService?.image ?? ""));
    setOptionModalOpen(true);
  };

  const saveOption = async () => {
    try {
      const isEditingOption = editingOptionIndex !== null;
      const values = await form.validateFields();
      const nextOption = optionFormToAdminOption(values, selectedServiceId, editingOptionIndex, selectedOptions);
      const nextSortOrder = editingOptionIndex === null ? selectedOptions.length + 1 : editingOptionIndex + 1;

      if (selectedService?.backendId) {
        const payload = buildCatalogItemPayload(nextOption, selectedServiceId, nextSortOrder, getSourceLanguage(adminLanguage));
        if (nextOption.backendId) {
          await adminCatalogItemsApi.update(selectedService.backendId, nextOption.backendId, payload);
        } else {
          await adminCatalogItemsApi.create(selectedService.backendId, payload);
        }
        await loadCatalogOptions(selectedService.backendId, selectedServiceId);
        closeOptionEditor();
        toast.success(isEditingOption ? (adminLanguage === "en" ? "Item updated in database" : "項目已更新到資料庫") : (adminLanguage === "en" ? "Item added to database" : "項目已添加到資料庫"));
        return;
      }

      setCatalogOptions((current) => {
        const currentOptions = current[selectedServiceId] ?? [];
        const nextOptions =
          editingOptionIndex === null
            ? [...currentOptions, nextOption]
            : currentOptions.map((item, index) => (index === editingOptionIndex ? nextOption : item));
        return { ...current, [selectedServiceId]: nextOptions };
      });
      closeOptionEditor();
      toast.success(isEditingOption ? (adminLanguage === "en" ? "Item updated" : "項目已更新") : (adminLanguage === "en" ? "Item added" : "項目已添加"));
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  const deleteOption = (index: number) => {
    const option = selectedOptions[index];

    if (!option) {
      toast.error(adminLanguage === "en" ? "Item to delete was not found" : "未找到要刪除的項目");
      return;
    }

    if (!selectedService?.backendId || !option.backendId) {
      setCatalogOptions((current) => ({
        ...current,
        [selectedServiceId]: (current[selectedServiceId] ?? []).filter((_, optionIndex) => optionIndex !== index),
      }));
      toast.success(adminLanguage === "en" ? "Item deleted" : "項目已刪除");
      return;
    }

    const serviceBackendId = selectedService.backendId;

    return adminCatalogItemsApi.delete(serviceBackendId, option.backendId)
      .then(async () => {
        await loadCatalogOptions(serviceBackendId, selectedServiceId);
        toast.success(adminLanguage === "en" ? "Item deleted from database" : "項目已從資料庫刪除");
      })
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : (adminLanguage === "en" ? "Cannot delete this item" : "無法刪除此項目"));
        throw error;
      });
  };

  return {
    selectedOptions,
    optionModalOpen,
    editingOptionIndex,
    openOptionEditor,
    closeOptionEditor,
    saveOption,
    deleteOption,
  };
}
