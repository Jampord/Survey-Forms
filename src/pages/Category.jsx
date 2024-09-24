import React from "react";
import "../styles/Category.scss";
import NavBar from "../components/NavBar";
import { useDispatch, useSelector } from "react-redux";
import {
  setCategorySearch,
  setCategoryStatus,
} from "../redux/reducers/categorySlice";
import CategoryInfo from "../components/CategoryInfo";
import CategoryForm from "../components/CategoryForm";
import { Box, Checkbox, TextField } from "@mui/material";
import Sidebar from "../components/SideBar";

const Category = () => {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.category.status);

  return (
    <>
      <Sidebar>
        {/* <NavBar /> */}
        <Box className="category">
          <h1>Category</h1>
          <div className="category1">
            <CategoryForm />
            <div className="category2">
              <TextField
                size="small"
                type="search"
                id="searchBar"
                placeholder="Search..."
                className="userAccountInput"
                onChange={(e) => dispatch(setCategorySearch(e.target.value))}
              />
            </div>
          </div>
        </Box>
        <CategoryInfo />
      </Sidebar>
    </>
  );
};

export default Category;
