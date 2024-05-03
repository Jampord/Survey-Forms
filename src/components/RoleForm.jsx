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
  setSnackbar,
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
    const permissionArray = [];

    data.permission.map((item, index) => {
      if (!item) {
        return null;
      }
      return permissionArray.push(navigationData[index].name);
    });

    const transformData = {
      ...data,
      permission: permissionArray,
    };
    try {
      // await API.post("Role/AddNewRole", data);
      // reset();
      // handleClose();

      await addRole(transformData).unwrap();
      dispatch(setSnackbar({message:"User Updated Successfully!"}));
      onSnackbarOpen();
      handleClose();
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

  // console.log(navigationData);
  // console.log(watch());

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

            <h5>Set Permissions:</h5>
            {navigationData.map((item) => (
              <Box key={item.id}>
                <Controller
                  control={control}
                  name={`permission[${item.id - 1}]`} // Use an appropriate name for your form data
                  defaultValue={false} // Set default value if needed
                  render={({ field }) => (
                    <FormControlLabel
                      {...field}
                      control={<Checkbox />}
                      label={item.name}
                    />
                  )}
                />
              </Box>
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
