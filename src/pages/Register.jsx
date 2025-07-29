import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/config";
import { doc, setDoc } from "firebase/firestore";
import { Form, Input, Button, Typography, message, Card } from "antd";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const handleRegister = async (values) => {
    const { email, password, name } = values;
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email,
        name,
        role: "user",
        createdAt: new Date()
      });


      // await setDoc(doc(db, "users", user.uid), {
      //     uid: user.uid,
      //     email,
      //     name,
      //     role: "user",
      //     createdAt: new Date()
      // });

      message.success("Ro'yxatdan o'tish muvaffaqiyatli yakunlandi!");
      navigate("/login"); // ✅ Bu yerda login sahifasiga yo‘naltiryapmiz
    } catch (err) {
      console.error(err);
      message.error("Ro'yxatdan o'tishda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };


  // const handleRegister = async (values) => {
  //     const { email, password, name } = values;
  //     console.log("values", values);

  //     setLoading(true);

  //     try {
  //         const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  //         const user = userCredential.user; // 👈 aynan user shu yerda!

  //         await setDoc(doc(db, "users", user.uid), {
  //             uid: user.uid,
  //             email,
  //             name,
  //             role: "user",
  //             createdAt: new Date()
  //         });
  //         console.log("user", user);


  //         // ✅ Firestore'da users collection ga qo‘shamiz
  //         // await setDoc(doc(db, "users", user.uid), {
  //         //     uid: user.uid,
  //         //     email,
  //         //     name,
  //         //     role: "user", // default role — kerak bo‘lsa keyinchalik 'admin' yoki 'teacher' qilib o‘zgartirasiz
  //         //     createdAt: new Date()
  //         // });

  //         message.success("Ro‘yxatdan o‘tish muvaffaqiyatli!");
  //         navigate("/login");
  //     } catch (error) {
  //         console.error(error);
  //         message.error("Ro‘yxatdan o‘tishda xatolik: " + error.message);
  //     } finally {
  //         setLoading(false);
  //     }
  // };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <Title level={3} style={{ textAlign: "center" }}>
          Ro‘yxatdan o‘tish
        </Title>
        <Form layout="vertical" onFinish={handleRegister}>
          <Form.Item
            label="Ism"
            name="name"
            rules={[{ required: true, message: "Ismingizni kiriting!" }]}
          >
            <Input placeholder="Ism" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Emailni kiriting!" },
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
              Ro‘yxatdan o‘tish
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Register;

// import { useState } from "react";
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { auth } from "../firebase/config";
// import { Form, Input, Button, Typography, message, Card } from "antd";

// const { Title } = Typography;

// const Register = () => {
//   const [loading, setLoading] = useState(false);

//   const handleRegister = async (values) => {
//     console.log(values);

//     const { email, password } = values;
//     setLoading(true);
//     try {
//       await createUserWithEmailAndPassword(auth, email, password);
//       message.success("Ro'yxatdan muvaffaqiyatli o'tdingiz!");
//     } catch (error) {
//       message.error(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
//       <Card className="w-full max-w-md shadow-lg">
//         <Title level={3} style={{ textAlign: "center" }}>
//           Ro'yxatdan o'tish
//         </Title>
//         <Form layout="vertical" onFinish={handleRegister}>
//           <Form.Item
//             label="Email"
//             name="email"
//             rules={[
//               { required: true, message: "Iltimos, email kiriting!" },
//               { type: "email", message: "Email noto‘g‘ri formatda!" }
//             ]}
//           >
//             <Input placeholder="example@gmail.com" />
//           </Form.Item>

//           <Form.Item
//             label="Parol"
//             name="password"
//             rules={[
//               { required: true, message: "Iltimos, parol kiriting!" },
//               { min: 6, message: "Parol kamida 6 ta belgidan iborat bo'lishi kerak!" }
//             ]}
//           >
//             <Input.Password placeholder="Parol" />
//           </Form.Item>

//           <Form.Item>
//             <Button type="primary" htmlType="submit" block loading={loading}>
//               Ro‘yxatdan o‘tish1
//             </Button>
//           </Form.Item>
//         </Form>
//       </Card>
//     </div>
//   );
// };

// export default Register;
