import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Image, Popconfirm, Space, Table, Tag, Typography } from "antd";
import type { AdminLanguage, AdminService, AdminServiceOption, AdminCopy } from "../_lib/types";

type BusinessCatalogSectionProps = {
  adminLanguage: AdminLanguage;
  copy: AdminCopy;
  services: AdminService[];
  selectedService?: AdminService;
  selectedServiceId: string;
  selectedOptions: AdminServiceOption[];
  businessCopy: Record<string, { title: string; add: string; object: string }>;
  selectedBusinessCopy: { title: string; add: string; object: string };
  onSelectService: (serviceId: string) => void;
  onAddItem: () => void;
  onEditItem: (index: number) => void;
  onDeleteItem: (index: number) => void | Promise<void>;
};

export function BusinessCatalogSection({
  adminLanguage,
  copy,
  services,
  selectedService,
  selectedServiceId,
  selectedOptions,
  businessCopy,
  selectedBusinessCopy,
  onSelectService,
  onAddItem,
  onEditItem,
  onDeleteItem,
}: BusinessCatalogSectionProps) {
  const getOptionIndex = (record: AdminServiceOption) =>
    selectedOptions.findIndex((item) => {
      if (record.backendId || item.backendId) {
        return item.backendId === record.backendId;
      }
      return item === record;
    });

  return (
    <div className="space-y-5">
      <Card className="border border-slate-200 shadow-sm">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <Typography.Title level={5} style={{ margin: 0 }}>
              {copy.selectParent}
            </Typography.Title>
            <Typography.Text type="secondary">{copy.parentHint}</Typography.Text>
          </div>
          <Tag color="blue">
            {selectedOptions.length} {copy.itemCount}
          </Tag>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
          {services.map((service) => (
            <button
              key={service.id}
              type="button"
              onClick={() => onSelectService(service.id)}
              className={`flex min-h-[76px] w-full items-center gap-3 rounded-lg border px-3 py-3 text-left transition ${
                selectedServiceId === service.id
                  ? "border-[#2563eb] bg-[#eff6ff] shadow-sm ring-1 ring-[#2563eb]/20"
                  : "border-slate-200 bg-white hover:border-[#2563eb] hover:bg-slate-50"
              }`}
            >
              <Image src={service.image} alt={service.label} width={54} height={42} style={{ objectFit: "cover", borderRadius: 6 }} preview={false} />
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold">{service.label}</span>
                <span className="block truncate text-xs text-slate-500">{businessCopy[service.id]?.object ?? service.id}</span>
              </span>
            </button>
          ))}
        </div>
      </Card>

      <Card
        className="border border-slate-200 shadow-sm"
        title={
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span>{selectedBusinessCopy.title}</span>
              <Tag color="blue">{selectedService?.label}</Tag>
            </div>
            <Typography.Text type="secondary" className="text-xs">
              {copy.businessTableHint}
            </Typography.Text>
          </div>
        }
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={onAddItem}>
            {selectedBusinessCopy.add}
          </Button>
        }
      >
        <Table
          rowKey={(record, index) => record.backendId ?? `${selectedServiceId}-${index}`}
          dataSource={selectedOptions}
          pagination={{ pageSize: 6 }}
          scroll={{ x: 1100 }}
          columns={[
            {
              title: adminLanguage === "en" ? "Image" : "圖片",
              dataIndex: "image",
              width: 88,
              render: (value: string, record) => (
                <Image src={value || selectedService?.image || record.image} alt={record.name} width={64} height={44} style={{ objectFit: "cover", borderRadius: 6 }} preview={false} />
              ),
            },
            {
              title: adminLanguage === "en" ? "Item" : "名稱",
              dataIndex: "name",
              render: (value, record) => (
                <div>
                  <div className="font-bold">{value}</div>
                  <Typography.Text type="secondary">{record.unit}</Typography.Text>
                </div>
              ),
            },
            {
              title: adminLanguage === "en" ? "Price" : "價格",
              dataIndex: "price",
              width: 190,
              render: (value, record) => (
                <div>
                  {record.oldPrice && (
                    <Typography.Text delete type="secondary">
                      {record.oldPrice}
                    </Typography.Text>
                  )}
                  <div className="font-bold">{value}</div>
                </div>
              ),
            },
            {
              title: adminLanguage === "en" ? "Filters" : "篩選屬性",
              dataIndex: "tags",
              render: (tags: Record<string, string>) => (
                <Space wrap>
                  {Object.entries(tags).map(([key, value]) => (
                    <Tag key={key}>
                      {key}: {value}
                    </Tag>
                  ))}
                </Space>
              ),
            },
            {
              title: adminLanguage === "en" ? "Details" : "資訊",
              dataIndex: "fields",
              render: (fields: { label: string; value: string }[]) => (
                <Space direction="vertical" size={0}>
                  {fields.slice(0, 3).map((field) => (
                    <Typography.Text key={field.label} type="secondary">
                      {field.label}: {field.value}
                    </Typography.Text>
                  ))}
                </Space>
              ),
            },
            {
              title: adminLanguage === "en" ? "Actions" : "操作",
              width: 120,
              render: (_, record) => {
                const optionIndex = getOptionIndex(record);

                return (
                  <Space>
                    <Button icon={<EditOutlined />} disabled={optionIndex < 0} onClick={() => onEditItem(optionIndex)} />
                    <Popconfirm
                      title={adminLanguage === "en" ? "Delete this item?" : "刪除此項目？"}
                      okText={adminLanguage === "en" ? "Delete" : "刪除"}
                      cancelText={adminLanguage === "en" ? "Cancel" : "取消"}
                      okButtonProps={{ danger: true }}
                      onConfirm={() => onDeleteItem(optionIndex)}
                    >
                      <Button danger icon={<DeleteOutlined />} disabled={optionIndex < 0} />
                    </Popconfirm>
                  </Space>
                );
              },
            },
          ]}
        />
      </Card>
    </div>
  );
}
