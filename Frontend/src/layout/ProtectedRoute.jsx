import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../context/auth.context.jsx";

export default function ProtectedRoute() {
  const { user } = useAuthContext();

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}