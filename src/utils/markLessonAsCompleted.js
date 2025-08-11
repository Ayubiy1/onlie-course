import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase/config";

export const markLessonAsCompleted = async (userId, courseId, lessonId) => {
  try {
    const docId = `${userId}_${courseId}`;
    const userCourseRef = doc(db, "userCourses", docId);

    const snap = await getDoc(userCourseRef);

    if (!snap.exists()) {
      // Agar hujjat yo‘q bo‘lsa, yangi hujjat yaratamiz
      await setDoc(userCourseRef, {
        userId,
        courseId,
        completedLessons: [lessonId],
        createdAt: new Date(),
      });
      return true;
    }

    // Agar hujjat mavjud bo‘lsa, lessonId ni qo‘shamiz
    await updateDoc(userCourseRef, {
      completedLessons: arrayUnion(lessonId),
    });

    return true;
  } catch (error) {
    console.error("Darsni tugallashda xatolik:", error);
    return false;
  }
};

// import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
// import { db } from "../firebase/config";

// export const markLessonAsCompleted = async (userId, courseId, lessonId) => {
//     const docId = `${userId}_${courseId}`;
//     const userCourseRef = doc(db, "userCourses", docId);

//     try {
//         const docSnap = await getDoc(userCourseRef);

//         if (!docSnap.exists()) {
//             // ❗ Hujjat mavjud bo'lmasa, yangi hujjat yaratamiz
//             await setDoc(userCourseRef, {
//                 userId,
//                 courseId,
//                 completedLessons: [lessonId],
//                 enrolledAt: new Date(), // optional
//             });
//         } else {
//             // ✅ Hujjat mavjud bo‘lsa, mavjud massivga qo‘shamiz
//             await updateDoc(userCourseRef, {
//                 completedLessons: arrayUnion(lessonId),
//             });
//         }

//         return true;
//     } catch (error) {
//         console.error("Darsni tugallashda xatolik:", error);
//         return false;
//     }
// };

// import { doc, updateDoc, arrayUnion } from "firebase/firestore";
// import { db } from "../firebase/config";

// export const markLessonAsCompleted = async (userId, courseId, lessonId) => {
//     const docId = `${userId}_${courseId}`;
//     const userCourseRef = doc(db, "userCourses", docId);

//     try {
//         await updateDoc(userCourseRef, {
//             completedLessons: arrayUnion(lessonId),
//         });
//         return true;
//     } catch (error) {
//         console.error("Darsni tugallashda xatolik:", error);
//         return false;
//     }
// };
