import React from "react";
import "../styles/Group.scss";
import NavBar from "../components/NavBar";
import GroupInfo from "../components/GroupInfo";
import { useDispatch, useSelector } from "react-redux";
import { setGroupSearch, setGroupStatus } from "../redux/reducers/groupSlice";
import GroupForm from "../components/GroupForm";
import { Box, Checkbox, TextField } from "@mui/material";
import Sidebar from "../components/SideBar";

const Group = () => {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.group.status);

  return (
    <>
      <Sidebar>
        {/* <NavBar /> */}
        <Box className="group">
          <h1>Group</h1>
          <GroupForm />
          <Checkbox
            id="archiveCheckbox"
            onChange={(e) => dispatch(setGroupStatus(!status))}
            value={status}
          />
          <label htmlFor="archiveCheckbox">Archived</label>
          <TextField
            size="small"
            type="search"
            id="searchBar"
            placeholder="Search..."
            className="userAccountInput"
            onChange={(e) => dispatch(setGroupSearch(e.target.value))}
          />
        </Box>
        <GroupInfo />
      </Sidebar>
    </>
  );
};

export default Group;
