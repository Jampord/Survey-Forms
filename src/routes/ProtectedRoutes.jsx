import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import MainLayout from "./MainLayout";
import HomePage from "../pages/Home";

const ProtectedRoutes = () => {
  const token = useSelector((state) => state.auth.token);
  const fullName = useSelector((state) => state.auth.fullName);
  console.log(token);
  console.log(fullName);

  if (!token || fullName?.length === 0) {
    return <Navigate to="/login" />;
  } else if (token) {
    return <HomePage />;
  }
};

export default ProtectedRoutes;
