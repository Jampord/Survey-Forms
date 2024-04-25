import "../styles/UserAccount.scss";
import UserInfo from "../components/UserInfo";
import NavBar from "../components/NavBar";

import UserForm from "../components/UserForm";
import { Box, Checkbox, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setUserSearch, setUserStatus } from "../redux/reducers/userSlice";

export default function UserAccount() {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.user.status);

  return (
    <>
      <NavBar />
      <Box className="userAccount">
        <h1>User Account</h1>
        <UserForm />
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
      </Box>
      <UserInfo />
    </>
  );
}
