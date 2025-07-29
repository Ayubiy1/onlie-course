import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import {
    collection,
    getDocs,
    doc,
    deleteDoc,
    updateDoc,
    addDoc,
    serverTimestamp,
} from "firebase/firestore";
import {
    Table,
    Button,
    Popconfirm,
    message,
    Modal,
    Form,
    Input,
    Typography,
} from "antd";
import {
    EditOutlined,
    DeleteOutlined,
    UserOutlined,
    PlusOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

const TeacherList = () => {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingTeacher, setEditingTeacher] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [addForm] = Form.useForm();

    const fetchTeachers = async () => {
        setLoading(true);
        try {
            const snapshot = await getDocs(collection(db, "teachers"));
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setTeachers(data);
        } catch (err) {
            console.error(err);
            message.error("O'qituvchilarni olishda xatolik");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, "teachers", id));
            message.success("O'qituvchi o'chirildi");
            fetchTeachers();
        } catch (err) {
            console.error(err);
            message.error("O'chirishda xatolik");
        }
    };

    const openEditModal = (teacher) => {
        setEditingTeacher(teacher);
        form.setFieldsValue(teacher);
    };

    const handleEdit = async () => {
        try {
            const values = await form.validateFields();
            await updateDoc(doc(db, "teachers", editingTeacher.id), values);
            message.success("Ma'lumot yangilandi");
            setEditingTeacher(null);
            fetchTeachers();
        } catch (err) {
            console.error(err);
            message.error("Yangilashda xatolik");
        }
    };

    const handleAdd = async () => {
        try {
            const values = await addForm.validateFields();
            await addDoc(collection(db, "teachers"), {
                ...values,
                createdAt: serverTimestamp(),
            });
            message.success("Yangi teacher qo'shildi");
            setIsAddModalOpen(false);
            addForm.resetFields();
            fetchTeachers();
        } catch (err) {
            console.error(err);
            message.error("Teacher qo'shishda xatolik");
        }
    };

    const columns = [
        {
            title: "Ism",
            dataIndex: "name",
        },
        {
            title: "Familiya",
            dataIndex: "surname",
        },
        {
            title: "Email",
            dataIndex: "email",
        },
        {
            title: "Tavsif",
            dataIndex: "description",
        },
        {
            title: "Amallar",
            render: (_, record) => (
                <div className="flex gap-2">
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => openEditModal(record)}
                    >
                        Tahrirlash
                    </Button>
                    <Popconfirm
                        title="O'chirishni tasdiqlaysizmi?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Ha"
                        cancelText="Yo‘q"
                    >
                        <Button danger icon={<DeleteOutlined />}>
                            O'chirish
                        </Button>
                    </Popconfirm>
                </div>
            ),
        },
    ];

    return (
        <div className="p-6 bg-white rounded shadow">
            <div className="flex justify-between items-center mb-4">
                <Title level={3}>
                    <UserOutlined /> Teacherlar ro'yxati
                </Title>
                <Button
                    icon={<PlusOutlined />}
                    type="primary"
                    onClick={() => setIsAddModalOpen(true)}
                >
                    Yangi teacher
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={teachers}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 5 }}
            />

            {/* ✏️ Edit modal */}
            <Modal
                title="Teacher ma'lumotlarini tahrirlash"
                open={!!editingTeacher}
                onCancel={() => setEditingTeacher(null)}
                onOk={handleEdit}
                okText="Saqlash"
                cancelText="Bekor qilish"
            >
                <Form layout="vertical" form={form}>
                    <Form.Item
                        label="Ism"
                        name="name"
                        rules={[{ required: true, message: "Ismni kiriting" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Familiya"
                        name="surname"
                        rules={[{ required: true, message: "Familiyani kiriting" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, type: "email", message: "Email kiriting" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Tavsif"
                        name="description"
                        rules={[{ required: true, message: "Tavsif kiriting" }]}
                    >
                        <Input.TextArea rows={3} />
                    </Form.Item>
                </Form>
            </Modal>

            {/* ➕ Add modal */}
            <Modal
                title="Yangi teacher qo‘shish"
                open={isAddModalOpen}
                onCancel={() => setIsAddModalOpen(false)}
                onOk={handleAdd}
                okText="Qo‘shish"
                cancelText="Bekor qilish"
            >
                <Form layout="vertical" form={addForm}>
                    <Form.Item
                        label="Ism"
                        name="name"
                        rules={[{ required: true, message: "Ismni kiriting" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Familiya"
                        name="surname"
                        rules={[{ required: true, message: "Familiyani kiriting" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, type: "email", message: "Email kiriting" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Tavsif"
                        name="description"
                        rules={[{ required: true, message: "Tavsif kiriting" }]}
                    >
                        <Input.TextArea rows={3} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default TeacherList;


// // pages/TeacherList.jsx
// import { useEffect, useState } from "react";
// import { Table, Button, Modal, Input, message, Typography, Popconfirm } from "antd";
// import { db } from "../firebase/config";
// import { collection, getDocs, query, where, updateDoc, deleteDoc, doc } from "firebase/firestore";

// const { Title } = Typography;

// const TeacherList = () => {
//     const [teachers, setTeachers] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [editingTeacher, setEditingTeacher] = useState(null);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [form, setForm] = useState({ name: "", email: "" });

//     const fetchTeachers = async () => {
//         setLoading(true);
//         const q = query(collection(db, "users"), where("role", "==", "teacher"));
//         const snapshot = await getDocs(q);
//         const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//         setTeachers(list);
//         setLoading(false);
//     };

//     useEffect(() => {
//         fetchTeachers();
//     }, []);

//     const handleEdit = (record) => {
//         setEditingTeacher(record);
//         setForm({ name: record.name, email: record.email });
//         setIsModalOpen(true);
//     };

//     const handleUpdate = async () => {
//         try {
//             await updateDoc(doc(db, "users", editingTeacher.id), {
//                 name: form.name,
//                 email: form.email
//             });
//             message.success("O'qituvchi ma'lumotlari yangilandi");
//             setIsModalOpen(false);
//             fetchTeachers();
//         } catch (err) {
//             message.error("Xatolik yuz berdi");
//         }
//     };

//     const handleDelete = async (id) => {
//         try {
//             await deleteDoc(doc(db, "users", id));
//             message.success("O'qituvchi o'chirildi");
//             fetchTeachers();
//         } catch (err) {
//             message.error("O'chirishda xatolik yuz berdi");
//         }
//     };

//     const columns = [
//         {
//             title: "Ism",
//             dataIndex: "name",
//         },
//         {
//             title: "Email",
//             dataIndex: "email",
//         },
//         {
//             title: "Role",
//             dataIndex: "role",
//         },
//         {
//             title: "Amallar",
//             render: (_, record) => (
//                 <>
//                     <Button type="link" onClick={() => handleEdit(record)}>Tahrirlash</Button>
//                     <Popconfirm
//                         title="Ishonchingiz komilmi?"
//                         onConfirm={() => handleDelete(record.id)}
//                         okText="Ha"
//                         cancelText="Yo'q"
//                     >
//                         <Button type="link" danger>O‘chirish</Button>
//                     </Popconfirm>
//                 </>
//             )
//         }
//     ];

//     return (
//         <div className="p-6 bg-white shadow rounded-md">
//             <Title level={3}>O‘qituvchilar ro‘yxati</Title>
//             <Table
//                 rowKey="id"
//                 columns={columns}
//                 dataSource={teachers}
//                 loading={loading}
//                 bordered
//             />

//             <Modal
//                 title="O‘qituvchini tahrirlash"
//                 open={isModalOpen}
//                 onOk={handleUpdate}
//                 onCancel={() => {
//                     setIsModalOpen(false);
//                     Modal.confirm({
//                         title: "O'zgarishlarni saqlamasdan chiqmoqchimisiz?",
//                         onOk: () => setIsModalOpen(false),
//                     });
//                 }}
//             >
//                 <Input
//                     className="mb-2"
//                     placeholder="Ism"
//                     value={form.name}
//                     onChange={(e) => setForm({ ...form, name: e.target.value })}
//                 />
//                 <Input
//                     placeholder="Email"
//                     value={form.email}
//                     onChange={(e) => setForm({ ...form, email: e.target.value })}
//                 />
//             </Modal>
//         </div>
//     );
// };

// export default TeacherList;
