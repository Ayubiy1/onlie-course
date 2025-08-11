import { useEffect, useState } from "react";
import { Typography, Card, Avatar, List, Progress, Spin, Button } from "antd";
import { auth, db } from "../firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";

const { Title } = Typography;

const Profile = () => {
    const [user, loading] = useAuthState(auth);
    const [userData, setUserData] = useState(null);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!user) return;

            try {
                // 1️⃣ Foydalanuvchi ma’lumotlari
                const userRef = doc(db, "users", user.uid);
                const userSnap = await getDoc(userRef);
                setUserData(userSnap.data());

                // 2️⃣ Foydalanuvchi yozilgan kurslar
                const q = query(collection(db, "userCourses"), where("userId", "==", user.uid));
                const qSnap = await getDocs(q);

                const coursesMap = new Map();

                for (const docSnap of qSnap.docs) {
                    const data = docSnap.data();

                    // Dublikat courseId bo‘lsa o'tkazib yuboramiz
                    if (coursesMap.has(data.courseId)) continue;

                    // Kurs ma’lumotlari
                    const courseRef = doc(db, "courses", data.courseId);
                    const courseSnap = await getDoc(courseRef);
                    const courseData = courseSnap.data();
                    if (!courseData) continue;

                    // 📌 Lessons sonini olish
                    const lessonsQuery = query(
                        collection(db, "lessons"),
                        where("courseId", "==", data.courseId)
                    );
                    const lessonsSnap = await getDocs(lessonsQuery);
                    const totalLessons = lessonsSnap.size; // darslar soni

                    coursesMap.set(data.courseId, {
                        key: docSnap.id,
                        courseId: data.courseId,
                        title: courseData?.title,
                        img: courseData?.image,
                        totalLessons: totalLessons,
                        completedLessons: data.completedLessons?.length || 0,
                        enrolledAt: data.enrolledAt?.toDate().toLocaleDateString() || "Noma’lum",
                    });
                }

                setEnrolledCourses(Array.from(coursesMap.values()));
            } catch (err) {
                console.error("Profile error:", err);
            } finally {
                setLoadingData(false);
            }
        };

        fetchUserProfile();
    }, [user]);

    if (loading || loadingData) {
        return <Spin size="large" className="flex justify-center mt-20" />;
    }

    return (
        <div className="p-4">
            <Card>
                {/* Profil ma’lumotlari */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4 mb-6">
                        <Avatar src={userData?.photoURL} size={64}>
                            {userData?.fullName?.charAt(0) || "U"}
                        </Avatar>
                        <div>
                            <Title level={4}>{userData?.fullName || "Ism yo‘q"}</Title>
                            <p>{user?.email}</p>
                        </div>
                    </div>

                    <Button
                        type="primary"
                        onClick={() => window.location.href = "/edit-profile"}
                        className="mb-4"
                    >
                        ✏️ Profilni tahrirlash
                    </Button>
                </div>

                {/* Kurslar ro‘yxati */}
                <Title level={5}>📚 Yozilgan kurslar</Title>
                <List
                    itemLayout="horizontal"
                    dataSource={enrolledCourses}
                    renderItem={(course) => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={<img src={course.img} alt="img" width={60} />}
                                title={course.title}
                                description={`Yozilgan sana: ${course.enrolledAt}`}
                            />
                            <div style={{ width: 180 }}>
                                <Progress
                                    percent={
                                        course.totalLessons > 0
                                            ? Math.round((course.completedLessons / course.totalLessons) * 100)
                                            : 0
                                    }
                                    status={
                                        course.completedLessons === course.totalLessons
                                            ? "success"
                                            : "active"
                                    }
                                />
                            </div>
                        </List.Item>
                    )}
                />
            </Card>
        </div>
    );
};

export default Profile;

{

    // import { useEffect, useState } from "react";
    // import { Typography, Card, Descriptions, Button, Modal, Form, Input, message } from "antd";
    // import { auth } from "../firebase/config";
    // import { updateProfile } from "firebase/auth";

    // const { Title } = Typography;

    // const Profile = () => {
    //     const [user, setUser] = useState(null);
    //     const [isModalOpen, setIsModalOpen] = useState(false);
    //     const [form] = Form.useForm();
    //     const [loading, setLoading] = useState(false);

    //     useEffect(() => {
    //         const currentUser = auth.currentUser;
    //         setUser(currentUser);
    //     }, []);

    //     const handleOpenModal = () => {
    //         form.setFieldsValue({
    //             displayName: user?.displayName || ""
    //         });
    //         setIsModalOpen(true);
    //     };

    //     const handleCancel = () => {
    //         form.resetFields();
    //         setIsModalOpen(false);
    //     };

    //     const handleSave = async () => {
    //         try {
    //             const values = await form.validateFields();
    //             setLoading(true);
    //             await updateProfile(auth.currentUser, {
    //                 displayName: values.displayName
    //             });
    //             setUser({ ...auth.currentUser }); // yangilangan user holatini qayta o‘qiymiz
    //             message.success("Profil yangilandi");
    //             handleCancel();
    //         } catch (error) {
    //             message.error("Profilni yangilashda xatolik yuz berdi");
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     return (
    //         <div>
    //             <Title level={3}>👤 Profil</Title>

    //             <Card
    //                 extra={<Button type="primary" onClick={handleOpenModal}>Tahrirlash</Button>}
    //             >
    //                 {user ? (
    //                     <Descriptions bordered column={1}>
    //                         <Descriptions.Item label="Ism">{user.displayName || "Noma'lum"}</Descriptions.Item>
    //                         <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
    //                         <Descriptions.Item label="Ro'yxatdan o'tgan vaqt">{new Date(user.metadata.creationTime).toLocaleString()}</Descriptions.Item>
    //                         <Descriptions.Item label="Oxirgi kirgan vaqt">{new Date(user.metadata.lastSignInTime).toLocaleString()}</Descriptions.Item>
    //                     </Descriptions>
    //                 ) : (
    //                     <p>Foydalanuvchi ma'lumotlari topilmadi.</p>
    //                 )}
    //             </Card>

    //             <Modal
    //                 title="Profilni tahrirlash"
    //                 open={isModalOpen}
    //                 onOk={handleSave}
    //                 onCancel={handleCancel}
    //                 confirmLoading={loading}
    //                 okText="Saqlash"
    //                 cancelText="Bekor qilish"
    //             >
    //                 <Form layout="vertical" form={form}>
    //                     <Form.Item
    //                         label="Ism"
    //                         name="displayName"
    //                         rules={[{ required: true, message: "Ismni kiriting" }]}
    //                     >
    //                         <Input />
    //                     </Form.Item>
    //                 </Form>
    //             </Modal>
    //         </div>
    //     );
    // };

    // export default Profile;

}