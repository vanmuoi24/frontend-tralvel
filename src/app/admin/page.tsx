"use client";

import {
	  AppstoreOutlined,
	  CalendarOutlined,
	  EditOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  GlobalOutlined,
  HomeOutlined,
  LogoutOutlined,
  SaveOutlined,
  SettingOutlined,
	  TranslationOutlined,
	  UploadOutlined,
	} from "@ant-design/icons";
import {
  Button,
  Card,
  ConfigProvider,
  Descriptions,
  Drawer,
  Form,
  Image,
  Input,
  InputNumber,
  Menu,
  Select,
  Space,
  Statistic,
  Switch,
  Table,
  Tabs,
  Tag,
  Typography,
  Upload,
  theme,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import type { RcFile } from "antd/es/upload";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { BusinessCatalogSection } from "./_components/business-catalog-section";
import { BookingAdminSection } from "./_components/booking-admin-section";
import { CatalogItemModal } from "./_components/catalog-item-modal";
import { useAdminCatalogItems } from "./_hooks/use-admin-catalog-items";
import { useAdminServices } from "./_hooks/use-admin-services";
import { businessCopy, businessFieldPresets } from "./_lib/business";
import { getSourceLanguage } from "./_lib/admin-mappers";
import { adminCopy, fieldLabelTranslations, fieldPlaceholderTranslations } from "./_lib/i18n";
import type { AdminLanguage, AdminService, AdminServiceForm, AdminSiteForm, ServiceOptionForm } from "./_lib/types";
import { serviceDetailCatalog } from "@/data/service-detail-catalog";
import { servicePricing } from "@/data/service-pricing";
import { LOGO_SRC } from "@/data/assets";
import { navLinks, siteConfig, statistics } from "@/data/site";
import { buildSiteSettingPayload, mapBackendSiteSetting } from "@/data/backend-site";
import { GetAdminSiteSettings, UpdateAdminSiteSetting } from "@/services/Site/SiteSettingsAPI";
import { adminUploadsApi } from "./_lib/admin-api";

export default function AdminPage() {
  const router = useRouter();
  const [adminSiteConfig, setAdminSiteConfig] = useState(siteConfig);
  const [adminStatistics, setAdminStatistics] = useState(statistics);
  const [adminLanguage, setAdminLanguage] = useState<AdminLanguage>("zh");
  const [darkMode, setDarkMode] = useState(false);
  const [activeKey, setActiveKey] = useState("business");
  const [form] = Form.useForm<AdminServiceForm>();
  const [optionForm] = Form.useForm<ServiceOptionForm>();
  const [siteForm] = Form.useForm<AdminSiteForm>();
  const serviceImageValue = Form.useWatch("image", form);
  const siteQrValues = Form.useWatch([], siteForm);

  const {
    services,
    setServices,
    selectedServiceId,
    setSelectedServiceId,
    selectedService,
    selectedCatalog,
    selectedPricing,
    drawerOpen,
    closeEditor,
    openEditor,
    openBusiness: selectBusinessService,
    saveService,
    uploadServiceImageFile,
  } = useAdminServices({ adminLanguage, form });
  const {
    selectedOptions,
    optionModalOpen,
    editingOptionIndex,
    openOptionEditor,
    closeOptionEditor,
    saveOption,
    deleteOption,
  } = useAdminCatalogItems({ adminLanguage, form: optionForm, selectedService, selectedServiceId });

  useEffect(() => {
    if (localStorage.getItem("anvid_admin_session") !== "demo") {
      router.replace("/admin/login");
    }
  }, [router]);

  useEffect(() => {
    GetAdminSiteSettings()
      .then((settings) => {
        const sourceLanguage = getSourceLanguage(adminLanguage);
        const setting = settings.data.data.find((item) => item.language === sourceLanguage) ?? settings.data.data[0];
        const mapped = mapBackendSiteSetting(setting);
        setAdminSiteConfig(mapped.site);
        setAdminStatistics(mapped.statistics);
      })
      .catch(() => {
        // Keep static site data usable when the backend is offline.
      });
  }, [adminLanguage]);

  useEffect(() => {
    siteForm.setFieldsValue({
      name: adminSiteConfig.name,
      tagline: adminSiteConfig.tagline,
      description: adminSiteConfig.description,
      url: adminSiteConfig.url,
      email: adminSiteConfig.email,
      phone: adminSiteConfig.phone,
      phonesText: adminSiteConfig.phones.map((phone) => `${phone.label}|${phone.value}`).join("\n"),
      webchatHref: adminSiteConfig.webchatHref,
      telegramHref: adminSiteConfig.telegramHref,
      lineHref: adminSiteConfig.lineHref,
      webchatQrImage: adminSiteConfig.webchatQrImage,
      webchatQrName: adminSiteConfig.contactQrCodes[0]?.subtitle ?? "",
      lineQrImage: adminSiteConfig.lineQrImage,
      lineQrName: adminSiteConfig.contactQrCodes[1]?.subtitle ?? "",
      address: adminSiteConfig.address,
      facebook: adminSiteConfig.social.facebook,
      instagram: adminSiteConfig.social.instagram,
      youtube: adminSiteConfig.social.youtube,
      statisticsText: adminStatistics.map((item) => `${item.label}|${item.value}|${item.suffix}`).join("\n"),
    });
  }, [adminSiteConfig, adminStatistics, siteForm]);

  const copy = adminCopy[adminLanguage];
  const currentBusinessCopy = businessCopy[adminLanguage];
  const selectedBusinessCopy = currentBusinessCopy[selectedServiceId] ?? { title: copy.business, add: copy.addService, object: copy.itemCount };
  const selectedPreset = businessFieldPresets[selectedServiceId] ?? businessFieldPresets.hotel;
  const formLabel = (label: string) => fieldLabelTranslations[adminLanguage][label] ?? label;
  const formPlaceholder = (placeholder: string) => fieldPlaceholderTranslations[adminLanguage][placeholder] ?? placeholder;
  const activeSectionTitle =
    activeKey === "business"
	      ? copy.business
	      : activeKey === "bookings"
	        ? copy.bookings
	      : activeKey === "services"
        ? copy.services
        : activeKey === "content"
          ? copy.content
          : copy.site;

  const openBusiness = (serviceId: string) => {
    selectBusinessService(serviceId);
    setActiveKey("business");
  };

  const logout = () => {
    localStorage.removeItem("anvid_admin_session");
    router.push("/admin/login");
  };

  const uploadSiteQrFile = (fieldName: "webchatQrImage" | "lineQrImage") => async (file: RcFile) => {
    const loadingToastId = toast.loading(adminLanguage === "en" ? "Uploading QR..." : "正在上傳二維碼...");

    try {
      const uploadedImage = await adminUploadsApi.uploadImage(file);
      siteForm.setFieldValue(fieldName, uploadedImage.secureUrl);
      siteForm.validateFields([fieldName]).catch(() => undefined);
      toast.success(adminLanguage === "en" ? "QR uploaded" : "二維碼已上傳");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload QR failed");
    } finally {
      toast.dismiss(loadingToastId);
    }

    return Upload.LIST_IGNORE;
  };

  const saveSite = async () => {
    try {
      const values = await siteForm.validateFields();
      const phones = values.phonesText
        ?.split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line, index) => {
          const [label, value] = line.includes("|") ? line.split("|").map((item) => item.trim()) : [`Hotline ${index + 1}`, line];
          return { label, value };
        }) ?? [];
      const nextStatistics = values.statisticsText
        ?.split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const [label = "", value = "0", suffix = ""] = line.split("|").map((item) => item.trim());
          return { label, value: Number(value) || 0, suffix };
        }) ?? [];

      const nextSiteConfig = {
        ...adminSiteConfig,
        name: values.name,
        tagline: values.tagline,
        description: values.description,
        url: values.url,
        email: values.email,
        phone: values.phone,
        phones,
        webchatHref: values.webchatHref ?? "",
        telegramHref: values.telegramHref ?? "",
        lineHref: values.lineHref ?? "",
        webchatQrImage: values.webchatQrImage ?? "",
        lineQrImage: values.lineQrImage ?? "",
        contactQrCodes: [
          {
            title: "WeChat",
            subtitle: values.webchatQrName ?? "",
            image: values.webchatQrImage ?? "",
            href: values.webchatHref ?? "",
          },
          {
            title: "LINE",
            subtitle: values.lineQrName ?? "",
            image: values.lineQrImage ?? "",
            href: values.lineHref ?? "",
          },
        ],
        address: values.address ?? "",
        social: {
          facebook: values.facebook ?? "",
          instagram: values.instagram ?? "",
          youtube: values.youtube ?? "",
        },
      };

      await UpdateAdminSiteSetting(buildSiteSettingPayload(nextSiteConfig, nextStatistics, navLinks, getSourceLanguage(adminLanguage)));
      setAdminSiteConfig(nextSiteConfig);
      setAdminStatistics(nextStatistics);
      toast.success(adminLanguage === "en" ? "Site information saved to database" : "站點資訊已儲存到資料庫");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  const columns: ColumnsType<AdminService> = [
    {
      title: copy.serviceCount,
      dataIndex: "label",
      render: (_, record) => (
        <Space>
          <Image src={record.image} alt={record.label} width={56} height={40} style={{ objectFit: "cover", borderRadius: 6 }} preview={false} />
          <div>
            <div className="font-bold">{record.label}</div>
            <Typography.Text type="secondary">{record.id}</Typography.Text>
          </div>
        </Space>
      ),
    },
    { title: adminLanguage === "en" ? "Group" : "分組", dataIndex: "groupCode", render: (value) => <Tag color="blue">{value}</Tag> },
    { title: "Icon", dataIndex: "icon" },
    { title: adminLanguage === "en" ? "Order" : "排序", dataIndex: "sortOrder", width: 90 },
    {
      title: adminLanguage === "en" ? "Status" : "狀態",
      dataIndex: "active",
      width: 120,
      render: (_, record) => (
        <Tag icon={record.active ? <EyeOutlined /> : <EyeInvisibleOutlined />} color={record.active ? "green" : "default"}>
          {record.active ? (adminLanguage === "en" ? "Visible" : "顯示") : (adminLanguage === "en" ? "Hidden" : "隱藏")}
        </Tag>
      ),
    },
    {
      title: adminLanguage === "en" ? "Actions" : "操作",
      width: 240,
      render: (_, record) => (
        <Space>
          <Button icon={<AppstoreOutlined />} onClick={() => openBusiness(record.id)} />
          <Button icon={<EditOutlined />} onClick={() => openEditor(record)} />
          <Button
            icon={record.active ? <EyeInvisibleOutlined /> : <EyeOutlined />}
            onClick={() => setServices((current) => current.map((item) => (item.id === record.id ? { ...item, active: !item.active } : item)))}
          />
        </Space>
      ),
    },
  ];

  return (
    <ConfigProvider
      theme={{
        algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: "#2563eb",
          borderRadius: 8,
          fontFamily: "Inter, system-ui, sans-serif",
          colorBgLayout: darkMode ? "#111827" : "#eef2f7",
          colorBorderSecondary: darkMode ? "#263244" : "#e2e8f0",
          boxShadowSecondary: "0 8px 24px rgba(15, 23, 42, 0.06)",
        },
        components: {
          Card: {
            headerBg: darkMode ? "#111827" : "#ffffff",
            colorBorderSecondary: darkMode ? "#263244" : "#e2e8f0",
          },
          Layout: {
            headerBg: darkMode ? "#0f172a" : "#ffffff",
            siderBg: darkMode ? "#0f172a" : "#ffffff",
          },
          Menu: {
            itemBorderRadius: 8,
            itemHeight: 42,
            itemSelectedBg: darkMode ? "#1e3a8a" : "#eff6ff",
            itemSelectedColor: darkMode ? "#dbeafe" : "#1d4ed8",
            itemHoverBg: darkMode ? "#172033" : "#f8fafc",
          },
          Table: {
            headerBg: darkMode ? "#111827" : "#f8fafc",
            headerColor: darkMode ? "#cbd5e1" : "#334155",
            rowHoverBg: darkMode ? "#172033" : "#f8fbff",
          },
        },
      }}
    >
      <ToastContainer aria-label="Admin notifications" position="top-right" autoClose={2200} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover theme={darkMode ? "dark" : "light"} />
      <div className={darkMode ? "min-h-screen bg-[#111827]" : "min-h-screen bg-[#eef2f7]"}>
        <aside className={`fixed left-0 top-0 z-30 h-screen w-[264px] overflow-auto border-r ${darkMode ? "border-slate-800 bg-[#0f172a]" : "border-slate-200 bg-white"}`}>
          <div className="px-4 pb-4 pt-5">
            <div className={`flex min-h-16 items-center gap-3 rounded-lg border px-3 ${darkMode ? "border-slate-800 bg-white/[0.04]" : "border-slate-200 bg-slate-50"}`}>
              {LOGO_SRC ? (
                <Image src={LOGO_SRC} alt="An Khai Travel logo" width={42} height={42} style={{ objectFit: "contain", borderRadius: 8 }} preview={false} />
              ) : (
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-black text-white ${darkMode ? "bg-blue-600" : "bg-[#0f172a]"}`}>AT</div>
              )}
              <div className="min-w-0">
                <div className={darkMode ? "truncate text-base font-black tracking-normal text-white" : "truncate text-base font-black tracking-normal text-slate-950"}>An Khai Travel</div>
                <div className={darkMode ? "truncate text-xs font-black text-amber-300" : "truncate text-xs font-black text-amber-600"}>{siteConfig.legalNameZh}</div>
                <div className={darkMode ? "truncate text-xs font-semibold text-slate-400" : "truncate text-xs font-semibold text-slate-500"}>{copy.console}</div>
              </div>
            </div>
          </div>
          <Menu
            theme="light"
            mode="inline"
            className="border-none px-3"
            selectedKeys={[activeKey]}
            onClick={(event) => setActiveKey(event.key)}
            items={[
	              { key: "business", icon: <AppstoreOutlined />, label: copy.business },
	              { key: "bookings", icon: <CalendarOutlined />, label: copy.bookings },
	              { key: "services", icon: <SettingOutlined />, label: copy.services },
              { key: "content", icon: <TranslationOutlined />, label: copy.content },
              { key: "site", icon: <GlobalOutlined />, label: copy.site },
            ]}
          />
          <div className="px-3 pt-3">
            <Button block icon={<HomeOutlined />} onClick={() => router.push("/")}>
              {copy.home}
            </Button>
          </div>
          <div className={`absolute bottom-0 left-0 right-0 border-t p-4 ${darkMode ? "border-slate-800 bg-[#0f172a]" : "border-slate-200 bg-white"}`}>
            <div className={darkMode ? "rounded-lg bg-white/[0.04] p-3" : "rounded-lg bg-slate-50 p-3"}>
              <div className="text-xs font-bold uppercase text-slate-500">{copy.languages}</div>
              <div className="mt-1 flex gap-2">
                <Tag color="blue">中文</Tag>
                <Tag color="green">English</Tag>
              </div>
            </div>
          </div>
        </aside>

        <div className="ml-[264px] min-h-screen min-w-0">
          <header className={`sticky top-0 z-20 flex h-[72px] items-center justify-between border-b px-8 ${darkMode ? "border-slate-800 bg-[#0f172a]" : "border-slate-200 bg-white"}`}>
            <div>
              <Typography.Title level={4} style={{ margin: 0, color: darkMode ? "#f8fafc" : "#0f172a", lineHeight: 1.2 }}>
                {activeSectionTitle}
              </Typography.Title>
              <Typography.Text type="secondary">{copy.headerDesc}</Typography.Text>
            </div>
            <Space>
              <Select
                value={adminLanguage}
                onChange={setAdminLanguage}
                options={[
                  { value: "zh", label: "中文" },
                  { value: "en", label: "EN" },
                ]}
                style={{ width: 92 }}
              />
              <Switch checked={darkMode} onChange={setDarkMode} checkedChildren={copy.darkMode} unCheckedChildren={copy.lightMode} />
              <Button icon={<LogoutOutlined />} onClick={logout}>
                {copy.logout}
              </Button>
            </Space>
          </header>

          <main className="p-6 xl:p-8">
            <div className="mb-6 grid gap-4 md:grid-cols-4">
              <Card className="border border-slate-200 shadow-sm">
                <Statistic title={copy.serviceCount} value={services.length} />
              </Card>
              <Card className="border border-slate-200 shadow-sm">
                <Statistic title={copy.activeCount} value={services.filter((item) => item.active).length} />
              </Card>
              <Card className="border border-slate-200 shadow-sm">
                <Statistic title={copy.featuredCount} value={services.filter((item) => item.featured).length} />
              </Card>
              <Card className="border border-slate-200 shadow-sm">
                <Statistic title={copy.languages} value={2} suffix="zh/en" />
              </Card>
            </div>

	            {activeKey === "business" && (
              <BusinessCatalogSection
                adminLanguage={adminLanguage}
                copy={copy}
                services={services}
                selectedService={selectedService}
                selectedServiceId={selectedServiceId}
                selectedOptions={selectedOptions}
                businessCopy={currentBusinessCopy}
                selectedBusinessCopy={selectedBusinessCopy}
                onSelectService={setSelectedServiceId}
                onAddItem={() => openOptionEditor()}
                onEditItem={openOptionEditor}
                onDeleteItem={deleteOption}
              />
	            )}

	            {activeKey === "bookings" && (
	              <BookingAdminSection adminLanguage={adminLanguage} />
	            )}

	            {activeKey === "services" && (
              <Card
                title={copy.services}
                className="border border-slate-200 shadow-sm"
              >
                <Table rowKey="id" columns={columns} dataSource={services} pagination={{ pageSize: 8 }} scroll={{ x: 960 }} />
              </Card>
            )}

            {activeKey === "content" && (
              <Card title={copy.content} className="border border-slate-200 shadow-sm">
                <Tabs
                  items={services.map((service) => ({
                    key: service.id,
                    label: service.shortLabel,
                    children: (
                      <Descriptions bordered column={1} size="middle">
                        <Descriptions.Item label="Slug">{service.id}</Descriptions.Item>
                        <Descriptions.Item label={adminLanguage === "en" ? "Description" : "描述"}>{service.description}</Descriptions.Item>
                        <Descriptions.Item label="Highlights">{service.highlights.join(" / ")}</Descriptions.Item>
                        <Descriptions.Item label="Catalog filters">
                          {serviceDetailCatalog.find((item) => item.serviceId === service.id)?.filters.length ?? 0} {adminLanguage === "en" ? "filter groups" : "個篩選組"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Pricing">
                          {servicePricing.find((item) => item.serviceId === service.id)?.priceFrom ?? (adminLanguage === "en" ? "Not set" : "暫無")}
                        </Descriptions.Item>
                      </Descriptions>
                    ),
                  }))}
                />
              </Card>
            )}

            {activeKey === "site" && (
              <Card
                title={copy.siteInfo}
                className="border border-slate-200 shadow-sm"
                extra={
                  <Button type="primary" icon={<SaveOutlined />} onClick={saveSite}>
                    {copy.addChange}
                  </Button>
                }
              >
                <Form
                  form={siteForm}
                  layout="vertical"
                  initialValues={{
                    name: adminSiteConfig.name,
                    tagline: adminSiteConfig.tagline,
                    description: adminSiteConfig.description,
                    url: adminSiteConfig.url,
                    email: adminSiteConfig.email,
                    phone: adminSiteConfig.phone,
                    phonesText: adminSiteConfig.phones.map((phone) => `${phone.label}|${phone.value}`).join("\n"),
                    webchatHref: adminSiteConfig.webchatHref,
                    telegramHref: adminSiteConfig.telegramHref,
                    lineHref: adminSiteConfig.lineHref,
                    webchatQrImage: adminSiteConfig.webchatQrImage,
                    lineQrImage: adminSiteConfig.lineQrImage,
                    address: adminSiteConfig.address,
                    facebook: adminSiteConfig.social.facebook,
                    instagram: adminSiteConfig.social.instagram,
                    youtube: adminSiteConfig.social.youtube,
                    statisticsText: adminStatistics.map((item) => `${item.label}|${item.value}|${item.suffix}`).join("\n"),
                  }}
                >
                  <Tabs
                    items={[
                      {
                        key: "general",
                        label: copy.general,
                        children: (
                          <div className="grid gap-x-4 md:grid-cols-2">
                            <Form.Item name="name" label={copy.siteName} rules={[{ required: true, message: copy.required }]}>
                              <Input />
                            </Form.Item>
                            <Form.Item name="tagline" label="Tagline" rules={[{ required: true, message: copy.required }]}>
                              <Input />
                            </Form.Item>
                            <Form.Item name="url" label={copy.websiteUrl}>
                              <Input placeholder="https://anvidtravel.vn" />
                            </Form.Item>
                            <Form.Item name="address" label={copy.address}>
                              <Input />
                            </Form.Item>
                            <Form.Item name="description" label={copy.siteDescription} className="md:col-span-2">
                              <Input.TextArea rows={4} />
                            </Form.Item>
                          </div>
                        ),
                      },
                      {
                        key: "contact",
                        label: copy.contact,
                        children: (
                          <div className="grid gap-x-4 md:grid-cols-2">
                            <Form.Item name="email" label="Email" rules={[{ required: true, message: copy.required }]}>
                              <Input />
                            </Form.Item>
                            <Form.Item name="phone" label={copy.mainPhone} rules={[{ required: true, message: copy.required }]}>
                              <Input />
                            </Form.Item>
                            <Form.Item name="telegramHref" label="Telegram">
                              <Input placeholder="https://t.me/anvidtravel" />
                            </Form.Item>
	                            <Form.Item name="lineHref" label={adminLanguage === "en" ? "LINE app link" : "打開 LINE 的連結"}>
	                              <Input placeholder="https://line.me/R/ti/p/..." />
	                            </Form.Item>
	                            <Form.Item name="webchatHref" label={copy.webchatLink}>
		                              <Input placeholder="weixin:// or https://u.wechat.com/..." />
	                            </Form.Item>
                            <Form.Item name="phonesText" label={copy.hotlineList} className="md:col-span-2">
                              <Input.TextArea rows={4} placeholder={copy.hotlinePlaceholder} />
                            </Form.Item>
                          </div>
                        ),
                      },
                      {
                        key: "qr-social",
                        label: copy.qrSocial,
                        children: (
                          <div className="grid gap-x-4 md:grid-cols-2">
	                            <Form.Item name="webchatQrImage" label={copy.webchatQr}>
	                              <Space.Compact block>
	                                <Input placeholder="https://res.cloudinary.com/.../wechat-qr.jpg" />
	                                <Upload accept="image/*" maxCount={1} showUploadList={false} beforeUpload={uploadSiteQrFile("webchatQrImage")}>
		                                  <Button icon={<UploadOutlined />}>{adminLanguage === "en" ? "Upload QR" : "上傳 QR"}</Button>
	                                </Upload>
	                              </Space.Compact>
	                            </Form.Item>
		                            <Form.Item name="webchatQrName" label={adminLanguage === "en" ? "WeChat Name" : "WeChat 名稱"}>
	                              <Input placeholder="今晚打老虎" />
	                            </Form.Item>
	                            <Form.Item name="lineQrImage" label={copy.lineQr}>
	                              <Space.Compact block>
	                                <Input placeholder="https://res.cloudinary.com/.../line-qr.jpg" />
	                                <Upload accept="image/*" maxCount={1} showUploadList={false} beforeUpload={uploadSiteQrFile("lineQrImage")}>
		                                  <Button icon={<UploadOutlined />}>{adminLanguage === "en" ? "Upload QR" : "上傳 QR"}</Button>
	                                </Upload>
	                              </Space.Compact>
	                            </Form.Item>
		                            <Form.Item name="lineQrName" label={adminLanguage === "en" ? "LINE Name" : "LINE 名稱"}>
	                              <Input placeholder="LINE support" />
	                            </Form.Item>
	                            <div className="md:col-span-2 grid gap-4 md:grid-cols-2">
	                              {[
	                                { title: "WeChat QR", src: siteQrValues?.webchatQrImage, name: siteQrValues?.webchatQrName },
	                                { title: "LINE QR", src: siteQrValues?.lineQrImage, name: siteQrValues?.lineQrName },
	                              ].map((qr) => (
	                                <div key={qr.title} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
	                                  <div className="text-sm font-black text-slate-800">{qr.title}</div>
		                                  <div className="mt-1 text-xs font-semibold text-slate-500">{qr.name || (adminLanguage === "en" ? "No display name yet" : "暫無顯示名稱")}</div>
	                                  {qr.src ? (
	                                    <Image src={qr.src} alt={qr.title} width={112} height={112} className="mt-3 rounded-lg border border-slate-200 bg-white object-cover p-2" />
	                                  ) : (
	                                    <div className="mt-3 flex h-28 w-28 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white text-xs font-semibold text-slate-400">
		                                      {adminLanguage === "en" ? "No image yet" : "暫無圖片"}
	                                    </div>
	                                  )}
	                                </div>
	                              ))}
	                            </div>
	                            <Form.Item name="facebook" label="Facebook">
	                              <Input />
                            </Form.Item>
                            <Form.Item name="instagram" label="Instagram">
                              <Input />
                            </Form.Item>
                            <Form.Item name="youtube" label="YouTube">
                              <Input />
                            </Form.Item>
                          </div>
                        ),
                      },
                      {
                        key: "statistics",
                        label: copy.stats,
                        children: (
                          <Form.Item name="statisticsText" label={copy.statsData}>
                            <Input.TextArea rows={5} placeholder={copy.statisticsPlaceholder} />
                          </Form.Item>
                        ),
                      },
                    ]}
                  />
                </Form>
              </Card>
            )}
          </main>
        </div>
      </div>

      <Drawer
        title={copy.editService}
        open={drawerOpen}
        width={720}
        onClose={closeEditor}
        extra={
          <Button type="primary" icon={<SaveOutlined />} onClick={saveService}>
            {copy.save}
          </Button>
        }
      >
        <Form form={form} layout="vertical">
          <Tabs
            items={[
              {
                key: "base",
                label: copy.info,
                children: (
                  <div className="grid gap-x-4 md:grid-cols-2">
                    <Form.Item name="id" label={copy.slug} rules={[{ required: true, message: copy.required }]}>
                      <Input disabled placeholder="airport-transfer" />
                    </Form.Item>
                    <Form.Item name="groupCode" label={copy.group} rules={[{ required: true, message: copy.required }]}>
                      <Input placeholder="Transport" />
                    </Form.Item>
                    <Form.Item name="label" label={copy.chineseName} rules={[{ required: true, message: copy.required }]}>
                      <Input />
                    </Form.Item>
                    <Form.Item name="shortLabel" label={copy.shortName}>
                      <Input />
                    </Form.Item>
                    <Form.Item name="caption" label={copy.caption}>
                      <Input />
                    </Form.Item>
                    <Form.Item name="icon" label={copy.icon}>
                      <Input />
                    </Form.Item>
                    <Form.Item name="image" label={copy.image} rules={[{ required: true, message: copy.required }]}>
                      <div className="space-y-3">
                        <Upload accept="image/*" maxCount={1} showUploadList={false} beforeUpload={uploadServiceImageFile}>
                          <Button>
                            {adminLanguage === "en" ? "Choose image" : "選擇圖片"}
                          </Button>
                        </Upload>
                        {serviceImageValue ? (
                          <Image src={serviceImageValue} alt={copy.image} width={180} height={104} style={{ objectFit: "cover", borderRadius: 8 }} />
                        ) : (
                          <div className="flex h-26 w-44 items-center justify-center rounded border border-dashed border-slate-300 text-xs font-semibold text-slate-500">
                            {adminLanguage === "en" ? "No image selected" : "未選擇圖片"}
                          </div>
                        )}
                        <Input type="hidden" />
                      </div>
                    </Form.Item>
                    <Form.Item name="sortOrder" label={copy.order}>
                      <InputNumber className="w-full" min={0} />
                    </Form.Item>
                    <Form.Item name="featured" label={copy.featured} valuePropName="checked">
                      <Switch />
                    </Form.Item>
                    <Form.Item name="active" label={copy.visible} valuePropName="checked">
                      <Switch />
                    </Form.Item>
                  </div>
                ),
              },
              {
                key: "content",
                label: copy.content,
                children: (
                  <>
                    <Form.Item name="description" label={copy.description}>
                      <Input.TextArea rows={4} />
                    </Form.Item>
                    <Form.Item name="highlightsText" label="Highlights">
                      <Input.TextArea rows={3} placeholder={copy.serviceHighlightsPlaceholder} />
                    </Form.Item>
                  </>
                ),
              },
              {
                key: "catalog",
                label: copy.catalog,
                children: (
                  <Descriptions bordered column={1} size="small">
	                    <Descriptions.Item label="Intro">{selectedCatalog?.intro ?? (adminLanguage === "en" ? "No catalog" : "暫無目錄")}</Descriptions.Item>
	                    <Descriptions.Item label="Search">{selectedCatalog?.searchPlaceholder ?? (adminLanguage === "en" ? "Not set" : "暫無")}</Descriptions.Item>
                    <Descriptions.Item label="Filters">{selectedCatalog?.filters.length ?? 0}</Descriptions.Item>
                    <Descriptions.Item label="Options">{selectedCatalog?.options.length ?? 0}</Descriptions.Item>
                  </Descriptions>
                ),
              },
              {
                key: "pricing",
                label: copy.pricing,
                children: (
                  <Descriptions bordered column={1} size="small">
	                    <Descriptions.Item label={copy.priceFrom}>{selectedPricing?.priceFrom ?? (adminLanguage === "en" ? "No price" : "暫無價格")}</Descriptions.Item>
	                    <Descriptions.Item label={copy.note}>{selectedPricing?.note ?? (adminLanguage === "en" ? "Not set" : "暫無")}</Descriptions.Item>
                    <Descriptions.Item label="Plans">{selectedPricing?.plans.length ?? 0}</Descriptions.Item>
                  </Descriptions>
                ),
              },
            ]}
          />
        </Form>
      </Drawer>

      <CatalogItemModal
        adminLanguage={adminLanguage}
        copy={copy}
        form={optionForm}
        open={optionModalOpen}
        editingOptionIndex={editingOptionIndex}
        selectedBusinessCopy={selectedBusinessCopy}
        selectedPreset={selectedPreset}
        formLabel={formLabel}
        formPlaceholder={formPlaceholder}
        onCancel={closeOptionEditor}
        onSave={saveOption}
      />
    </ConfigProvider>
  );
}
