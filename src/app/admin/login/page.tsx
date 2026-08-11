"use client";

import { LockOutlined, LoginOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card, ConfigProvider, Form, Input, Typography, message, theme } from "antd";
import { LOGO_SRC } from "@/data/assets";
import { siteConfig } from "@/data/site";
import Image from "next/image";
import { useRouter } from "next/navigation";

type LoginValues = {
  username: string;
  password: string;
};

export default function AdminLoginPage() {
  const router = useRouter();

  const handleLogin = (values: LoginValues) => {
    if (values.username.trim() && values.password.trim()) {
      localStorage.setItem("anvid_admin_session", "demo");
      message.success("Login successful");
      router.push("/admin");
      return;
    }

    message.error("Please enter username and password");
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: "#0f4c81",
          borderRadius: 8,
          fontFamily: "Inter, system-ui, sans-serif",
        },
      }}
    >
      <main className="min-h-screen bg-[#f4f7fb]">
        <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
          <section className="hidden bg-[#081827] px-12 py-10 text-white lg:flex lg:flex-col lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                {LOGO_SRC && (
                  <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-white/10">
                    <Image src={LOGO_SRC} alt="An Khai Travel logo" fill sizes="48px" className="object-contain" />
                  </div>
                )}
                <div>
                  <div className="text-2xl font-black tracking-normal">An Khai Travel</div>
                  <div className="text-sm font-black text-amber-300">{siteConfig.legalNameZh}</div>
                </div>
              </div>
              <div className="mt-2 text-sm font-semibold text-slate-300">Admin Console</div>
            </div>
            <div className="max-w-xl">
              <Typography.Title level={1} style={{ color: "white", marginBottom: 16 }}>
                Bilingual Travel Service Management
              </Typography.Title>
              <Typography.Paragraph style={{ color: "rgba(255,255,255,0.72)", fontSize: 16 }}>
                Add, edit, publish services, and prepare Chinese/English content for the website.
              </Typography.Paragraph>
            </div>
            <div className="text-sm text-slate-400">Vietnam travel services · zh/en content</div>
          </section>

          <section className="flex items-center justify-center px-4 py-10">
            <Card className="w-full max-w-[420px] shadow-sm" styles={{ body: { padding: 32 } }}>
              <div className="mb-7">
                <Typography.Title level={2} style={{ marginBottom: 6 }}>
                  Admin Login
                </Typography.Title>
                <Typography.Text type="secondary">Access the An Khai Travel content console.</Typography.Text>
              </div>

              <Form layout="vertical" size="large" onFinish={handleLogin}>
                <Form.Item name="username" label="Username" rules={[{ required: true, message: "Enter username" }]}>
                  <Input prefix={<UserOutlined />} placeholder="admin" autoComplete="username" />
                </Form.Item>
                <Form.Item name="password" label="Password" rules={[{ required: true, message: "Enter password" }]}>
                  <Input.Password prefix={<LockOutlined />} placeholder="••••••••" autoComplete="current-password" />
                </Form.Item>
                <Button type="primary" htmlType="submit" icon={<LoginOutlined />} block>
                  Login
                </Button>
              </Form>
            </Card>
          </section>
        </div>
      </main>
    </ConfigProvider>
  );
}
