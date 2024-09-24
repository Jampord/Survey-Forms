import React from "react";
import "../styles/Branch.scss";
import NavBar from "../components/NavBar";
import BranchForm from "../components/BranchForm";
import BranchInfo from "../components/BranchInfo";
import { useDispatch, useSelector } from "react-redux";
import {
  setBranchSearch,
  setBranchStatus,
} from "../redux/reducers/branchSlice";
import { Box, Checkbox, TextField } from "@mui/material";
import Sidebar from "../components/SideBar";

const Branch = () => {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.branch.status);

  return (
    <>
      <Sidebar>
        {/* <NavBar /> */}
        <Box className="branch">
          <h1>Branch</h1>
          <div className="branch1">
          <BranchForm class="branchForm"/>
          <div className="branch2">
          <Checkbox
            id="archiveCheckbox"
            onChange={(e) => dispatch(setBranchStatus(!status))}
            value={status}
          />
          <label for="archiveCheckbox">Archived</label>
          <TextField
            size="small"
            type="search"
            id="searchBar"
            placeholder="Search..."
            class="userAccountInput"
            onChange={(e) => dispatch(setBranchSearch(e.target.value))}
          />
          </div>
          </div>
        </Box>
        <BranchInfo />
      </Sidebar>
    </>
  );
};

export default Branch;
