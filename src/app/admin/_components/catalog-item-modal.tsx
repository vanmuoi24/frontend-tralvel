import { Card, Form, Image, Input, Modal, Upload } from "antd";
import type { FormInstance } from "antd";
import type { RcFile } from "antd/es/upload";
import { toast } from "react-toastify";
import { adminUploadsApi } from "../_lib/admin-api";
import type { AdminCopy, AdminLanguage, BusinessFieldPreset, ServiceOptionForm } from "../_lib/types";

type CatalogItemModalProps = {
  adminLanguage: AdminLanguage;
  copy: AdminCopy;
  form: FormInstance<ServiceOptionForm>;
  open: boolean;
  editingOptionIndex: number | null;
  selectedBusinessCopy: { title: string; add: string; object: string };
  selectedPreset: BusinessFieldPreset;
  formLabel: (label: string) => string;
  formPlaceholder: (placeholder: string) => string;
  onCancel: () => void;
  onSave: () => void;
};

export function CatalogItemModal({
  adminLanguage,
  copy,
  form,
  open,
  editingOptionIndex,
  selectedBusinessCopy,
  selectedPreset,
  formLabel,
  formPlaceholder,
  onCancel,
  onSave,
}: CatalogItemModalProps) {
  const imageValue = Form.useWatch("image", form);
  const galleryTextValue = Form.useWatch("galleryText", form);

  const uploadImageFile = async (file: RcFile) => {
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

  const uploadGalleryImageFile = async (file: RcFile) => {
    const loadingToastId = toast.loading(adminLanguage === "en" ? "Uploading image..." : "正在上傳圖片...");

    try {
      const uploadedImage = await adminUploadsApi.uploadImage(file);
      const currentGallery =
        galleryTextValue
          ?.split("\n")
          .map((item) => item.trim())
          .filter(Boolean) ?? [];
      form.setFieldValue("galleryText", [...currentGallery, uploadedImage.secureUrl].join("\n"));
      toast.success(adminLanguage === "en" ? "Image added to gallery" : "圖片已加入圖庫");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload image failed");
    } finally {
      toast.dismiss(loadingToastId);
    }

    return Upload.LIST_IGNORE;
  };

  return (
    <Modal
      title={editingOptionIndex === null ? selectedBusinessCopy.add : `${adminLanguage === "en" ? "Edit" : "編輯"} ${selectedBusinessCopy.object}`}
      open={open}
      onCancel={onCancel}
      onOk={onSave}
      width={760}
      okText={copy.save}
      cancelText={copy.cancel}
    >
      <Form form={form} layout="vertical">
        <div className="grid gap-x-4 md:grid-cols-2">
          <Form.Item name="image" label={copy.itemImage} rules={[{ required: true, message: copy.required }]}>
            <div className="space-y-3">
              <Upload accept="image/*" maxCount={1} showUploadList={false} beforeUpload={uploadImageFile}>
                <button type="button" className="h-10 rounded border border-slate-300 bg-white px-4 text-sm font-bold text-slate-900 transition hover:border-blue-500 hover:text-blue-600">
                  {adminLanguage === "en" ? "Choose image" : "選擇圖片"}
                </button>
              </Upload>
              {imageValue ? (
                <Image src={imageValue} alt={copy.itemImage} width={140} height={88} style={{ objectFit: "cover", borderRadius: 8 }} />
              ) : (
                <div className="flex h-22 w-36 items-center justify-center rounded border border-dashed border-slate-300 text-xs font-semibold text-slate-500">
                  {adminLanguage === "en" ? "No image selected" : "未選擇圖片"}
                </div>
              )}
              <Input type="hidden" />
            </div>
          </Form.Item>
          <Form.Item name="name" label={copy.itemName} rules={[{ required: true, message: copy.required }]}>
            <Input placeholder={copy.itemNamePlaceholder} />
          </Form.Item>
        </div>

        <div className="mb-4 space-y-3">
          <div className="text-sm font-semibold">
            {adminLanguage === "en" ? "Gallery images" : "圖庫圖片"}
          </div>
          <Upload accept="image/*" multiple showUploadList={false} beforeUpload={uploadGalleryImageFile}>
            <button type="button" className="h-10 rounded border border-slate-300 bg-white px-4 text-sm font-bold text-slate-900 transition hover:border-blue-500 hover:text-blue-600">
              {adminLanguage === "en" ? "Upload gallery image" : "上傳圖庫圖片"}
            </button>
          </Upload>
          <Form.Item
            name="galleryText"
            extra={adminLanguage === "en" ? "One image URL per line. Upload multiple images if needed." : "每行一個圖片 URL，可上傳多張。"}
          >
            <Input.TextArea rows={4} placeholder={"/hotel-room-1.jpg\n/hotel-room-2.jpg"} />
          </Form.Item>
        </div>

        <div className="grid gap-x-4 md:grid-cols-2">
          <Form.Item name="price" label={copy.price} rules={[{ required: true, message: copy.required }]}>
            <Input placeholder={copy.pricePlaceholder} />
          </Form.Item>
          <Form.Item name="oldPrice" label={copy.oldPrice}>
            <Input placeholder={copy.oldPricePlaceholder} />
          </Form.Item>
        </div>

        <div className="grid gap-x-4 md:grid-cols-2">
          <Form.Item name="unit" label={copy.unit}>
            <Input placeholder={copy.unitPlaceholder} />
          </Form.Item>
        </div>

        <Card size="small" title={`${copy.filterInfo}: ${selectedBusinessCopy.object}`} className="mb-4">
          <div className="grid gap-x-4 md:grid-cols-2">
            {selectedPreset.filterFields.map((field) => (
              <Form.Item key={field.key} name={["tags", field.key]} label={formLabel(field.label)}>
                <Input placeholder={formPlaceholder(field.placeholder)} />
              </Form.Item>
            ))}
          </div>
        </Card>

        <Card size="small" title={copy.displayInfo} className="mb-4">
          <div className="grid gap-x-4 md:grid-cols-2">
            {selectedPreset.detailFields.map((field) => (
              <Form.Item key={field.key} name={["fields", field.label]} label={formLabel(field.label)}>
                <Input placeholder={formPlaceholder(field.placeholder)} />
              </Form.Item>
            ))}
          </div>
        </Card>

        <Form.Item name="includesText" label={copy.includes}>
          <Input.TextArea rows={4} placeholder={copy.includesPlaceholder} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
