import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useAddCategoryMutation } from "../redux/api/categoryAPI";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { categoriesYup } from "../schema/Schema";
import useDisclosure from "../hooks/useDisclosure";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import {
  setSnackbarMessage,
  setSnackbarSeverity,
} from "../redux/reducers/snackbarSlice";
import { useDispatch, useSelector } from "react-redux";

const CategoryForm = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const snackbarMessage = useSelector((state) => state.snackbar.message);
  const snackbarSeverity = useSelector((state) => state.snackbar.severity);
  const {
    isOpen: isSnackbarOpen,
    onOpen: onSnackbarOpen,
    onClose: onSnackbarClose,
  } = useDisclosure();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  //api
  const [addCategory] = useAddCategoryMutation();
  //end of api

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(categoriesYup.schema),
    mode: "onChange",
    defaultValues: categoriesYup.defaultValues,
  });

  const onSubmit = async (data) => {
    try {
      await addCategory(data).unwrap();
      reset();
      handleClose();
      dispatch(setSnackbarSeverity("success"));
      dispatch(setSnackbarMessage("Category Added Successfully!"));
      onSnackbarOpen();
    } catch (err) {
      console.log(err);
      dispatch(setSnackbarSeverity("error"));
      dispatch(setSnackbarMessage(err.data));
      onSnackbarOpen();
    }
  };

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

  console.log(errors);

  return (
    <div>
      <Button
        id="addButton"
        variant="contained"
        onClick={handleOpen}
        size="small"
      >
        Add
      </Button>
      <Modal open={open}>
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Category Form
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
                    label="Category Percentage"
                    variant="filled"
                    fullWidth
                  />
                ) : (
                  <TextField
                    {...field}
                    error
                    label="Category Percentage"
                    variant="filled"
                    helperText={errors?.categoryPercentage?.message}
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
                !errors.categoryPercentage ? (
                  <TextField
                    {...field}
                    label="Score Limit"
                    variant="filled"
                    fullWidth
                  />
                ) : (
                  <TextField
                    {...field}
                    error
                    label="Score Limit"
                    variant="filled"
                    helperText={errors?.limit?.message}
                    fullWidth
                  />
                )
              }
            />

            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Button
                type="submit"
                variant="contained"
                // disabled={!isValid}
                sx={{
                  display: "inline-flex",
                  width: 80,
                  marginRight: 2,
                  fontSize: 12,
                }}
              >
                Submit
              </Button>

              <Button
                onClick={handleClose}
                variant="outlined"
                sx={{ display: "inline-flex", width: 50, fontSize: 12 }}
              >
                Cancel
              </Button>
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
    </div>
  );
};

export default CategoryForm;
