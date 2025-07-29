import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import {
    collection,
    getDocs,
    addDoc
} from "firebase/firestore";
import {
    Form,
    Input,
    Button,
    Select,
    message,
    Typography,
    Card
} from "antd";

const { Title } = Typography;

const AddLesson = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);

    // Kurslarni Firestore'dan olish
    const fetchCourses = async () => {
        try {
            const snapshot = await getDocs(collection(db, "courses"));
            const courseList = snapshot.docs.map(doc => ({
                id: doc.id,
                title: doc.data().title,
            }));
            setCourses(courseList);
        } catch (err) {
            console.error(err);
            message.error("Kurslarni olishda xatolik yuz berdi");
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    // Darsni qo‘shish
    const handleFinish = async (values) => {
        const { courseId, title, videoUrl, order } = values;
        setLoading(true);

        try {
            await addDoc(collection(db, "lessons"), {
                courseId,
                title,
                videoUrl,
                order: Number(order),
                createdAt: new Date()
            });
            message.success("Dars muvaffaqiyatli qo‘shildi");
        } catch (err) {
            console.error(err);
            message.error("Dars qo‘shishda xatolik yuz berdi");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <Card className="max-w-2xl mx-auto shadow">
                <Title level={3}>📚 Dars qo‘shish</Title>
                <Form layout="vertical" onFinish={handleFinish}>
                    <Form.Item
                        name="courseId"
                        label="Kursni tanlang"
                        rules={[{ required: true, message: "Kursni tanlang!" }]}
                    >
                        <Select placeholder="Kursni tanlang">
                            {courses.map((course) => (
                                <Select.Option key={course.id} value={course.id}>
                                    {course.title}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="title"
                        label="Dars nomi"
                        rules={[{ required: true, message: "Dars nomini kiriting!" }]}
                    >
                        <Input placeholder="Misol: 1-dars - Kirish" />
                    </Form.Item>

                    <Form.Item
                        name="videoUrl"
                        label="YouTube video havolasi"
                        rules={[{ required: true, message: "Video linkini kiriting!" }]}
                    >
                        <Input placeholder="https://youtube.com/..." />
                    </Form.Item>

                    <Form.Item
                        name="order"
                        label="Dars tartibi (0 dan boshlanadi)"
                        rules={[{ required: true, message: "Tartib raqamini kiriting!" }]}
                    >
                        <Input type="number" min={0} />
                    </Form.Item>

                    <Button type="primary" htmlType="submit" loading={loading}>
                        Darsni qo‘shish
                    </Button>
                </Form>
            </Card>
        </div>
    );
};

export default AddLesson;
