import React, { useEffect, useState } from "react";
import {
  useArchiveCategoryMutation,
  useGetAllCategoriesQuery,
  useUpdateCategoryMutation,
} from "../redux/api/categoryAPI";
import {
  Box,
  Button,
  CircularProgress,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { categoriesYup } from "../schema/Schema";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedRow } from "../redux/reducers/selectedRowSlice";

const CategoryInfo = () => {
  const [open, setOpen] = useState(false);
  const categorySearch = useSelector((state) => state.category.search);
  const categoryStatus = useSelector((state) => state.category.status);
  const selectedCategoryRow = useSelector(
    (state) => state.selectedRow.selectedRow
  );
  const dispatch = useDispatch();

  //Table Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handlePageChange = (e, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  //end of table pagination

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = async (data) => {
    try {
      await updateCategory({
        Id: selectedCategoryRow?.id,
        body: data,
      }).unwrap();
      reset();
      handleClose();
    } catch (err) {
      console.log(err);
    }
  };

  const {
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(categoriesYup.schema),
    mode: "onChange",
    defaultValues: categoriesYup.defaultValues,
  });

  //api
  const { data, isFetching } = useGetAllCategoriesQuery({
    search: categorySearch,
    status: categoryStatus,
    PageNumber: page + 1,
    PageSize: rowsPerPage,
  });
  const [updateCategory] = useUpdateCategoryMutation();
  const [archiveCategory] = useArchiveCategoryMutation();
  //end of api

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    display: "flex",
    flexDirection: "column",
  };

  useEffect(() => {
    if (open) {
      setValue("categoryName", selectedCategoryRow?.categoryName);
      setValue("categoryPercentage", selectedCategoryRow?.categoryPercentage);
    }
  }, [open, setValue, selectedCategoryRow]);

  return (
    <>
      <Box className="userInfo">
        {isFetching ? (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table className="table">
                <TableHead>
                  <TableRow align="center">
                    <TableCell>
                      <strong>ID</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Category Name</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Category Percentage</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Actions</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {data?.categorysummary.map((category) => {
                    return (
                      <TableRow
                        key={category.id}
                        onClick={() => dispatch(setSelectedRow(category))}
                      >
                        <TableCell>{category.id}</TableCell>
                        <TableCell>{category.categoryName}</TableCell>
                        <TableCell>{category.categoryPercentage}</TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", gap: "10px" }}>
                            <Button
                              variant="contained"
                              size="small"
                              onClick={handleOpen}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="contained"
                              size="small"
                              color={categoryStatus ? "error" : "warning"}
                              onClick={() =>
                                archiveCategory({ Id: category.id })
                              }
                            >
                              {categoryStatus ? "Archive" : "Restore"}
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[10, 25, 50]}
              component="div"
              count={data?.totalCount}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPage}
            />
          </>
        )}
      </Box>

      <Modal open={open}>
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Edit User Form
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            {!errors.categoryName ? (
              <Controller
                name="categoryName"
                control={control}
                defaultValue={categoriesYup.defaultValues}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Category Name"
                    variant="filled"
                  />
                )}
              />
            ) : (
              <Controller
                name="categoryName"
                control={control}
                defaultValue={categoriesYup.defaultValues}
                render={({ field }) => (
                  <TextField
                    {...field}
                    error
                    label="Category Name"
                    variant="filled"
                    helperText={errors.categoryName.message}
                  />
                )}
              />
            )}

            {!errors.categoryPercentage ? (
              <Controller
                name="categoryPercentage"
                control={control}
                defaultValue={categoriesYup.defaultValues}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Category Percentage"
                    variant="filled"
                  />
                )}
              />
            ) : (
              <Controller
                name="categoryPercentage"
                control={control}
                defaultValue={categoriesYup.defaultValues}
                render={({ field }) => (
                  <TextField
                    {...field}
                    error
                    label="Category Percentage"
                    variant="filled"
                    helperText={errors.categoryPercentage.message}
                  />
                )}
              />
            )}

            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  display: "inline-flex",
                  width: 80,
                  marginRight: 2,
                  fontSize: 12,
                }}
              >
                Update
              </Button>
              <Button
                onClick={handleClose}
                variant="outlined"
                sx={{ display: "inline-flex", width: 50, fontSize: 12 }}
              >
                Cancel
              </Button>{" "}
            </Box>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default CategoryInfo;
