import { RoleInfo } from "../components/RoleInfo";

import "./UserRole.scss";
import NavBar from "../components/NavBar";
import RoleForm from "../components/RoleForm";
import { Box } from "@mui/material";
import { setRoleSearch, setRoleStatus } from "../redux/reducers/roleSlice";
import { useDispatch, useSelector } from "react-redux";

export default function UserRole() {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.role.status);

  return (
    <>
      <NavBar />
      <Box className="userRole">
        <h1 className="userHeader">User Role</h1>
        <RoleForm />

        <input
          type="checkbox"
          id="archiveCheckbox"
          onChange={(e) => dispatch(setRoleStatus(!status))}
          value={status}
        />
        <label htmlFor="archiveCheckbox">Archived</label>
        <input
          type="text"
          id="searchBar"
          placeholder="Search..."
          onChange={(e) => dispatch(setRoleSearch(e.target.value))}
        />
      </Box>
      <RoleInfo />
    </>
  );
}
