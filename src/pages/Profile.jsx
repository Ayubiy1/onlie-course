import { useEffect, useState } from "react";
import { Typography, Card, Descriptions, Button, Modal, Form, Input, message } from "antd";
import { auth } from "../firebase/config";
import { updateProfile } from "firebase/auth";

const { Title } = Typography;

const Profile = () => {
    const [user, setUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const currentUser = auth.currentUser;
        setUser(currentUser);
    }, []);

    const handleOpenModal = () => {
        form.setFieldsValue({
            displayName: user?.displayName || ""
        });
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        form.resetFields();
        setIsModalOpen(false);
    };

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);
            await updateProfile(auth.currentUser, {
                displayName: values.displayName
            });
            setUser({ ...auth.currentUser }); // yangilangan user holatini qayta o‘qiymiz
            message.success("Profil yangilandi");
            handleCancel();
        } catch (error) {
            message.error("Profilni yangilashda xatolik yuz berdi");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Title level={3}>👤 Profil</Title>

            <Card
                extra={<Button type="primary" onClick={handleOpenModal}>Tahrirlash</Button>}
            >
                {user ? (
                    <Descriptions bordered column={1}>
                        <Descriptions.Item label="Ism">{user.displayName || "Noma'lum"}</Descriptions.Item>
                        <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
                        <Descriptions.Item label="Ro'yxatdan o'tgan vaqt">{new Date(user.metadata.creationTime).toLocaleString()}</Descriptions.Item>
                        <Descriptions.Item label="Oxirgi kirgan vaqt">{new Date(user.metadata.lastSignInTime).toLocaleString()}</Descriptions.Item>
                    </Descriptions>
                ) : (
                    <p>Foydalanuvchi ma'lumotlari topilmadi.</p>
                )}
            </Card>

            <Modal
                title="Profilni tahrirlash"
                open={isModalOpen}
                onOk={handleSave}
                onCancel={handleCancel}
                confirmLoading={loading}
                okText="Saqlash"
                cancelText="Bekor qilish"
            >
                <Form layout="vertical" form={form}>
                    <Form.Item
                        label="Ism"
                        name="displayName"
                        rules={[{ required: true, message: "Ismni kiriting" }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Profile;
