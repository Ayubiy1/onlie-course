// src/layouts/UserLayout.jsx
import { Button, Layout, Menu } from "antd";
import {
    BookOutlined,
    UserOutlined,
    HomeOutlined,
    LogoutOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
} from "@ant-design/icons";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";

import { auth } from "../firebase/config";
import { useLocalStorageState } from "ahooks";

const { Header, Content, Sider } = Layout;

const UserLayout = () => {
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useLocalStorageState("userLayoutCollapsed", {
        defaultValue: false
    })
    const [selectedKeys, setSelectedKeys] = useLocalStorageState("userLayoutSelectedKeys", {
        defaultValue: 1
    })


    const handleLogout = async () => {
        await auth.signOut();
        navigate("/login");
    };

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider breakpoint="lg" collapsed={collapsed}>
                <div className="text-white text-center py-4 font-bold text-lg">🎓 {!collapsed && 'EduPlatform'}</div>

                <Menu theme="dark" mode="inline" defaultSelectedKeys={[`${selectedKeys}`]}>
                    <Menu.Item key="1" icon={<HomeOutlined />} onClick={() => {
                        navigate("/user-dashboard");
                        setSelectedKeys('1')
                    }}>
                        Bosh sahifa
                    </Menu.Item>

                    <Menu.Item key="2" icon={<BookOutlined />} onClick={() => {
                        navigate("/courses");
                        setSelectedKeys('2')
                    }}>
                        Barcha kurslar
                    </Menu.Item>

                    <Menu.Item key="3" icon={<BookOutlined />} onClick={() => {
                        navigate("/my-courses");
                        setSelectedKeys('3')
                    }}>
                        Mening kurslarim
                    </Menu.Item>

                    <Menu.Item key="4" icon={<UserOutlined />} onClick={() => {
                        navigate("/profile");
                        setSelectedKeys('4')
                    }}>
                        Profil
                    </Menu.Item>

                    {/* <Menu.Item key="/logout" icon={<LogoutOutlined />} onClick={handleLogout}>
                        Chiqish
                    </Menu.Item> */}
                </Menu>
            </Sider>
            <Layout>
                <Header className="bg-white px-4 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white">
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
                        <h1 className="text-lg font-semibold">👤 Foydalanuvchi Paneli</h1>
                    </div>
                    <Button type="primary" onClick={handleLogout} icon={<LogoutOutlined />}>
                        Chiqish
                    </Button>
                </Header>
                <Content className="m-4 bg-white p-6 rounded shadow-sm">
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default UserLayout;
