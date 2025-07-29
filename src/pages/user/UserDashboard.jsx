import { useEffect, useState } from "react";
import { auth, db } from "../../firebase/config";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { Card, Typography, Row, Col, Spin } from "antd";
import { BookOutlined, ClockCircleOutlined, UserOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const UserDashboard = () => {
    const [userData, setUserData] = useState(null);
    const [enrollCount, setEnrollCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchUserInfo = async () => {
        const currentUser = auth.currentUser;
        if (!currentUser) return;

        try {
            const userRef = doc(db, "users", currentUser.uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                setUserData(userSnap.data());
            }

            const q = query(
                collection(db, "enrollments"),
                where("userId", "==", currentUser.uid)
            );
            const snapshot = await getDocs(q);
            setEnrollCount(snapshot.size);
        } catch (err) {
            console.error("Xatolik:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserInfo();
    }, []);

    // if (loading) {
    //     return (
    //         <div className="flex items-center justify-center min-h-screen">
    //             <Spin size="large" />
    //         </div>
    //     );
    // }

    return (
        <div className="p-6 bg-gray-50 h-full">
            <Title level={3}>Xush kelibsiz, {userData?.name} 👋</Title>

            <Row gutter={16} className="mt-4">
                <Col xs={24} md={8}>
                    <Card bordered={false} className="shadow-md">
                        <UserOutlined style={{ fontSize: "24px", color: "#1890ff" }} />
                        <Title level={5}>Email</Title>
                        <Text>{userData?.email}</Text>
                    </Card>
                </Col>

                <Col xs={24} md={8}>
                    <Card bordered={false} className="shadow-md">
                        <BookOutlined style={{ fontSize: "24px", color: "#52c41a" }} />
                        <Title level={5}>Yozilgan kurslar</Title>
                        <Text>{enrollCount} ta</Text>
                    </Card>
                </Col>

                <Col xs={24} md={8}>
                    <Card bordered={false} className="shadow-md">
                        <ClockCircleOutlined style={{ fontSize: "24px", color: "#faad14" }} />
                        <Title level={5}>Ro'yxatdan o‘tgan sana</Title>
                        <Text>
                            {userData?.createdAt?.toDate().toLocaleDateString("uz-UZ")}
                        </Text>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default UserDashboard;


// import { useEffect, useState } from "react";
// import { auth, db } from "../../firebase/config";
// import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
// import { Typography, Card, Spin } from "antd";

// const { Title, Text } = Typography;

// const UserDashboard = () => {
//     const [userData, setUserData] = useState(null);
//     const [enrollments, setEnrollments] = useState([]);
//     const [loading, setLoading] = useState(true);
//     console.log(userData);

//     const fetchUserData = async () => {
//         const currentUser = auth.currentUser;
//         if (!currentUser) return;

//         try {
//             const userDocRef = doc(db, "users", currentUser.uid);
//             const userSnap = await getDoc(userDocRef);
//             console.log(userSnap);

//             if (userSnap.exists()) {
//                 setUserData(userSnap.data());
//             }

//             const enrollmentsQuery = query(
//                 collection(db, "enrollments"),
//                 where("userId", "==", currentUser.uid)
//             );

//             const enrollmentsSnap = await getDocs(enrollmentsQuery);
//             const enrolledCourses = enrollmentsSnap.docs.map(doc => doc.data());
//             setEnrollments(enrolledCourses);

//         } catch (error) {
//             console.error("Xatolik: ", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchUserData();
//     }, []);


//     return (
//         <div className="p-6 max-w-4xl mx-auto">
//             <Card className="mb-6 shadow-md">
//                 <Title level={3}>Xush kelibsiz, {userData?.name}!</Title>
//                 <Text>Email: {userData?.email}</Text><br />
//                 <Text>Role: {userData?.role}</Text>
//             </Card>

//             <Card title="Ro‘yxatdan o‘tgan kurslar" className="shadow-md">
//                 {enrollments.length === 0 ? (
//                     <Text>Siz hali hech qanday kursga yozilmagansiz.</Text>
//                 ) : (
//                     <ul className="list-disc pl-5">
//                         {enrollments.map((course, index) => (
//                             <li key={index}>{course.courseName}</li>
//                         ))}
//                     </ul>
//                 )}
//             </Card>
//         </div>
//     );
// };

// export default UserDashboard;
