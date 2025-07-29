import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { Spin } from "antd";

const PrivateRoute = ({ children }) => {
    const [user, loading] = useAuthState(auth);
    const [role, setRole] = useState(null);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const fetchRole = async () => {
            if (user) {
                const userRef = doc(db, "users", user.uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    setRole(userSnap.data().role);
                }
            }
            setChecking(false);
        };

        if (user) {
            fetchRole();
        } else {
            setChecking(false);
        }
    }, [user]);

    if (loading || checking || (user && role === null)) {
        return (
            <div style={{ display: "flex", justifyContent: "center", marginTop: 100 }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!user) return <Navigate to="/login" replace />;

    // 🔀 Rolega qarab layout tanlaymiz
    if (role === "admin" || role === "teacher") {
        return children; // DashboardLayout ni qabul qiladi
    }

    // 👤 Oddiy user bo‘lsa, foydalanuvchi layoutga yo‘naltiramiz
    return <Navigate to="/courses" replace />;
};

export default PrivateRoute;


// import { Navigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// import "./PrivateRoute.css"

// const PrivateRoute = ({ children }) => {
//     const { user, loading } = useAuth();

//     if (loading) {
//         return <div className="flex items-center justify-center h-[100vh]">
//             <svg className="spinner" width="65px" height="65px" viewBox="0 0 66 66">
//                 <circle className="path" fill="none" strokeWidth="6" strokeLinecap="round" cx="33" cy="33" r="30"></circle>
//             </svg>
//         </div>; // Auth holati hali aniqlanmagan
//     }

//     if (!user) {
//         return <Navigate to="/login" replace />;
//     }

//     return children;
// };

// export default PrivateRoute;
