import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";
import { Form, Input, Button, Typography, message, Card } from "antd";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const Login = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()

    const handleLogin = async (values) => {
        const { email, password } = values;
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            message.success("Kirish muvaffaqiyatli amalga oshdi!");
            navigate("/dashboard")
            // 🔜 Yaqinda: navigate to dashboard
        } catch (error) {
            message.error("Email yoki parol xato!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <Card className="w-full max-w-md shadow-lg">
                <Title level={3} style={{ textAlign: "center" }}>
                    Kirish
                </Title>
                <Form layout="vertical" onFinish={handleLogin}>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: "Iltimos, email kiriting!" },
                            { type: "email", message: "Email noto‘g‘ri formatda!" }
                        ]}
                    >
                        <Input placeholder="example@gmail.com" />
                    </Form.Item>

                    <Form.Item
                        label="Parol"
                        name="password"
                        rules={[{ required: true, message: "Parolni kiriting!" }]}
                    >
                        <Input.Password placeholder="Parol" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block loading={loading}>
                            Kirish
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default Login;
