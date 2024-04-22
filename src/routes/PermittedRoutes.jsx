import React from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { navigationData } from "./NavigationData";
import AccessDenied from "../pages/AccessDenied";
import MainLayout from "./MainLayout";

const PermittedRoutes = () => {
  const { pathname } = useLocation();
  const permissions = useSelector((state) => state.permissions.permissions);
  // console.log(permissions);

  const allowedNavigationData = navigationData.filter((item) => {
    return permissions?.includes(item.name);
  });
  // console.log(allowedNavigationData, "allowedData");

  const permittedPath = allowedNavigationData?.map((item) => {
    return permissions?.includes(item.name) ? item.path : null;
  });
  // console.log(permittedPath, "permittedPath");

  if (permittedPath?.includes(pathname) || pathname === "/") {
    return <MainLayout />;
  }

  return <AccessDenied />;
};

export default PermittedRoutes;
