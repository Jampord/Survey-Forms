import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { rolesYup } from "../schema/Schema";
import { useAddRoleMutation, useGetAllRolesQuery } from "../redux/api/userAPI";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import useDisclosure from "../hooks/useDisclosure";
import {
  setSnackbarMessage,
  setSnackbarSeverity,
} from "../redux/reducers/snackbarSlice";
import { useDispatch, useSelector } from "react-redux";
import { navigationData } from "../routes/NavigationData";

export default function UserForm() {
  const [open, setOpen] = useState(false);
  function handleOpen() {
    setOpen(true);
  }

  function handleClose() {
    reset();
    setOpen(false);
  }
  const dispatch = useDispatch();
  const snackbarMessage = useSelector((state) => state.snackbar.message);
  const snackbarSeverity = useSelector((state) => state.snackbar.severity);
  const {
    isOpen: isSnackbarOpen,
    onOpen: onSnackbarOpen,
    onClose: onSnackbarClose,
  } = useDisclosure();
  // const roleStatus = useSelector((state) => state.role.status);

  // const { roles } = useGetAllRolesQuery({ status: roleStatus });

  const {
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors },
    getValues,
  } = useForm({
    resolver: yupResolver(rolesYup.schema),
    mode: "onChange",
    defaultValues: rolesYup.defaultValues,
  });

  const [addRole, { isLoading }] = useAddRoleMutation();

  const onSubmit = async (data) => {
    const transformData = {
      ...data,
    };
    try {
      // await API.post("Role/AddNewRole", data);
      // reset();
      // handleClose();

      await addRole(transformData).unwrap();
      dispatch(setSnackbarSeverity("success"));
      dispatch(setSnackbarMessage("User Updated Successfully!"));
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

  console.log(navigationData);
  console.log(watch());

  return (
    <div>
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
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Role Form
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="roleName"
              control={control}
              defaultValue={rolesYup.defaultValues}
              render={({ field }) =>
                !errors.roleName ? (
                  <TextField
                    {...field}
                    label="Role Name"
                    variant="filled"
                    fullWidth
                  />
                ) : (
                  <TextField
                    {...field}
                    error
                    label="Role Name"
                    variant="filled"
                    helperText={errors.roleName.message}
                    fullWidth
                  />
                )
              }
            />

            {/* <Controller
              name="permission"
              control={control}
              render={({ field }) => {
                navigationData.map((item) => {
                  return (
                    <FormControlLabel
                      control={
                        <Checkbox {...field} key={item.id} label={item.name} />
                      }
                      label={item.name}
                    />
                  );
                });
              }}
            /> */}

            {navigationData.map((item) => (
              <Controller
                key={item.id}
                name={`permission[${item.id - 1}]`}
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <FormControlLabel
                    control={<Checkbox {...field} />}
                    label={item.name}
                  />
                )}
              />
            ))}

            {/* <Controller
              name="permission"
              control={control}
              defaultValue=""
              render={({ field }) =>
                !errors.permission ? (
                  <TextField {...field} label="Permission" variant="filled" />
                ) : (
                  <TextField
                    {...field}
                    error
                    label="Permission"
                    variant="filled"
                    helperText={errors.permission.message}
                  />
                )
              }
            /> */}
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
    </div>
  );
}
