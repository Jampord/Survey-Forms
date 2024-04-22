import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import HomePage from "../pages/Home";
import PermittedRoutes from "./PermittedRoutes";

const ProtectedRoutes = () => {
  const token = useSelector((state) => state.auth.token);
  const fullName = useSelector((state) => state.auth.fullName);
  const permissions = useSelector((state) => state.permissions.permissions);
  // console.log(token, "hello");
  // console.log(fullName);
  // console.log(permissions);

  if (!token || !fullName || permissions?.length === 0) {
    return <Navigate to="/login" />;
  }

  // return <HomePage />;
  return <PermittedRoutes />;
};

export default ProtectedRoutes;
