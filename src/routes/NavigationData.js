import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import BusinessIcon from "@mui/icons-material/Business";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import GroupIcon from "@mui/icons-material/Group";
import CategoryIcon from "@mui/icons-material/Category";

export const navigationData = [
  {
    id: 1,
    path: "/",
    name: "Home",
    icon: <HomeIcon />,
  },
  { id: 2, path: "/user-account", name: "User Accounts", icon: <PersonIcon /> },
  {
    id: 3,
    path: "/user-role",
    name: "User Roles",
    icon: <SupervisorAccountIcon />,
  },
  { id: 4, path: "/department", name: "Departments", icon: <BusinessIcon /> },
  { id: 5, path: "/branch", name: "Branches", icon: <LocationCityIcon /> },
  { id: 6, path: "/group", name: "Groups", icon: <GroupIcon /> },
  { id: 7, path: "/category", name: "Categories", icon: <CategoryIcon /> },
];
// Home
// User Accounts
// User Roles
// Departments
// Branches
// Groups
// Categories
