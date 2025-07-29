// pages/CourseDetail.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/config";

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      const docRef = doc(db, "courses", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setCourse(docSnap.data());
      }
    };
    fetchCourse();
  }, [id]);

  if (!course) return <div>Yuklanmoqda...</div>;

  return (
    <div>
      <h2>{course.name}</h2>
      <img src={course.img} alt={course.name} />
      <p>{course.title}</p>
      <p>Narxi: ${course.price}</p>
      <button className="bg-blue-500 text-white px-4 py-2">Kursga yozilish</button>
    </div>
  );
};

export default CourseDetail;
