import { RoleInfo } from "../components/RoleInfo";

import "../styles/UserRole.scss";
import NavBar from "../components/NavBar";
import RoleForm from "../components/RoleForm";
import { Box, Checkbox, TextField } from "@mui/material";
import { setRoleSearch, setRoleStatus } from "../redux/reducers/roleSlice";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../components/SideBar";

export default function UserRole() {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.role.status);

  return (
    <>
      <Sidebar>
        {/* <NavBar /> */}
        <Box className="userRole">
          <h1>User Role</h1>
          <div className="userRole1">
            <RoleForm />
            <div className="userRole2">
              <Checkbox
                id="archiveCheckbox"
                onChange={(e) => dispatch(setRoleStatus(!status))}
                value={status}
              />
              <label htmlFor="archiveCheckbox" className="userAccountInput">
                Archived
              </label>
              <TextField
                size="small"
                type="search"
                id="searchBar"
                placeholder="Search..."
                className="userAccountInput"
                onChange={(e) => dispatch(setRoleSearch(e.target.value))}
              />
            </div>
          </div>
        </Box>
        <RoleInfo />
      </Sidebar>
    </>
  );
}
