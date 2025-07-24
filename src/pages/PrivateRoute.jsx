import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import "./PrivateRoute.css"

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="flex items-center justify-center h-[100vh]">
            <svg className="spinner" width="65px" height="65px" viewBox="0 0 66 66">
                <circle className="path" fill="none" strokeWidth="6" strokeLinecap="round" cx="33" cy="33" r="30"></circle>
            </svg>
        </div>; // Auth holati hali aniqlanmagan
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default PrivateRoute;
