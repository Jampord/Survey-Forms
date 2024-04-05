import CurrentDate from "./CurrentDate";

import "./NavBar.scss";
import { Link } from "@mui/material";

export default function NavBar() {
  return (
    <nav className="navbar">
      <div className="navbar__date">
        <CurrentDate />
        <Link href="/">Home</Link>
        <Link href="user-account">Users</Link>
        <Link href="user-role">User Roles</Link>
        <Link href="department">Department</Link>
        <Link href="branch">Branch</Link>
        <Link href="group">Group</Link>
        <Link href="category">Category</Link>
        <Link href="login">Logout</Link>
      </div>
    </nav>
  );
}
