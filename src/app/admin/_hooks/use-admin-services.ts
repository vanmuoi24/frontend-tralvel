import { Upload } from "antd";
import type { FormInstance } from "antd";
import type { RcFile } from "antd/es/upload";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { serviceDetailCatalog } from "@/data/service-detail-catalog";
import { servicePricing } from "@/data/service-pricing";
import { adminServicesApi, adminUploadsApi } from "../_lib/admin-api";
import { backendServiceToAdminService, buildServicePayload, fixedServiceIds, getSourceLanguage, serviceFormToAdminService } from "../_lib/admin-mappers";
import type { AdminLanguage, AdminService, AdminServiceForm } from "../_lib/types";

type UseAdminServicesParams = {
  adminLanguage: AdminLanguage;
  form: FormInstance<AdminServiceForm>;
};

export function useAdminServices({ adminLanguage, form }: UseAdminServicesParams) {
  const [services, setServices] = useState<AdminService[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState("hotel");
  const [editing, setEditing] = useState<AdminService | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const loadServices = useCallback(async () => {
    const backendServices = await adminServicesApi.list();
    if (!backendServices.length) return [];

    const nextServices = backendServices
      .filter((service) => fixedServiceIds.has(service.slug))
      .map(backendServiceToAdminService)
      .sort((a, b) => a.sortOrder - b.sortOrder);

    setServices(nextServices);
    setSelectedServiceId((current) => nextServices.some((service) => service.id === current) ? current : nextServices[0]?.id ?? "");
    return nextServices;
  }, []);

  useEffect(() => {
    adminServicesApi.list()
      .then((backendServices) => {
        if (!backendServices.length) return;

        const nextServices = backendServices
          .filter((service) => fixedServiceIds.has(service.slug))
          .map(backendServiceToAdminService)
          .sort((a, b) => a.sortOrder - b.sortOrder);

        setServices(nextServices);
        setSelectedServiceId((current) => nextServices.some((service) => service.id === current) ? current : nextServices[0]?.id ?? "");
      })
      .catch(() => {
        // Backend can be off during UI work; keep local seed data usable.
      });
  }, []);

  const selectedService = services.find((service) => service.id === selectedServiceId) ?? services[0];
  const selectedCatalog = useMemo(() => {
    if (!editing) return null;
    return serviceDetailCatalog.find((item) => item.serviceId === editing.id) ?? null;
  }, [editing]);
  const selectedPricing = useMemo(() => {
    if (!editing) return null;
    return servicePricing.find((item) => item.serviceId === editing.id) ?? null;
  }, [editing]);

  const openEditor = (record?: AdminService) => {
    if (!record) return;
    setEditing(record);
    form.setFieldsValue({ ...record, highlightsText: record.highlights.join("\n") });
    setDrawerOpen(true);
  };

  const closeEditor = () => {
    setDrawerOpen(false);
    setEditing(null);
    form.resetFields();
  };

  const uploadServiceImageFile = async (file: RcFile) => {
    const loadingToastId = toast.loading(adminLanguage === "en" ? "Uploading image..." : "正在上傳圖片...");

    try {
      const uploadedImage = await adminUploadsApi.uploadImage(file);
      form.setFieldValue("image", uploadedImage.secureUrl);
      form.validateFields(["image"]).catch(() => undefined);
      toast.success(adminLanguage === "en" ? "Image uploaded" : "圖片已上傳");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload image failed");
    } finally {
      toast.dismiss(loadingToastId);
    }

    return Upload.LIST_IGNORE;
  };

  const saveService = async () => {
    try {
      const values = await form.validateFields();
      const nextService = serviceFormToAdminService(values);

      if (editing?.backendId) {
        await adminServicesApi.update(editing.backendId, buildServicePayload(nextService, getSourceLanguage(adminLanguage)));
        await loadServices();
        closeEditor();
        toast.success(adminLanguage === "en" ? "Service updated in database" : "服務已更新到資料庫");
        return;
      }

      setServices((current) => {
        const exists = current.some((item) => item.id === nextService.id);
        if (exists && fixedServiceIds.has(nextService.id)) {
          return current.map((item) => (item.id === nextService.id ? nextService : item));
        }
        return current;
      });
      closeEditor();
      toast.success(adminLanguage === "en" ? "Service layout saved" : "服務界面已儲存");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  const openBusiness = (serviceId: string) => {
    setSelectedServiceId(serviceId);
  };

  return {
    services,
    setServices,
    selectedServiceId,
    setSelectedServiceId,
    selectedService,
    selectedCatalog,
    selectedPricing,
    editing,
    drawerOpen,
    closeEditor,
    openEditor,
    openBusiness,
    saveService,
    uploadServiceImageFile,
  };
}
