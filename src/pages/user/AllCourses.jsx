import { useEffect, useState } from "react";
import { db, auth } from "../../firebase/config";
import { collection, getDocs, addDoc, query, where, Timestamp } from "firebase/firestore";
import { Table, Button, message, Typography } from "antd";
import { useAuthState } from "react-firebase-hooks/auth";
import { BookOutlined, CommentOutlined, DollarOutlined, AimOutlined } from "@ant-design/icons";

const { Title } = Typography;

const AllCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [user] = useAuthState(auth);

    const [messageApi, contextHolder] = message.useMessage();

    const success = (text) => {
        messageApi.open({
            type: 'success',
            content: `${text}`,
        });
    };
    const error = (text) => {
        messageApi.open({
            type: 'error',
            content: `${text}`,
        });
    };

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const snapshot = await getDocs(collection(db, "courses"));
            const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setCourses(list);
        } catch (err) {
            message.error("Kurslarni yuklashda xatolik yuz berdi");
        } finally {
            setLoading(false);
        }
    };

    const handleEnroll = async (courseId) => {
        if (!user) {
            return message.warning("Yozilish uchun avval tizimga kiring.");
        }

        try {
            // 🔍 Foydalanuvchi allaqachon shu kursga yozilganmi — tekshiramiz
            const q = query(
                collection(db, "enrollments"),
                where("userId", "==", user.uid),
                where("courseId", "==", courseId)
            );
            const snapshot = await getDocs(q);

            if (!snapshot.empty) {
                error('Siz allaqachon bu kursga yozilgansiz.');
                return message.info("Siz allaqachon bu kursga yozilgansiz.");
            }

            await addDoc(collection(db, "userCourses"), {
                userId: user.uid,
                courseId,
                enrolledAt: Timestamp.now(),
                completedLessons: [0]
            });

            // ✍️ Agar yozilmagan bo‘lsa — yozamiz
            await addDoc(collection(db, "enrollments"), {
                userId: user.uid,
                courseId,
                enrolledAt: new Date(),
            });

            success("Kursga muvaffaqiyatli yozildingiz!");

            message.success("Kursga muvaffaqiyatli yozildingiz!");
        } catch (err) {
            console.error(err);
            message.error("Yozilishda xatolik yuz berdi.");
        }
    };


    // const handleEnroll = async (courseId) => {
    //     if (!user) {
    //         return message.warning("Yozilish uchun avval tizimga kiring.");
    //     }

    //     try {
    //         const q = query(
    //             collection(db, "enrollments"),
    //             where("userId", "==", user.uid),
    //             where("courseId", "==", courseId)
    //         );
    //         const snapshot = await getDocs(q);
    //         if (!snapshot.empty) {
    //             return message.info("Siz allaqachon bu kursga yozilgansiz.");
    //         }

    //         await addDoc(collection(db, "enrollments"), {
    //             userId: user.uid,
    //             courseId,
    //             enrolledAt: new Date(),
    //         });

    //         message.success("Kursga yozildingiz!");
    //     } catch (err) {
    //         console.error(err);
    //         message.error("Yozilishda xatolik yuz berdi.");
    //     }
    // };

    useEffect(() => {
        fetchCourses();
    }, []);

    const columns = [
        {
            title: (
                <span className="flex items-center gap-2">
                    <BookOutlined /> Kurs nomi
                </span>
            ),
            dataIndex: "title",
            key: "title",
        },
        {
            title: (
                <span className="flex items-center gap-2">
                    <CommentOutlined /> Izoh
                </span>
            ),
            dataIndex: "description",
            key: "description",
        },
        {
            title: (
                <span className="flex items-center gap-2">
                    <DollarOutlined /> Narxi
                </span>
            ),
            dataIndex: "price",
            key: "price",
            render: (price) => `${price.toLocaleString()} so'm`,
        },
        {
            title: (
                <span className="flex items-center gap-2">
                    <AimOutlined /> Amal
                </span>
            ),
            key: "action",
            render: (_, record) => {
                console.log(_);

                return <Button type="primary" onClick={() => handleEnroll(record.id)}>
                    Yozilish
                </Button>

            }
        },
    ];

    return (
        <div className="p-6 bg-white shadow rounded-md">
            {contextHolder}
            <Title level={3} className="mb-4 flex items-center gap-2">
                <BookOutlined /> Barcha kurslar
            </Title>
            <Table
                rowKey="id"
                columns={columns}
                dataSource={courses}
                loading={loading}
                pagination={{ pageSize: 5 }}
                bordered
            />
        </div>
    );
};

export default AllCourses;


// import { useEffect, useState } from "react";
// import { collection, getDocs, addDoc, query, where } from "firebase/firestore";
// import { Table, Button, message } from "antd";
// import { useAuthState } from "react-firebase-hooks/auth";

// import { db } from "../firebase/config";
// import { auth } from "../firebase/config";

// const AllCourses = () => {
//     const [courses, setCourses] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [user] = useAuthState(auth);

//     const fetchCourses = async () => {
//         const snapshot = await getDocs(collection(db, "courses"));
//         const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//         setCourses(list);
//     };

//     const handleEnroll = async (courseId) => {
//         if (!user) {
//             return message.warning("Yozilish uchun avval tizimga kiring.");
//         }

//         try {
//             // Oldin yozilganmi tekshiramiz
//             const q = query(
//                 collection(db, "enrollments"),
//                 where("userId", "==", user.uid),
//                 where("courseId", "==", courseId)
//             );
//             const snapshot = await getDocs(q);
//             if (!snapshot.empty) {
//                 return message.info("Siz allaqachon bu kursga yozilgansiz.");
//             }

//             await addDoc(collection(db, "enrollments"), {
//                 userId: user.uid,
//                 courseId,
//                 enrolledAt: new Date(),
//             });

//             message.success("Kursga muvaffaqiyatli yozildingiz!");
//         } catch (err) {
//             console.error(err);
//             message.error("Yozilishda xatolik yuz berdi.");
//         }
//     };

//     useEffect(() => {
//         fetchCourses();
//     }, []);

//     const columns = [
//         {
//             title: "Kurs nomi",
//             dataIndex: "title",
//         },
//         {
//             title: "Narxi",
//             dataIndex: "price",
//             render: (price) => `${price.toLocaleString()} so'm`
//         },
//         {
//             title: "Amal",
//             render: (_, record) => (
//                 <Button type="primary" onClick={() => handleEnroll(record.id)}>
//                     Yozilish
//                 </Button>
//             ),
//         },
//     ];

//     return <Table rowKey="id" dataSource={courses} columns={columns} loading={loading} />;
// };

// export default AllCourses;
