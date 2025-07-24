import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";
import { Form, Input, Button, Typography, message, Card } from "antd";

const { Title } = Typography;

const Register = () => {
  const [loading, setLoading] = useState(false);

  const handleRegister = async (values) => {
    console.log(values);

    const { email, password } = values;
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      message.success("Ro'yxatdan muvaffaqiyatli o'tdingiz!");
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <Title level={3} style={{ textAlign: "center" }}>
          Ro'yxatdan o'tish
        </Title>
        <Form layout="vertical" onFinish={handleRegister}>
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
            rules={[
              { required: true, message: "Iltimos, parol kiriting!" },
              { min: 6, message: "Parol kamida 6 ta belgidan iborat bo'lishi kerak!" }
            ]}
          >
            <Input.Password placeholder="Parol" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Ro‘yxatdan o‘tish
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Register;
