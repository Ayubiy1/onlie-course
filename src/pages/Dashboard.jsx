import { Layout, Menu, Typography, Button } from "antd";
import {
    LogoutOutlined,
    DashboardOutlined,
    BookOutlined,
    UserOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined
} from "@ant-design/icons";
import { signOut } from "firebase/auth";
import { Outlet, useNavigate } from "react-router-dom";
import { auth } from "../firebase/config";
import { useState } from "react";
import { useLocalStorageState } from "ahooks";

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

const Dashboard = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [choosedMenu, setChoosedMenu] = useLocalStorageState("choosedMenu", {
        defaultValue: 1
    })

    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut(auth);
        navigate("/login");
    };

    return (
        <Layout style={{ minHeight: "100vh" }}>
            {/* Sider (chap menyu) */}
            <Sider breakpoint="lg" collapsed={collapsed}>
                <div className="text-white text-center py-4 text-xl font-bold">
                    LMS
                </div>
                <div className="demo-logo-vertical" />

                <Menu theme="dark" mode="inline" defaultSelectedKeys={[`${choosedMenu}`]}>
                    <Menu.Item key="1" icon={<DashboardOutlined />} onClick={() => {
                        navigate("/dashboard")
                        setChoosedMenu(1);
                    }}>
                        Bosh sahifa
                    </Menu.Item>
                    <Menu.Item key="2" icon={<BookOutlined />} onClick={() => {
                        navigate("/dashboard/courses")
                        setChoosedMenu(2);
                    }}>
                        Kurslar
                    </Menu.Item>
                    <Menu.Item key="3" icon={<UserOutlined />} onClick={() => {
                        navigate("/dashboard/profile")
                        setChoosedMenu(3);
                    }}>
                        Profil
                    </Menu.Item>
                </Menu>
            </Sider>

            {/* Asosiy qism */}
            <Layout>
                <Header className="bg-white flex justify-between items-center px-6 shadow">
                    <div className="flex items-center gap-3 text-white.">
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            style={{
                                fontSize: '16px',
                                width: 64,
                                height: 64,
                                color: "white"
                            }}
                        />
                        <Title level={4} style={{ margin: 0, color: "white" }} className="text-white">
                            Dashboard
                        </Title>
                    </div>
                    <Button type="primary" danger icon={<LogoutOutlined />} onClick={handleLogout}>
                        Chiqish
                    </Button>
                </Header>
                <Content className="p-6 bg-gray-50">
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default Dashboard;
