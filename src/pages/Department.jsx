import "../styles/Department.scss";
import NavBar from "../components/NavBar";
import { DepartmentInfo } from "../components/DepartmentInfo";
import DepartmentForm from "../components/DepartmentForm";
import { useDispatch, useSelector } from "react-redux";
import {
  setDepartmentSearch,
  setDepartmentStatus,
} from "../redux/reducers/departmentSlice";
import { Box, Checkbox, TextField } from "@mui/material";

export default function Department() {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.department.status);

  return (
    <>
      <NavBar />
      <Box className="department">
        <h1>Department</h1>
        <DepartmentForm />
        <Checkbox
          id="archiveCheckbox"
          onChange={(e) => dispatch(setDepartmentStatus(!status))}
          value={status}
        />
        <label htmlFor="archiveCheckbox">Archived</label>
        <TextField
          size="small"
          type="search"
          id="searchBar"
          placeholder="Search..."
          className="userAccountInput"
          onChange={(e) => dispatch(setDepartmentSearch(e.target.value))}
        />
      </Box>
      <DepartmentInfo />
    </>
  );
}
