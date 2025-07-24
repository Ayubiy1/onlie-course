import { useEffect, useState } from "react";
import { Table, Typography, Button, Modal, Form, Input, message, Popconfirm } from "antd";
import { db } from "../../firebase/config";
import {
    collection,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
} from "firebase/firestore";

const { Title } = Typography;

const Courses = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [courses, setCourses] = useState([]);
    const [form] = Form.useForm();
    const [editingCourse, setEditingCourse] = useState(null); // null => add, else => edit
    const [loading, setLoading] = useState(false);


    const fetchCourses = async () => {
        try {
            setLoading(true);
            const querySnapshot = await getDocs(collection(db, "courses"));
            const fetchedCourses = [];
            querySnapshot.forEach((doc) => {
                fetchedCourses.push({ key: doc.id, ...doc.data() });
            });
            setCourses(fetchedCourses);
        } catch (error) {
            message.error("Kurslarni yuklashda xatolik yuz berdi.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const handleCancel = () => {
        form.resetFields();
        setEditingCourse(null);
        setIsModalOpen(false);
    };

    const handleAddOrEditCourse = async () => {
        try {
            setLoading(true);
            // 1. Formadagi barcha maydonlarni tekshirib, qiymatlarni olish
            const values = await form.validateFields();

            if (editingCourse) {
                // Agar tahrir qilinayotgan kurs mavjud bo‘lsa (ya'ni edit rejimi)

                // 2. Firestoredagi tahrir qilinayotgan hujjatga havola olish
                const docRef = doc(db, "courses", editingCourse.key);

                // 3. Firestore hujjatini yangilash
                await updateDoc(docRef, values);

                // 4. Frontendda courses massivini yangilash (kurslar ro'yxatida ko'rinishi uchun)
                const updatedCourses = courses.map((course) =>
                    course.key === editingCourse.key ? { ...course, ...values } : course
                );

                // 5. Yangilangan kurslar ro‘yxatini statega saqlash
                setCourses(updatedCourses);

                // 6. Tahrir holatini tozalash
                setEditingCourse(null);

                message.success("Kurs muvaffaqiyatli yangilandi");
            } else {
                // Aks holda (ya'ni yangi kurs qo‘shilsa)

                // 2. Firestore ga yangi hujjat qo‘shish
                const docRef = await addDoc(collection(db, "courses"), values);

                // 3. Yangi kursni frontenddagi ro‘yxatga qo‘shish
                fetchCourses();
                // setCourses([...courses, { key: docRef.id, ...values }]);

                message.success("Kurs muvaffaqiyatli qo‘shildi");
            }

            // 7. Modalni yopish va formani tozalash
            form.resetFields();
            setIsModalOpen(false);

        } catch (error) {
            console.error("Kurs qo‘shishda/tahrirlashda xatolik:", error);
            message.error("Amalni bajarishda xatolik yuz berdi");
        } finally {
            setLoading(false);
        }
    };


    // const handleAddOrEditCourse = async () => {
    //     try {
    //         const values = await form.validateFields();

    //         if (editingCourse) {
    //             // 🔁 Update mavjud kurs
    //             const docRef = doc(db, "courses", editingCourse.key);
    //             await updateDoc(docRef, values);
    //             const updatedCourses = courses.map((course) =>
    //                 course.key === editingCourse.key ? { ...course, ...values } : course
    //             );
    //             setCourses(updatedCourses);
    //             message.success("Kurs yangilandi");
    //         } else {
    //             // ➕ Yangi kurs qo‘shish
    //             const docRef = await addDoc(collection(db, "courses"), values);
    //             setCourses([...courses, { key: docRef.id, ...values }]);
    //             message.success("Yangi kurs qo‘shildi");
    //         }

    //         handleCancel();
    //     } catch (error) {
    //         console.error("Kurs qo‘shishda xatolik:", error);
    //         message.error("Kursni saqlashda xatolik");
    //     }
    // };

    const handleEdit = (course) => {
        setEditingCourse(course);
        form.setFieldsValue(course);
        setIsModalOpen(true);
    };

    const handleDelete = async (key) => {
        try {
            await deleteDoc(doc(db, "courses", key));
            setCourses(courses.filter((course) => course.key !== key));
            message.success("Kurs o‘chirildi");
        } catch (error) {
            message.error("Kursni o‘chirishda xatolik");
        }
    };

    const columns = [
        {
            title: "Nomi",
            dataIndex: "title",
            key: "title",
        },
        {
            title: "Izoh",
            dataIndex: "description",
            key: "description",
        },
        {
            title: "Narxi",
            dataIndex: "price",
            key: "price",
            render: (price) => `${price?.toLocaleString()} so'm`,
        },
        {
            title: "Rasm",
            dataIndex: "image",
            key: "image",
            render: (url) => <img src={url} alt="Kurs" style={{ width: 60, height: 40, objectFit: "cover" }} />,
        },
        {
            title: "Amallar",
            key: "action",
            render: (_, course) => (
                <div className="flex gap-2">
                    <Button onClick={() => handleEdit(course)}>Tahrirlash</Button>
                    <Popconfirm
                        title="Ishonchingiz komilmi?"
                        okText="Ha"
                        cancelText="Yo‘q"
                        onConfirm={() => handleDelete(course.key)}
                    >
                        <Button danger>O‘chirish</Button>
                    </Popconfirm>
                </div>
            ),
        },
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <Title level={3}>📚 Kurslar</Title>
                <Button type="primary" onClick={() => setIsModalOpen(true)}>
                    + Kurs qo‘shish
                </Button>
            </div>

            <Table dataSource={courses} columns={columns} loading={loading} />

            <Modal
                title={editingCourse ? "Kursni tahrirlash" : "Yangi kurs qo‘shish"}
                open={isModalOpen}
                onOk={handleAddOrEditCourse}
                onCancel={handleCancel}
                okText={editingCourse ? "Saqlash" : "Qo‘shish"}
                cancelText="Bekor qilish"
                confirmLoading={loading}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Kurs nomi"
                        name="title"
                        rules={[{ required: true, message: "Kurs nomini kiriting" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Izoh"
                        name="description"
                        rules={[{ required: true, message: "Izohni kiriting" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Rasm URL"
                        name="image"
                        rules={[{ required: true, message: "Rasm URL ni kiriting" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Narx"
                        name="price"
                        rules={[{ required: true, message: "Narxni kiriting" }]}
                    >
                        <Input type="number" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Courses;


// import { useEffect, useState } from "react";
// import { Table, Typography, Button, Modal, Form, Input, message } from "antd";
// import { db } from "../../firebase/config";
// import { collection, addDoc, getDocs } from "firebase/firestore";

// const { Title } = Typography;

// const Courses = () => {
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [courses, setCourses] = useState([]);
//     const [form] = Form.useForm();

//     // 🔽 Kurslarni Firestore'dan olish
//     // Firestore'dan kurslarni olish:
//     const fetchCourses = async () => {
//         try {
//             const querySnapshot = await getDocs(collection(db, "courses"));
//             const fetchedCourses = [];
//             querySnapshot.forEach((doc) => {
//                 const data = doc.data();
//                 // Field nomlarini o‘zgartirish:
//                 fetchedCourses.push({
//                     key: doc.id,
//                     title: data.title,
//                     name: data.description,  // 👈 description -> name
//                     img: data.image,         // 👈 image -> img
//                     price: data.price,
//                 });
//             });
//             setCourses(fetchedCourses);
//         } catch (error) {
//             console.error("Kurslarni olishda xatolik:", error);
//             message.error("Kurslarni yuklashda xatolik yuz berdi.");
//         }
//     };

//     useEffect(() => {
//         fetchCourses();
//     }, []);

//     const handleCancel = () => {
//         form.resetFields();
//         setIsModalOpen(false);
//     };

//     const handleAddCourse = async () => {
//         try {
//             const values = await form.validateFields();

//             // 🔄 Form qiymatlarini Firestore formatiga moslab:
//             const formatted = {
//                 title: values.title,
//                 description: values.name,  // 👈 name -> description
//                 image: values.img,         // 👈 img -> image
//                 price: values.price,
//             };

//             const docRef = await addDoc(collection(db, "courses"), formatted);

//             // Jadvalga qo‘shishda esa o‘zgarishsiz:
//             setCourses([...courses, { key: docRef.id, ...values }]);
//             handleCancel();
//             message.success("Kurs qo‘shildi");
//         } catch (error) {
//             console.error("Kurs qo‘shishda xatolik:", error);
//             message.error("Kurs qo‘shishda xatolik");
//         }
//     };



//     const columns = [
//         {
//             title: "Kurs nomi",
//             dataIndex: "title",
//             key: "title",
//         },
//         {
//             title: "Izoh",
//             dataIndex: "name",
//             key: "name",
//         },
//         {
//             title: "Narxi (so'm)",
//             dataIndex: "price",
//             key: "price",
//             render: (price) => price ? `${price.toLocaleString()} so'm` : "-",
//         },
//         {
//             title: "Rasm",
//             dataIndex: "img",
//             key: "img",
//             render: (url) =>
//                 url ? (
//                     <img
//                         src={url}
//                         alt="Kurs"
//                         style={{ width: 60, height: 40, objectFit: "cover" }}
//                     />
//                 ) : (
//                     "-"
//                 ),
//         },
//     ];

//     return (
//         <div>
//             <div className="flex justify-between items-center mb-4">
//                 <Title level={3}>📚 Kurslar</Title>
//                 <Button type="primary" onClick={() => setIsModalOpen(true)}>
//                     + Kurs qo‘shish
//                 </Button>
//             </div>

//             <Table dataSource={courses} columns={columns} />

//             <Modal
//                 title="Yangi kurs qo‘shish"
//                 open={isModalOpen}
//                 onOk={handleAddCourse}
//                 onCancel={handleCancel}
//                 okText="Qo‘shish"
//                 cancelText="Bekor qilish"
//             >
//                 <Form form={form} layout="vertical">
//                     <Form.Item
//                         label="Kurs nomi"
//                         name="title"
//                         rules={[{ required: true, message: "Kurs nomini kiriting" }]}
//                     >
//                         <Input placeholder="Masalan: ReactJS Boshlang'ich" />
//                     </Form.Item>

//                     <Form.Item
//                         label="Izoh"
//                         name="name" // frontendda `name`, lekin Firestorega `description` sifatida yuboramiz
//                         rules={[{ required: true, message: "Kurs izohini kiriting" }]}
//                     >
//                         <Input placeholder="Masalan: React asoslarini o‘rganamiz" />
//                     </Form.Item>

//                     <Form.Item
//                         label="Narxi (so'm)"
//                         name="price"
//                         rules={[{ required: true, message: "Narxni kiriting" }]}
//                     >
//                         <Input type="number" placeholder="Masalan: 299000" />
//                     </Form.Item>

//                     <Form.Item
//                         label="Rasm URL"
//                         name="img" // frontendda `img`, lekin Firestorega `image` sifatida yuboramiz
//                         rules={[{ required: true, message: "Rasm URL ni kiriting" }]}
//                     >
//                         <Input placeholder="Masalan: https://image-link.com/rasm.jpg" />
//                     </Form.Item>
//                 </Form>

//             </Modal>
//         </div>
//     );
// };

// export default Courses;