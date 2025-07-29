import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { Form, Input, Button, Typography, message, Card } from "antd";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const Login = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (values) => {
        const { email, password } = values;
        setLoading(true);
        try {
            // 1. Auth orqali tizimga kiritish
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2. Firestore dan user role ni olish
            const userDocRef = doc(db, "users", user.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                const role = userData.role;
                console.log(userData);

                message.success("Kirish muvaffaqiyatli amalga oshdi!");

                // 3. Role bo‘yicha navigate qilish
                if (role === "admin") {
                    navigate("/dashboard");
                } else if (role === "teacher") {
                    navigate("/teacher");
                } else if (role === "user") {
                    navigate("/courses");
                }
            } else {
                message.error("Foydalanuvchi ma'lumotlari topilmadi!");
            }

        } catch (error) {
            console.error(error);
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


// import { useState } from "react";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { auth } from "../firebase/config";
// import { Form, Input, Button, Typography, message, Card } from "antd";
// import { useNavigate } from "react-router-dom";

// const { Title } = Typography;

// const Login = () => {
//     const [loading, setLoading] = useState(false);
//     const navigate = useNavigate()

//     const handleLogin = async (values) => {
//         const { email, password } = values;
//         setLoading(true);
//         try {
//             await signInWithEmailAndPassword(auth, email, password);
//             message.success("Kirish muvaffaqiyatli amalga oshdi!");
//             navigate("/dashboard")
//             // 🔜 Yaqinda: navigate to dashboard
//         } catch (error) {
//             message.error("Email yoki parol xato!");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
//             <Card className="w-full max-w-md shadow-lg">
//                 <Title level={3} style={{ textAlign: "center" }}>
//                     Kirish
//                 </Title>
//                 <Form layout="vertical" onFinish={handleLogin}>
//                     <Form.Item
//                         label="Email"
//                         name="email"
//                         rules={[
//                             { required: true, message: "Iltimos, email kiriting!" },
//                             { type: "email", message: "Email noto‘g‘ri formatda!" }
//                         ]}
//                     >
//                         <Input placeholder="example@gmail.com" />
//                     </Form.Item>

//                     <Form.Item
//                         label="Parol"
//                         name="password"
//                         rules={[{ required: true, message: "Parolni kiriting!" }]}
//                     >
//                         <Input.Password placeholder="Parol" />
//                     </Form.Item>

//                     <Form.Item>
//                         <Button type="primary" htmlType="submit" block loading={loading}>
//                             Kirish
//                         </Button>
//                     </Form.Item>
//                 </Form>
//             </Card>
//         </div>
//     );
// };

// export default Login;
