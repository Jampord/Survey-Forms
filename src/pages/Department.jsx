import NavBar from "../components/NavBar";
import { DepartmentInfo } from "../components/DepartmentInfo";
import DepartmentForm from "../components/DepartmentForm";
import { useDispatch, useSelector } from "react-redux";
import {
  setDepartmentSearch,
  setDepartmentStatus,
} from "../redux/reducers/departmentSlice";

export default function Department() {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.department.status);

  return (
    <>
      <NavBar />
      <div id="userRoleDiv">
        <h1>Department</h1>
        <DepartmentForm />
        <input
          type="checkbox"
          id="archiveCheckbox"
          onChange={(e) => dispatch(setDepartmentStatus(!status))}
          value={status}
        />
        <label htmlFor="archiveCheckbox">Archived</label>
        <input
          type="text"
          id="searchBar"
          placeholder="Search..."
          onChange={(e) => dispatch(setDepartmentSearch(e.target.value))}
        />
      </div>
      <DepartmentInfo />
    </>
  );
}
