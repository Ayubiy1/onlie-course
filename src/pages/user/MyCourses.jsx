import { useEffect, useState } from "react";
import { db, auth } from "../../firebase/config";
import {
    collection,
    getDocs,
    doc,
    getDoc,
    query,
    where
} from "firebase/firestore";
import { Table, Typography, Spin, message } from "antd";
import { useAuthState } from "react-firebase-hooks/auth";
import { BookOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const MyCourses = () => {
    const navigate = useNavigate();
    const [user] = useAuthState(auth);
    const [loading, setLoading] = useState(true);
    const [courses, setCourses] = useState([]);
    const [enrollments, setEnrollments] = useState([]);

    useEffect(() => {
        const fetchMyCourses = async () => {
            if (!user) return;

            try {
                const q = query(
                    collection(db, "enrollments"),
                    where("userId", "==", user.uid)
                );
                const enrollmentSnapshot = await getDocs(q);
                const enrollmentList = enrollmentSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setEnrollments(enrollmentList);

                const courseDataPromises = enrollmentList.map(async (enroll) => {
                    const courseDoc = await getDoc(doc(db, "courses", enroll.courseId));
                    const courseData = courseDoc.data();
                    return {
                        id: enroll.courseId,
                        title: courseData.title,
                        price: courseData.price,
                        lessonIndex: enroll.lastLessonIndex ?? 0 // Faqat undefined bo‘lsa 0
                    };
                });


                // const courseDataPromises = enrollmentList.map(async (enroll) => {
                //     const courseDoc = await getDoc(doc(db, "courses", enroll.courseId));
                //     return {
                //         id: enroll.courseId,
                //         ...courseDoc.data(),
                //         lessonIndex: enroll.lastLessonIndex || 0
                //     };
                // });

                const results = await Promise.all(courseDataPromises);
                setCourses(results);
            } catch (error) {
                console.error(error);
                message.error("Kurslarni olishda xatolik yuz berdi");
            } finally {
                setLoading(false);
            }
        };

        fetchMyCourses();
    }, [user]);

    // useEffect(() => {
    //     const fetchMyCourses = async () => {
    //         if (!user) return;

    //         try {
    //             // 1. enrollmentlarni olamiz
    //             const q = query(
    //                 collection(db, "enrollments"),
    //                 where("userId", "==", user.uid)
    //             );
    //             const enrollmentSnapshot = await getDocs(q);
    //             const courseIds = enrollmentSnapshot.docs.map(doc => doc.data().courseId);

    //             // 2. har bir courseId uchun kurs ma'lumotini olamiz
    //             const courseDataPromises = courseIds.map(async (id) => {
    //                 const courseDoc = await getDoc(doc(db, "courses", id));
    //                 return { id, ...courseDoc.data() };
    //             });

    //             const results = await Promise.all(courseDataPromises);
    //             setCourses(results);
    //         } catch (error) {
    //             console.error(error);
    //             message.error("Kurslarni olishda xatolik yuz berdi");
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchMyCourses();
    // }, [user]);

    const columns = [
        {
            title: "Kurs nomi",
            dataIndex: "title",
        },
        {
            title: "Narxi",
            dataIndex: "price",
            render: (price) => `${price.toLocaleString()} so'm`,
        },
        {
            title: "Amal",
            render: (_, record) => (
                <button
                    onClick={() => {
                        console.log(record);

                        navigate(`/my-courses/${record.id}/${record.lessonIndex}`)
                    }
                    }
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded"
                >
                    Darsni boshlash
                </button >
            ),
        },
    ];


    // const columns = [
    //     {
    //         title: "Kurs nomi",
    //         dataIndex: "title",
    //     },
    //     {
    //         title: "Narxi",
    //         dataIndex: "price",
    //         render: (price) => `${price.toLocaleString()} so'm`,
    //     },
    // ];

    return (
        <div className="p-6 bg-white shadow rounded-md">
            <Title level={3} className="mb-4 flex items-center gap-2">
                <BookOutlined /> Mening kurslarim
            </Title>
            {loading ? (
                <Spin size="large" />
            ) : (
                <Table
                    rowKey="id"
                    columns={columns}
                    dataSource={courses}
                    pagination={{ pageSize: 5 }}
                    bordered
                />
            )}
        </div>
    );
};

export default MyCourses;
