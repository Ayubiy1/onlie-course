import { Card, Typography, Table } from "antd";
import { BookOutlined, UserOutlined, DollarOutlined } from "@ant-design/icons";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useEffect, useState } from "react";

const { Title } = Typography;

const DashboardHome = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    // 🔽 Firestore dan kurslarni olish
    const fetchCourses = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, "courses"), orderBy("title"), limit(5)); // so‘nggi 5 ta kurs
            const snapshot = await getDocs(q);
            const fetched = snapshot.docs.map(doc => ({
                key: doc.id,
                ...doc.data()
            }));
            setCourses(fetched);
        } catch (err) {
            console.error("Kurslarni olishda xatolik:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    // 🔹 Statistikalar (hozircha hardcoded)
    const stats = [
        {
            title: "Jami kurslar",
            value: courses.length,
            icon: <BookOutlined />,
            bg: "bg-blue-500"
        },
        {
            title: "Foydalanuvchilar",
            value: 25, // keyin Firebase Auth asosida almashtiramiz
            icon: <UserOutlined />,
            bg: "bg-green-500"
        },
        {
            title: "Sotuvlar",
            value: 0,
            icon: <DollarOutlined />,
            bg: "bg-yellow-500"
        }
    ];

    // 🔸 So‘nggi kurslar jadvali
    const columns = [
        {
            title: "Kurs nomi",
            dataIndex: "title",
            key: "title"
        },
        {
            title: "Narxi",
            dataIndex: "price",
            key: "price",
            render: (price) => `${price?.toLocaleString()} so'm`
        },
        {
            title: "Rasm",
            dataIndex: "image",
            key: "image",
            render: (url) => <img src={url} alt="Kurs" style={{ width: 60, height: 40, objectFit: "cover" }} />
        }
    ];

    return (
        <div>
            <Title level={3} className="mb-4">🏠 Bosh sahifa</Title>

            {/* Stat cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {stats.map((stat, index) => (
                    <Card key={index} className="text-white" style={{ backgroundColor: "transparent" }}>
                        <div className={`p-4 rounded shadow ${stat.bg} flex items-center justify-between`}>
                            <div>
                                <p className="text-lg font-semibold">{stat.title}</p>
                                <p className="text-2xl">{stat.value}</p>
                            </div>
                            <div className="text-4xl opacity-60">{stat.icon}</div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Jadval */}
            <Card title="🆕 So‘nggi qo‘shilgan kurslar">
                <Table
                    dataSource={courses}
                    columns={columns}
                    pagination={false}
                    loading={loading}
                />
            </Card>
        </div>
    );
};

export default DashboardHome;
