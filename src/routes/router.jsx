import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/Home";
import Login from "../pages/Login";
import UserAccount from "../pages/UserAccount";
import UserRole from "../pages/UserRole";
import Department from "../pages/Department";
import Branch from "../pages/Branch";
import Group from "../pages/Group";
import Category from "../pages/Category";
import PageNotFound from "../pages/PageNotFound";
import ProtectedRoutes from "./ProtectedRoutes";
// import AccessDenied from "../pages/AccessDenied";

export const router = createBrowserRouter([
  { path: "login", element: <Login /> },
  { path: "*", element: <PageNotFound /> },
  {
    path: "/",
    element: <ProtectedRoutes />,
    children: [
      { path: "", element: <HomePage /> },
      { path: "user-account", element: <UserAccount /> },
      { path: "user-role", element: <UserRole /> },
      { path: "department", element: <Department /> },
      { path: "branch", element: <Branch /> },
      { path: "group", element: <Group /> },
      { path: "category", element: <Category /> },
    ],
  },
]);
