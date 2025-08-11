import { useEffect, useState } from "react";
import { auth, db } from "../../firebase/config";
import {
    updateEmail,
    updatePassword,
    updateProfile,
    EmailAuthProvider,
    reauthenticateWithCredential,
} from "firebase/auth";
import {
    doc,
    getDoc,
    updateDoc,
} from "firebase/firestore";
import {
    Typography,
    Card,
    Form,
    Input,
    Button,
    message,
    Upload,
    Avatar,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useAuthState } from "react-firebase-hooks/auth";

const { Title } = Typography;

const EditProfile = () => {
    const [user] = useAuthState(auth);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [initialData, setInitialData] = useState({});
    const [messageApi, contextHolder] = message.useMessage();
    const success = (text) => {
        messageApi.open({
            type: 'success',
            content: 'Muvaffaqiyatli saqlandi',
        });
    };
    const error = (text) => {
        messageApi.open({
            type: 'error',
            content: "O'zgarishda xatolik yuz berdi",
        });
    };


    useEffect(() => {
        const fetchUserData = async () => {
            if (!user) return;
            try {
                const userRef = doc(db, "users", user.uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    setInitialData(userSnap.data());
                    form.setFieldsValue({
                        fullName: userSnap.data().fullName,
                        name: userSnap.data().name,
                        email: user.email,
                        photoURL: user.photoURL,
                    });
                }
            } catch (err) {
                console.error("Error fetching user data:", err);
            }
        };

        fetchUserData();
    }, [user]);

    const handleFinish = async (values) => {
        setLoading(true);
        try {
            // 👇 Re-authenticate
            const credential = EmailAuthProvider.credential(user.email, values.currentPassword);
            await reauthenticateWithCredential(user, credential);

            // ✅ Endi update qilishga ruxsat bor
            await updateProfile(user, {
                displayName: values.fullName,
                photoURL: values.photoURL,
            });

            if (values.email && values.email !== user.email) {
                await updateEmail(user, values.email);
            }

            if (values.password) {
                await updatePassword(user, values.password);
            }

            await updateDoc(doc(db, "users", user.uid), {
                fullName: values.fullName,
                name: values.name,
                email: values.email,
                photoURL: values.photoURL,
            });

            message.success("Profil yangilandi!");
            success()
        } catch (err) {
            error()
            console.error("Update error:", err);
            message.error(err.message || "Xatolik yuz berdi");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 max-w-xl mx-auto">
            {contextHolder}

            <Card title="📝 Profilni tahrirlash">
                <div className="flex justify-center mb-4">
                    <Avatar src={form?.photoURL} size={80} />
                </div>

                <Form layout="vertical" form={form} onFinish={handleFinish}>
                    <Form.Item label="To‘liq ism" name="fullName" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label="Foydalanuvchi nomi" name="name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label="Email" name="email" rules={[{ required: true, type: "email" }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Ma'lumotni o'zgartirish uchun parolingizni kiriting"
                        name="currentPassword"
                        rules={[{ required: true, message: "Hozirgi parolni kiriting" }]}
                    >
                        <Input.Password />
                    </Form.Item>


                    <Form.Item label="Rasm (photoURL)" name="photoURL">
                        <Input placeholder="https://..." />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} block>
                            Saqlash
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default EditProfile;
