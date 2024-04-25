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

const Branch = () => {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.branch.status);

  return (
    <>
      <NavBar />
      <Box className="branch">
        <h1>Branch</h1>
        <BranchForm />
        <Checkbox
          id="archiveCheckbox"
          onChange={(e) => dispatch(setBranchStatus(!status))}
          value={status}
        />
        <label htmlFor="archiveCheckbox">Archived</label>
        <TextField
          size="small"
          type="search"
          id="searchBar"
          placeholder="Search..."
          className="userAccountInput"
          onChange={(e) => dispatch(setBranchSearch(e.target.value))}
        />
      </Box>
      <BranchInfo />
    </>
  );
};

export default Branch;
