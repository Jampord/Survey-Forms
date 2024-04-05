import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { useState } from "react";
import API from "../utils/API";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { rolesYup } from "../schema/Schema";
import { useAddRoleMutation } from "../redux/api/userAPI";

export default function UserForm() {
  const [open, setOpen] = useState(false);
  function handleOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  const {
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(rolesYup.schema),
    mode: "onChange",
    defaultValues: rolesYup.defaultValues,
  });

  console.log(watch());

  const [addRole, { isLoading }] = useAddRoleMutation();

  const onSubmit = async (data) => {
    try {
      // await API.post("Role/AddNewRole", data);
      // reset();
      // handleClose();

      await addRole(data).unwrap();
    } catch (err) {
      console.log(err);
    }
  };

  console.log(errors);

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
            {!errors.roleName ? (
              <Controller
                name="roleName"
                control={control}
                defaultValue={rolesYup.defaultValues}
                render={({ field }) => (
                  <TextField {...field} label="Role Name" variant="filled" />
                )}
              />
            ) : (
              <Controller
                name="roleName"
                control={control}
                defaultValue={rolesYup.defaultValues}
                render={({ field }) => (
                  <TextField
                    {...field}
                    error
                    label="Role Name"
                    variant="filled"
                    helperText={errors.roleName.message}
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
    </div>
  );
}
