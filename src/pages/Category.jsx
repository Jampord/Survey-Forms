import React from "react";
import NavBar from "../components/NavBar";
import { useDispatch, useSelector } from "react-redux";
import {
  setCategorySearch,
  setCategoryStatus,
} from "../redux/reducers/categorySlice";
import CategoryInfo from "../components/CategoryInfo";
import CategoryForm from "../components/CategoryForm";

const Category = () => {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.category.status);

  return (
    <>
      <NavBar />
      <div className="userRoleDiv">
        <h1>Category</h1>
        <CategoryForm />
        <input
          type="checkbox"
          id="archiveCheckbox"
          onChange={(e) => dispatch(setCategoryStatus(!status))}
        />
        <label htmlFor="archiveCheckbox">Archived</label>
        <input
          type="text"
          id="searchBar"
          placeholder="Search..."
          onChange={(e) => dispatch(setCategorySearch(e.target.value))}
        />
      </div>
      <CategoryInfo />
    </>
  );
};

export default Category;
