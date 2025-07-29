import {
    Table,
    Typography,
    message,
    Modal,
    Input,
    Form,
    Popconfirm,
} from "antd";
import {
    DeleteOutlined,
    EditOutlined,
    VideoCameraOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import {
    collection,
    getDocs,
    deleteDoc,
    doc,
    updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";

const { Title } = Typography;

const LessonList = () => {
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [initialFormValues, setInitialFormValues] = useState(null);

    const fetchLessons = async () => {
        setLoading(true);
        const snapshot = await getDocs(collection(db, "lessons"));
        const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setLessons(list);
        setLoading(false);
    };

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, "lessons", id));
            message.success("Dars o‘chirildi");
            setLessons((prev) => prev.filter((item) => item.id !== id));
        } catch (error) {
            console.error(error);
            message.error("Xatolik yuz berdi");
        }
    };

    const handleEdit = (record) => {
        setSelectedLesson(record);
        setInitialFormValues(record);
        form.setFieldsValue(record);
        setIsModalOpen(true);
    };

    const handleUpdate = async () => {
        try {
            const updated = form.getFieldsValue();
            await updateDoc(doc(db, "lessons", selectedLesson.id), updated);
            message.success("Dars yangilandi");

            setLessons((prev) =>
                prev.map((l) =>
                    l.id === selectedLesson.id ? { ...l, ...updated } : l
                )
            );
            setIsModalOpen(false);
            setSelectedLesson(null);
        } catch (err) {
            console.error(err);
            message.error("Yangilashda xatolik");
        }
    };

    const handleModalCancel = () => {
        const current = form.getFieldsValue();
        const changed = JSON.stringify(current) !== JSON.stringify(initialFormValues);

        if (changed) {
            Modal.confirm({
                title: "O‘zgarishlar saqlansinmi?",
                content: "Siz modalni yopmoqchisiz. O‘zgarishlar saqlanmaydi.",
                okText: "Saqlash",
                cancelText: "Bekor qilish",
                onOk: handleUpdate,
                onCancel: () => {
                    setIsModalOpen(false);
                    setSelectedLesson(null);
                },
            });
        } else {
            setIsModalOpen(false);
            setSelectedLesson(null);
        }
    };

    useEffect(() => {
        fetchLessons();
    }, []);

    const columns = [
        {
            title: "Dars nomi",
            dataIndex: "title",
        },
        {
            title: "YouTube Link",
            dataIndex: "videoUrl",
            render: (url) => (
                <a href={url} target="_blank" rel="noopener noreferrer">
                    <VideoCameraOutlined /> Ko‘rish
                </a>
            ),
        },
        {
            title: "Tartib",
            dataIndex: "order",
        },
        {
            title: "Amallar",
            key: "action",
            render: (_, record) => (
                <div className="flex gap-4">
                    <EditOutlined
                        style={{ color: "blue", cursor: "pointer" }}
                        onClick={() => handleEdit(record)}
                    />
                    <Popconfirm
                        title="Ushbu darsni o‘chirmoqchimisiz?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Ha"
                        cancelText="Yo‘q"
                    >
                        <DeleteOutlined style={{ color: "red", cursor: "pointer" }} />
                    </Popconfirm>
                </div>
            ),
        },
    ];

    return (
        <div className="p-6 bg-white shadow rounded-md">
            <Title level={3}>Barcha darslar</Title>
            <Table
                rowKey="id"
                columns={columns}
                dataSource={lessons}
                loading={loading}
                pagination={{ pageSize: 5 }}
            />

            <Modal
                title="Darsni tahrirlash"
                open={isModalOpen}
                onCancel={handleModalCancel}
                onOk={handleUpdate}
                okText="Saqlash"
                cancelText="Yopish"
            >
                <Form layout="vertical" form={form}>
                    <Form.Item name="title" label="Sarlavha" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="videoUrl"
                        label="YouTube Link"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="order"
                        label="Tartib raqami"
                        rules={[{ required: true }]}
                    >
                        <Input type="number" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default LessonList;



// import { useEffect, useState } from "react";
// import { db } from "../firebase/config";
// import {
//     collection,
//     getDocs,
//     doc,
//     getDoc,
//     deleteDoc,
// } from "firebase/firestore";
// import {
//     Table,
//     Typography,
//     message,
//     Tag,
//     Card,
//     Popconfirm
// } from "antd";
// import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

// const { Title } = Typography;

// const LessonList = () => {
//     const [lessons, setLessons] = useState([]);
//     const [loading, setLoading] = useState(true);

//     const fetchLessons = async () => {
//         try {
//             const snapshot = await getDocs(collection(db, "lessons"));
//             const lessonData = await Promise.all(
//                 snapshot.docs.map(async (docSnap) => {
//                     const lesson = docSnap.data();
//                     const courseDoc = await getDoc(doc(db, "courses", lesson.courseId));
//                     const courseTitle = courseDoc.exists() ? courseDoc.data().title : "Nomaʼlum kurs";

//                     return {
//                         id: docSnap.id,
//                         title: lesson.title,
//                         videoUrl: lesson.videoUrl,
//                         order: lesson.order,
//                         createdAt: lesson.createdAt?.toDate().toLocaleString() || "",
//                         courseTitle,
//                     };
//                 })
//             );
//             setLessons(lessonData);
//         } catch (error) {
//             console.error(error);
//             message.error("Darslarni olishda xatolik yuz berdi.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleDelete = async (lessonId) => {
//         try {
//             await deleteDoc(doc(db, "lessons", lessonId));
//             message.success("Dars o‘chirildi");
//             setLessons(prev => prev.filter(item => item.id !== lessonId));
//         } catch (err) {
//             console.error(err);
//             message.error("O‘chirishda xatolik yuz berdi");
//         }
//     };


//     useEffect(() => {
//         fetchLessons();
//     }, []);

//     const columns = [
//         {
//             title: "Dars nomi",
//             dataIndex: "title",
//             key: "title",
//         },
//         {
//             title: "Kurs",
//             dataIndex: "courseTitle",
//             key: "courseTitle",
//             render: (text) => <Tag color="blue">{text}</Tag>,
//         },
//         {
//             title: "Tartibi",
//             dataIndex: "order",
//             key: "order",
//         },
//         {
//             title: "YouTube video",
//             dataIndex: "videoUrl",
//             key: "videoUrl",
//             render: (url) => (
//                 <a href={url} target="_blank" rel="noopener noreferrer">
//                     Ko‘rish
//                 </a>
//             ),
//         },
//         {
//             title: "Qo‘shilgan sana",
//             dataIndex: "createdAt",
//             key: "createdAt",
//         },
//         {
//             title: "Amallar",
//             key: "action",
//             render: (_, record) => (
//                 <div className="flex gap-3">
//                     <EditOutlined
//                         style={{ color: "blue", cursor: "pointer" }}
//                         onClick={() => handleEdit(record)}
//                     />
//                     <Popconfirm
//                         title="Ushbu darsni o‘chirmoqchimisiz?"
//                         onConfirm={() => handleDelete(record.id)}
//                         okText="Ha"
//                         cancelText="Yo‘q"
//                     >
//                         <DeleteOutlined style={{ color: "red", cursor: "pointer" }} />
//                     </Popconfirm>
//                 </div>
//             ),
//         }

//     ];

//     return (
//         <div className="p-6">
//             <Card className="shadow">
//                 <Title level={3}>📋 Barcha darslar</Title>
//                 <Table
//                     rowKey="id"
//                     columns={columns}
//                     dataSource={lessons}
//                     loading={loading}
//                     bordered
//                     pagination={{ pageSize: 5 }}
//                 />
//             </Card>
//         </div>
//     );
// };

// export default LessonList;
