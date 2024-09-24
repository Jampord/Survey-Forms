import "../styles/UserAccount.scss";
import UserInfo from "../components/UserInfo";
import NavBar from "../components/NavBar";

import UserForm from "../components/UserForm";
import { Box, Checkbox, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setUserSearch, setUserStatus } from "../redux/reducers/userSlice";
import Sidebar from "../components/SideBar";

export default function UserAccount() {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.user.status);

  return (
    <>
      <Sidebar>
        {/* <NavBar />   */}
        <Box className="userAccount">
          <h1>User Account</h1>
          <div className="userAccount1">
            <UserForm />
            <div className="userAccount2">
              <Checkbox
                id="archiveCheckbox"
                onChange={(e) => dispatch(setUserStatus(!status))}
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
                onChange={(e) => dispatch(setUserSearch(e.target.value))}
              />
            </div>
          </div>
        </Box>
        <UserInfo />
      </Sidebar>
    </>
  );
}
