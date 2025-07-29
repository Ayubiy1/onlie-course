import { useEffect, useState } from "react";
import {
    Table, Typography, Button, Modal,
    Form, Input, message, Popconfirm, Select
} from "antd";
import { db } from "../firebase/config";
import {
    collection, addDoc, getDocs,
    updateDoc, deleteDoc, doc
} from "firebase/firestore";

const { Title } = Typography;

const Courses = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [courses, setCourses] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [form] = Form.useForm();
    const [editingCourse, setEditingCourse] = useState(null);
    const [loading, setLoading] = useState(false);

    // 🔄 Kurslar va teacherlarni yuklash
    const fetchCourses = async () => {
        try {
            setLoading(true);
            const snapshot = await getDocs(collection(db, "courses"));
            const data = snapshot.docs.map(doc => ({
                key: doc.id,
                ...doc.data(),
            }));
            setCourses(data);
        } catch (err) {
            message.error("Kurslarni yuklashda xatolik");
        } finally {
            setLoading(false);
        }
    };

    const fetchTeachers = async () => {
        try {
            const snapshot = await getDocs(collection(db, "teachers"));
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                name: `${doc.data().name} ${doc.data().surname}`,
            }));
            setTeachers(data);
        } catch (err) {
            console.error(err);
            message.error("Teacherlarni yuklab bo‘lmadi");
        }
    };

    useEffect(() => {
        fetchCourses();
        fetchTeachers();
    }, []);

    const handleCancel = () => {
        form.resetFields();
        setEditingCourse(null);
        setIsModalOpen(false);
    };

    const handleAddOrEditCourse = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();

            if (editingCourse) {
                const docRef = doc(db, "courses", editingCourse.key);
                await updateDoc(docRef, values);
                const updatedCourses = courses.map((course) =>
                    course.key === editingCourse.key ? { ...course, ...values } : course
                );
                setCourses(updatedCourses);
                setEditingCourse(null);
                message.success("Kurs yangilandi");
            } else {
                await addDoc(collection(db, "courses"), values);
                fetchCourses(); // listni yangilaymiz
                message.success("Yangi kurs qo‘shildi");
            }

            form.resetFields();
            setIsModalOpen(false);
        } catch (err) {
            console.error(err);
            message.error("Saqlashda xatolik yuz berdi");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (course) => {
        setEditingCourse(course);
        form.setFieldsValue(course);
        setIsModalOpen(true);
    };

    const handleDelete = async (key) => {
        try {
            await deleteDoc(doc(db, "courses", key));
            setCourses(courses.filter(c => c.key !== key));
            message.success("Kurs o‘chirildi");
        } catch (err) {
            message.error("O‘chirishda xatolik");
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
            title: "Teacher",
            dataIndex: "teacherId",
            key: "teacherId",
            render: (id) => {
                const found = teachers.find(t => t.id === id);
                return found ? found.name : "Noma'lum";
            }
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
                    <Form.Item
                        label="O‘qituvchi"
                        name="teacherId"
                        rules={[{ required: true, message: "Teacher tanlang" }]}
                    >
                        <Select placeholder="Teacher tanlang">
                            {teachers.map((t) => (
                                <Select.Option key={t.id} value={t.id}>
                                    {t.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Courses;


// import { useEffect, useState } from "react";
// import { Table, Typography, Button, Modal, Form, Input, message, Popconfirm } from "antd";
// import { db } from "../firebase/config";
// import {
//     collection,
//     addDoc,
//     getDocs,
//     updateDoc,
//     deleteDoc,
//     doc,
// } from "firebase/firestore";

// const { Title } = Typography;

// const Courses = () => {
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [courses, setCourses] = useState([]);
//     const [form] = Form.useForm();
//     const [editingCourse, setEditingCourse] = useState(null); // null => add, else => edit
//     const [loading, setLoading] = useState(false);


//     const fetchCourses = async () => {
//         try {
//             setLoading(true);
//             const querySnapshot = await getDocs(collection(db, "courses"));
//             const fetchedCourses = [];
//             querySnapshot.forEach((doc) => {
//                 fetchedCourses.push({ key: doc.id, ...doc.data() });
//             });
//             setCourses(fetchedCourses);
//         } catch (error) {
//             message.error("Kurslarni yuklashda xatolik yuz berdi.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchCourses();
//     }, []);

//     const handleCancel = () => {
//         form.resetFields();
//         setEditingCourse(null);
//         setIsModalOpen(false);
//     };

//     const handleAddOrEditCourse = async () => {
//         try {
//             setLoading(true);
//             // 1. Formadagi barcha maydonlarni tekshirib, qiymatlarni olish
//             const values = await form.validateFields();

//             if (editingCourse) {
//                 // Agar tahrir qilinayotgan kurs mavjud bo‘lsa (ya'ni edit rejimi)

//                 // 2. Firestoredagi tahrir qilinayotgan hujjatga havola olish
//                 const docRef = doc(db, "courses", editingCourse.key);

//                 // 3. Firestore hujjatini yangilash
//                 await updateDoc(docRef, values);

//                 // 4. Frontendda courses massivini yangilash (kurslar ro'yxatida ko'rinishi uchun)
//                 const updatedCourses = courses.map((course) =>
//                     course.key === editingCourse.key ? { ...course, ...values } : course
//                 );

//                 // 5. Yangilangan kurslar ro‘yxatini statega saqlash
//                 setCourses(updatedCourses);

//                 // 6. Tahrir holatini tozalash
//                 setEditingCourse(null);

//                 message.success("Kurs muvaffaqiyatli yangilandi");
//             } else {
//                 // Aks holda (ya'ni yangi kurs qo‘shilsa)

//                 // 2. Firestore ga yangi hujjat qo‘shish
//                 const docRef = await addDoc(collection(db, "courses"), values);

//                 // 3. Yangi kursni frontenddagi ro‘yxatga qo‘shish
//                 fetchCourses();
//                 // setCourses([...courses, { key: docRef.id, ...values }]);

//                 message.success("Kurs muvaffaqiyatli qo‘shildi");
//             }

//             // 7. Modalni yopish va formani tozalash
//             form.resetFields();
//             setIsModalOpen(false);

//         } catch (error) {
//             console.error("Kurs qo‘shishda/tahrirlashda xatolik:", error);
//             message.error("Amalni bajarishda xatolik yuz berdi");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleEdit = (course) => {
//         setEditingCourse(course);
//         form.setFieldsValue(course);
//         setIsModalOpen(true);
//     };

//     const handleDelete = async (key) => {
//         try {
//             await deleteDoc(doc(db, "courses", key));
//             setCourses(courses.filter((course) => course.key !== key));
//             message.success("Kurs o‘chirildi");
//         } catch (error) {
//             message.error("Kursni o‘chirishda xatolik");
//         }
//     };

//     const columns = [
//         {
//             title: "Nomi",
//             dataIndex: "title",
//             key: "title",
//         },
//         {
//             title: "Izoh",
//             dataIndex: "description",
//             key: "description",
//         },
//         {
//             title: "Narxi",
//             dataIndex: "price",
//             key: "price",
//             render: (price) => `${price?.toLocaleString()} so'm`,
//         },
//         {
//             title: "Rasm",
//             dataIndex: "image",
//             key: "image",
//             render: (url) => <img src={url} alt="Kurs" style={{ width: 60, height: 40, objectFit: "cover" }} />,
//         },
//         {
//             title: "Amallar",
//             key: "action",
//             render: (_, course) => (
//                 <div className="flex gap-2">
//                     <Button onClick={() => handleEdit(course)}>Tahrirlash</Button>
//                     <Popconfirm
//                         title="Ishonchingiz komilmi?"
//                         okText="Ha"
//                         cancelText="Yo‘q"
//                         onConfirm={() => handleDelete(course.key)}
//                     >
//                         <Button danger>O‘chirish</Button>
//                     </Popconfirm>
//                 </div>
//             ),
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

//             <Table dataSource={courses} columns={columns} loading={loading} />

//             <Modal
//                 title={editingCourse ? "Kursni tahrirlash" : "Yangi kurs qo‘shish"}
//                 open={isModalOpen}
//                 onOk={handleAddOrEditCourse}
//                 onCancel={handleCancel}
//                 okText={editingCourse ? "Saqlash" : "Qo‘shish"}
//                 cancelText="Bekor qilish"
//                 confirmLoading={loading}
//             >
//                 <Form form={form} layout="vertical">
//                     <Form.Item
//                         label="Kurs nomi"
//                         name="title"
//                         rules={[{ required: true, message: "Kurs nomini kiriting" }]}
//                     >
//                         <Input />
//                     </Form.Item>
//                     <Form.Item
//                         label="Izoh"
//                         name="description"
//                         rules={[{ required: true, message: "Izohni kiriting" }]}
//                     >
//                         <Input />
//                     </Form.Item>
//                     <Form.Item
//                         label="Rasm URL"
//                         name="image"
//                         rules={[{ required: true, message: "Rasm URL ni kiriting" }]}
//                     >
//                         <Input />
//                     </Form.Item>
//                     <Form.Item
//                         label="Narx"
//                         name="price"
//                         rules={[{ required: true, message: "Narxni kiriting" }]}
//                     >
//                         <Input type="number" />
//                     </Form.Item>
//                 </Form>
//             </Modal>
//         </div>
//     );
// };

// export default Courses;