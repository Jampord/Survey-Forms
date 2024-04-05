import React from "react";
import NavBar from "../components/NavBar";
import GroupInfo from "../components/GroupInfo";
import { useDispatch, useSelector } from "react-redux";
import { setGroupSearch, setGroupStatus } from "../redux/reducers/groupSlice";
import GroupForm from "../components/GroupForm";

const Group = () => {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.group.status);

  return (
    <>
      <NavBar />
      <div id="userRoleDive">
        <h1>Group</h1>
        <GroupForm />
        <input
          type="checkbox"
          id="archiveCheckbox"
          onChange={(e) => dispatch(setGroupStatus(!status))}
          value={status}
        />
        <label htmlFor="archiveCheckbox">Archived</label>
        <input
          type="text"
          id="searchbar"
          placeholder="Search..."
          onChange={(e) => dispatch(setGroupSearch(e.target.value))}
        />
      </div>
      <GroupInfo />
    </>
  );
};

export default Group;
