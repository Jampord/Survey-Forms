import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { useState } from "react";
import API from "../utils/API";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { departmentsYup } from "../schema/Schema";
import { useAddDepartmentMutation } from "../redux/api/departmentAPI";

export default function DepartmentForm() {
  const [open, setOpen] = useState(false);
  const [addDepartment, { isLoading }] = useAddDepartmentMutation(); //api

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
    } catch (err) {
      console.log(err);
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
            Add Department Form
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            {!errors.departmentName ? (
              <Controller
                name="departmentName"
                control={control}
                defaultValue={departmentsYup.defaultValues}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Department Name"
                    variant="filled"
                  />
                )}
              />
            ) : (
              <Controller
                name="departmentName"
                control={control}
                defaultValue={departmentsYup.defaultValues}
                render={({ field }) => (
                  <TextField
                    {...field}
                    error
                    label="Department Name"
                    variant="filled"
                    helperText={errors.departmentName.message}
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
