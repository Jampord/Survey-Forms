import React from "react";
import NavBar from "../components/NavBar";
import BranchForm from "../components/BranchForm";
import BranchInfo from "../components/BranchInfo";
import { useDispatch, useSelector } from "react-redux";
import {
  setBranchSearch,
  setBranchStatus,
} from "../redux/reducers/branchSlice";

const Branch = () => {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.branch.status);

  return (
    <>
      <NavBar />
      <div className="userRoleDiv">
        <h1>Branch</h1>
        <BranchForm />
        <input
          type="checkbox"
          id="archiveCheckbox"
          onChange={(e) => dispatch(setBranchStatus(!status))}
          value={status}
        />
        <label htmlFor="archiveCheckbox">Archived</label>
        <input
          type="text"
          id="searchBar"
          placeholder="Search..."
          onChange={(e) => dispatch(setBranchSearch(e.target.value))}
        />
      </div>
      <BranchInfo />
    </>
  );
};

export default Branch;
