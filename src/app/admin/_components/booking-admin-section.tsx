"use client";

import { DeleteOutlined, EyeOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, Card, Descriptions, Drawer, Popconfirm, Select, Space, Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { DeleteAdminBooking, GetAdminBookings, UpdateAdminBookingStatus } from "@/services/Booking/BookingAPI";
import type { AdminLanguage } from "../_lib/types";
import type { BookingStatus, IBooking } from "@/types/TypeBooking";

const statusColor: Record<BookingStatus, string> = {
  NEW: "blue",
  CONTACTED: "gold",
  CONFIRMED: "green",
  DONE: "purple",
  CANCELLED: "red",
};

const statusOptions: Array<{ value: BookingStatus; label: string }> = [
  { value: "NEW", label: "New" },
  { value: "CONTACTED", label: "Contacted" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "DONE", label: "Done" },
  { value: "CANCELLED", label: "Cancelled" },
];

const copyByLanguage = {
  zh: {
    title: "預訂管理",
    hint: "客戶從服務詳情頁表單提交的預訂需求。",
    refresh: "刷新",
    service: "服務",
    item: "項目",
    time: "時間",
    people: "人數",
    contact: "聯繫方式",
    note: "備注",
    status: "狀態",
    createdAt: "提交時間",
    action: "操作",
    view: "查看詳情",
    detailTitle: "預訂詳情",
    email: "Email",
    wechat: "WeChat",
    telegram: "Telegram",
    updatedAt: "更新時間",
    delete: "刪除",
    confirmDelete: "刪除此預訂？",
    deleted: "已刪除預訂",
    updated: "狀態已更新",
    loaded: "預訂列表已刷新",
  },
  en: {
    title: "Booking Management",
    hint: "Requests submitted from the service detail booking form.",
    refresh: "Refresh",
    service: "Service",
    item: "Item",
    time: "Time",
    people: "People",
    contact: "Contact",
    note: "Note",
    status: "Status",
    createdAt: "Submitted",
    action: "Actions",
    view: "View details",
    detailTitle: "Booking Details",
    email: "Email",
    wechat: "WeChat",
    telegram: "Telegram",
    updatedAt: "Updated",
    delete: "Delete",
    confirmDelete: "Delete this booking?",
    deleted: "Booking deleted",
    updated: "Status updated",
    loaded: "Bookings refreshed",
  },
};

function formatDate(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

export function BookingAdminSection({ adminLanguage }: { adminLanguage: AdminLanguage }) {
  const copy = adminLanguage === "en" ? copyByLanguage.en : copyByLanguage.zh;
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<IBooking | null>(null);

  const loadBookings = async (showToast = false) => {
    setLoading(true);
    try {
      const response = await GetAdminBookings();
      setBookings(response.data.data);
      if (showToast) toast.success(copy.loaded);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Cannot load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    GetAdminBookings()
      .then((response) => {
        if (mounted) setBookings(response.data.data);
      })
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : "Cannot load bookings");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const updateStatus = async (bookingId: string, status: BookingStatus) => {
    try {
      const response = await UpdateAdminBookingStatus(bookingId, status);
      setBookings((current) => current.map((booking) => (booking.id === bookingId ? response.data.data : booking)));
      setSelectedBooking((current) => (current?.id === bookingId ? response.data.data : current));
      toast.success(copy.updated);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Cannot update status");
    }
  };

  const deleteBooking = async (bookingId: string) => {
    try {
      await DeleteAdminBooking(bookingId);
      setBookings((current) => current.filter((booking) => booking.id !== bookingId));
      toast.success(copy.deleted);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Cannot delete booking");
    }
  };

  const columns: ColumnsType<IBooking> = [
    {
      title: copy.service,
      dataIndex: "serviceName",
      width: 190,
      render: (_, record) => (
        <div>
          <Typography.Text strong>{record.serviceName}</Typography.Text>
          <div className="mt-1 text-xs font-semibold text-slate-500">{record.itemName}</div>
        </div>
      ),
    },
    { title: copy.time, dataIndex: "requestedTime", width: 170 },
    { title: copy.people, dataIndex: "people", width: 90 },
    {
      title: copy.contact,
      width: 240,
      render: (_, record) => (
        <div className="space-y-1 text-xs">
          <div className="font-bold">{record.phone}</div>
          {record.email ? <div>{record.email}</div> : null}
          {record.wechat ? <div>WeChat: {record.wechat}</div> : null}
          {record.telegram ? <div>Telegram: {record.telegram}</div> : null}
        </div>
      ),
    },
    {
      title: copy.status,
      dataIndex: "status",
      width: 170,
      render: (status: BookingStatus, record) => (
        <Select
          value={status}
          options={statusOptions}
          onChange={(nextStatus) => updateStatus(record.id, nextStatus)}
          style={{ width: 140 }}
          optionRender={(option) => <Tag color={statusColor[option.value as BookingStatus]}>{option.label}</Tag>}
        />
      ),
    },
    {
      title: copy.createdAt,
      dataIndex: "createdAt",
      width: 150,
      render: (value: string) => formatDate(value),
    },
    {
      title: copy.action,
      width: 130,
      render: (_, record) => (
        <Space>
          <Button title={copy.view} icon={<EyeOutlined />} onClick={() => setSelectedBooking(record)} />
          <Popconfirm title={copy.confirmDelete} okText={copy.delete} cancelText="Cancel" onConfirm={() => deleteBooking(record.id)}>
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Card
        title={copy.title}
        className="border border-slate-200 shadow-sm"
        extra={
          <Button icon={<ReloadOutlined />} onClick={() => loadBookings(true)}>
            {copy.refresh}
          </Button>
        }
      >
        <Typography.Paragraph type="secondary" className="!mb-5">
          {copy.hint}
        </Typography.Paragraph>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={bookings}
          loading={loading}
          pagination={{ pageSize: 8 }}
          scroll={{ x: 1080 }}
        />
      </Card>

      <Drawer
        title={copy.detailTitle}
        open={Boolean(selectedBooking)}
        width={620}
        onClose={() => setSelectedBooking(null)}
      >
        {selectedBooking ? (
          <div className="space-y-5">
            <div>
              <Tag color={statusColor[selectedBooking.status]}>{selectedBooking.status}</Tag>
              <Typography.Title level={4} className="!mb-1 !mt-3">
                {selectedBooking.itemName}
              </Typography.Title>
              <Typography.Text type="secondary">{selectedBooking.serviceName}</Typography.Text>
            </div>

            <Descriptions bordered column={1} size="middle">
              <Descriptions.Item label={copy.service}>{selectedBooking.serviceName}</Descriptions.Item>
              <Descriptions.Item label={copy.item}>{selectedBooking.itemName}</Descriptions.Item>
              <Descriptions.Item label={copy.time}>{selectedBooking.requestedTime}</Descriptions.Item>
              <Descriptions.Item label={copy.people}>{selectedBooking.people}</Descriptions.Item>
              <Descriptions.Item label={copy.contact}>{selectedBooking.phone}</Descriptions.Item>
              <Descriptions.Item label={copy.email}>{selectedBooking.email || "-"}</Descriptions.Item>
              <Descriptions.Item label={copy.wechat}>{selectedBooking.wechat || "-"}</Descriptions.Item>
              <Descriptions.Item label={copy.telegram}>{selectedBooking.telegram || "-"}</Descriptions.Item>
              <Descriptions.Item label={copy.note}>{selectedBooking.note || "-"}</Descriptions.Item>
              <Descriptions.Item label={copy.createdAt}>{formatDate(selectedBooking.createdAt)}</Descriptions.Item>
              <Descriptions.Item label={copy.updatedAt}>{formatDate(selectedBooking.updatedAt)}</Descriptions.Item>
              <Descriptions.Item label="ID">{selectedBooking.id}</Descriptions.Item>
            </Descriptions>

            <div className="flex justify-end gap-3">
              <Select
                value={selectedBooking.status}
                options={statusOptions}
                onChange={(nextStatus) => updateStatus(selectedBooking.id, nextStatus)}
                style={{ width: 160 }}
              />
              <Popconfirm title={copy.confirmDelete} okText={copy.delete} cancelText="Cancel" onConfirm={() => deleteBooking(selectedBooking.id).then(() => setSelectedBooking(null))}>
                <Button danger icon={<DeleteOutlined />}>
                  {copy.delete}
                </Button>
              </Popconfirm>
            </div>
          </div>
        ) : null}
      </Drawer>
    </>
  );
}
