import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { branchesYup } from "../schema/Schema";
import { useAddBranchMutation } from "../redux/api/branchAPI";
import { useDispatch, useSelector } from "react-redux";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import useDisclosure from "../hooks/useDisclosure";
import { setSnackbar } from "../redux/reducers/snackbarSlice";

const BranchForm = () => {
  const [open, setOpen] = useState(false);
  const [addBranch, { isLoading }] = useAddBranchMutation();
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
    reset();
  };

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(branchesYup.schema),
    mode: "onChange",
    defaultValues: branchesYup.defaultValues,
  });

  const onSubmit = async (data) => {
    try {
      await addBranch(data).unwrap();
      handleClose();
      dispatch(setSnackbar({ message: "Branch Added Successfully!" }));
      onSnackbarOpen();
    } catch (err) {
      console.log(err);
      dispatch(setSnackbar({ message: err.data, severity: "error" }));
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
  return (
    <>
      <Button
        id="addButton"
        variant="contained"
        onClick={handleOpen}
        sx={{ height: "25px", marginBottom: "5px" }}
      >
        Add
      </Button>
      <Modal open={open}>
        <Box sx={style}>
          <Typography variant="h6" component="h2">
            Add Branch Form
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="branchName"
              control={control}
              defaultValue={branchesYup.defaultValues}
              render={({ field }) =>
                !errors.branchName ? (
                  <TextField
                    {...field}
                    label="Branch Name"
                    variant="filled"
                    fullWidth
                  />
                ) : (
                  <TextField
                    {...field}
                    error
                    label="Branch Name"
                    variant="filled"
                    helperText={errors.branchName.message}
                    fullWidth
                  />
                )
              }
            />

            <Controller
              name="branchCode"
              control={control}
              defaultValue={branchesYup.defaultValues}
              render={({ field }) =>
                !errors.branchCode ? (
                  <TextField
                    {...field}
                    label="Branch Code"
                    variant="filled"
                    fullWidth
                  />
                ) : (
                  <TextField
                    {...field}
                    error
                    label="Branch Code"
                    variant="filled"
                    helperText={errors.branchCode.message}
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
    </>
  );
};

export default BranchForm;
