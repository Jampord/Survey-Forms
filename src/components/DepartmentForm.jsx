import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { departmentsYup } from "../schema/Schema";
import { useAddDepartmentMutation } from "../redux/api/departmentAPI";
import { useDispatch, useSelector } from "react-redux";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import useDisclosure from "../hooks/useDisclosure";
import {
  setSnackbarMessage,
  setSnackbarSeverity,
} from "../redux/reducers/snackbarSlice";

export default function DepartmentForm() {
  const [open, setOpen] = useState(false);
  const [addDepartment, { isLoading }] = useAddDepartmentMutation(); //api
  const dispatch = useDispatch();
  const snackbarMessage = useSelector((state) => state.snackbar.message);
  const snackbarSeverity = useSelector((state) => state.snackbar.severity);
  const {
    isOpen: isSnackbarOpen,
    onOpen: onSnackbarOpen,
    onClose: onSnackbarClose,
  } = useDisclosure();

  function handleOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  const {
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(departmentsYup.schema),
    mode: "onChange",
    defaultValues: departmentsYup.defaultValues,
  });

  const onSubmit = async (data) => {
    try {
      await addDepartment(data).unwrap(); //unwrap is important
      handleClose();
      dispatch(setSnackbarSeverity("success"));
      dispatch(setSnackbarMessage("Department Added Successfully!"));
      onSnackbarOpen();
    } catch (err) {
      console.log(err);
      dispatch(setSnackbarSeverity("error"));
      dispatch(setSnackbarMessage(err.data));
      onSnackbarOpen();
    }
  };

  console.log(watch());

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
        size="small"
      >
        Add
      </Button>
      <Modal open={open}>
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Department Form
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="departmentName"
              control={control}
              defaultValue={departmentsYup.defaultValues}
              render={({ field }) =>
                !errors.departmentName ? (
                  <TextField
                    {...field}
                    label="Department Name"
                    variant="filled"
                    fullWidth
                  />
                ) : (
                  <TextField
                    {...field}
                    error
                    label="Department Name"
                    variant="filled"
                    helperText={errors.departmentName.message}
                    fullWidth
                  />
                )
              }
            />

            <Controller
              name="departmentNo"
              control={control}
              defaultValue={departmentsYup.defaultValues}
              render={({ field }) =>
                !errors.departmentNo ? (
                  <TextField
                    {...field}
                    label="Department No."
                    variant="filled"
                    fullWidth
                  />
                ) : (
                  <TextField
                    {...field}
                    error
                    label="Department No."
                    variant="filled"
                    helperText={errors.departmentNo.message}
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
}
