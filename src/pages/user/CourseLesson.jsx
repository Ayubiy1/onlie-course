import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";
import { Button, Typography, Spin } from "antd";

const { Title, Paragraph } = Typography;

const CourseLesson = () => {
    const { courseId, lessonIndex } = useParams();
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const index = parseInt(lessonIndex);

    useEffect(() => {
        const fetchLessons = async () => {
            try {
                const q = query(collection(db, "lessons"), where("courseId", "==", courseId));
                const snapshot = await getDocs(q);
                const fetched = snapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() }))
                    .sort((a, b) => a.order - b.order);
                setLessons(fetched);
            } catch (error) {
                console.error("Darslarni yuklashda xatolik:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLessons();
    }, [courseId]);

    if (loading) return <Spin size="large" className="mt-10" />;

    const lesson = lessons[index];
    if (!lesson) return <div>Dars topilmadi</div>;

    const goToLesson = (newIndex) => {
        navigate(`/my-courses/${courseId}/${newIndex}`);
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <Title level={3}>{lesson.title}</Title>

            <div className="aspect-video mb-4">
                <iframe
                    className="w-full h-full"
                    src={lesson.videoUrl}
                    title={lesson.title}
                    allowFullScreen
                />
            </div>

            <Paragraph>{lesson.description || "Bu dars haqida batafsil ma'lumot mavjud emas."}</Paragraph>

            <div className="flex justify-between mt-4">
                <Button
                    disabled={index === 0}
                    onClick={() => goToLesson(index - 1)}
                >
                    ⬅ Oldingi dars
                </Button>
                <Button
                    disabled={index >= lessons.length - 1}
                    onClick={() => goToLesson(index + 1)}
                >
                    Keyingi dars ➡
                </Button>
            </div>
        </div>
    );
};

export default CourseLesson;



// import { useParams, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { db } from "../../firebase/config";
// import { doc, getDoc, collection, getDocs, query, orderBy } from "firebase/firestore";
// import { Button, Typography } from "antd";

// const { Title, Paragraph } = Typography;

// const CourseLesson = () => {
//     const { courseId, lessonIndex } = useParams();
//     const [course, setCourse] = useState(null);
//     const [lessons, setLessons] = useState([]);
//     const navigate = useNavigate();

//     const index = parseInt(lessonIndex, 10);

//     console.log(course);


//     useEffect(() => {
//         const fetchData = async () => {
//             const courseDoc = await getDoc(doc(db, "courses", courseId));
//             if (courseDoc.exists()) {
//                 setCourse(courseDoc.data());
//             }

//             const q = query(
//                 collection(db, "courses", courseId, "lessons"),
//                 orderBy("order", "asc")
//             );
//             const snapshot = await getDocs(q);
//             const lessonList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//             setLessons(lessonList);
//         };

//         fetchData();
//     }, [courseId]);

//     const lesson = lessons[index];
//     console.log(lesson);


//     if (!course) return <div>Yuklanmoqda...</div>;

//     const handlePrev = () => {
//         if (index > 0) navigate(`/my-courses/${courseId}/${index - 1}`);
//     };

//     const handleNext = () => {
//         if (index < lessons.length - 1) navigate(`/my-courses/${courseId}/${index + 1}`);
//     };

//     return (
//         <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-md">
//             <Title level={2}>{course.name}</Title>
//             <Title level={4}>{lesson.title}</Title>

//             <div className="w-full aspect-video mb-6">
//                 <iframe
//                     width="100%"
//                     height="100%"
//                     src={lesson.videoUrl}
//                     title={lesson.title}
//                     frameBorder="0"
//                     allowFullScreen
//                 />
//             </div>

//             <Paragraph>{course.title}</Paragraph>

//             <div className="flex justify-between mt-6">
//                 <Button onClick={handlePrev} disabled={index === 0}>
//                     Oldingi dars
//                 </Button>
//                 <Button onClick={handleNext} disabled={index === lessons.length - 1}>
//                     Keyingi dars
//                 </Button>
//             </div>
//         </div>
//     );
// };

// export default CourseLesson;
