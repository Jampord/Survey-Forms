import React, { useEffect, useState } from "react";
import {
  useDeleteCategoryMutation,
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
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { categoriesYup } from "../schema/Schema";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedRow } from "../redux/reducers/selectedRowSlice";
import useDisclosure from "../hooks/useDisclosure";
import {
  setSnackbarMessage,
  setSnackbarSeverity,
} from "../redux/reducers/snackbarSlice";

const CategoryInfo = () => {
  const [open, setOpen] = useState(false);
  const categorySearch = useSelector((state) => state.category.search);
  const categoryStatus = useSelector((state) => state.category.status);
  const selectedCategoryRow = useSelector(
    (state) => state.selectedRow.selectedRow
  );
  const dispatch = useDispatch();
  const snackbarMessage = useSelector((state) => state.snackbar.message);
  const snackbarSeverity = useSelector((state) => state.snackbar.severity);
  const {
    isOpen: isSnackbarOpen,
    onOpen: onSnackbarOpen,
    onClose: onSnackbarClose,
  } = useDisclosure();
  const {
    isOpen: isConfirmDialogOpen,
    onOpen: onConfirmDialogOpen,
    onClose: onConfirmDialogClose,
  } = useDisclosure();

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
      dispatch(setSnackbarSeverity("success"));
      dispatch(setSnackbarMessage("Category Updated Successfully!"));
      onSnackbarOpen();
    } catch (err) {
      console.log(err);
      dispatch(setSnackbarSeverity("error"));
      dispatch(setSnackbarMessage(err.data));
      onSnackbarOpen();
    }
  };

  const onConfirm = async () => {
    try {
      await deleteCategory({ Id: selectedCategoryRow?.id });
      onConfirmDialogClose();
      dispatch(setSnackbarSeverity("success"));
      dispatch(setSnackbarMessage("Category Deleted Successfully!"));
      onSnackbarOpen();
    } catch (err) {
      console.log(err);
      dispatch(setSnackbarSeverity("error"));
      dispatch(setSnackbarMessage(err.data));
      onSnackbarOpen();
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
  const [deleteCategory] = useDeleteCategoryMutation();
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
      setValue("limit", selectedCategoryRow?.limit);
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
                    {/* <TableCell>
                      <strong>ID</strong>
                    </TableCell> */}
                    <TableCell>
                      <strong>Category Name</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Category Percentage</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Score Limit</strong>
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
                        {/* <TableCell>{category.id}</TableCell> */}
                        <TableCell>{category.categoryName}</TableCell>
                        <TableCell>{category.categoryPercentage}%</TableCell>
                        <TableCell>{category.limit}</TableCell>

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
                              onClick={() => onConfirmDialogOpen()}
                            >
                              Delete
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
            Edit Category Form
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="categoryName"
              control={control}
              defaultValue={categoriesYup.defaultValues}
              render={({ field }) =>
                !errors.categoryName ? (
                  <TextField
                    {...field}
                    label="Category Name"
                    variant="filled"
                    fullWidth
                  />
                ) : (
                  <TextField
                    {...field}
                    error
                    label="Category Name"
                    variant="filled"
                    helperText={errors.categoryName.message}
                    fullWidth
                  />
                )
              }
            />

            <Controller
              name="categoryPercentage"
              control={control}
              defaultValue={categoriesYup.defaultValues}
              render={({ field }) =>
                !errors.categoryPercentage ? (
                  <TextField
                    {...field}
                    autoComplete="false"
                    label="Category Percentage"
                    variant="filled"
                    type="number"
                    fullWidth
                  />
                ) : (
                  <TextField
                    {...field}
                    autoComplete="false"
                    error
                    label="Category Percentage"
                    variant="filled"
                    type="number"
                    helperText={errors.categoryPercentage.message}
                    fullWidth
                  />
                )
              }
            />

            <Controller
              name="limit"
              control={control}
              defaultValue={categoriesYup.defaultValues}
              render={({ field }) =>
                !errors.limit ? (
                  <TextField
                    {...field}
                    autoComplete="false"
                    label="Score Limit"
                    variant="filled"
                    type="number"
                    fullWidth
                  />
                ) : (
                  <TextField
                    {...field}
                    autoComplete="false"
                    error
                    label="Category Percentage"
                    variant="filled"
                    type="number"
                    helperText={errors.limit.message}
                    fullWidth
                  />
                )
              }
            />

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

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={isSnackbarOpen}
        autoHideDuration={3000}
        onClose={onSnackbarClose}
      >
        <Alert
          onClose={onSnackbarClose}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Dialog open={isConfirmDialogOpen} onClose={onConfirmDialogClose}>
        <DialogTitle>Delete Category</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this category?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={onConfirm}
            variant="contained"
            autoFocus
            color={categoryStatus ? "warning" : "primary"}
            sx={{
              display: "inline-flex",
              width: 80,
              marginRight: 0,
              fontSize: 12,
            }}
          >
            Yes
          </Button>
          <Button
            onClick={onConfirmDialogClose}
            variant="outlined"
            sx={{
              display: "inline-flex",
              width: 80,
              fontSize: 12,
            }}
          >
            No
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CategoryInfo;
