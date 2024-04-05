import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useAddGroupMutation } from "../redux/api/groupAPI";
import { yupResolver } from "@hookform/resolvers/yup";
import { groupsYup } from "../schema/Schema";

const GroupForm = () => {
  const [addGroup] = useAddGroupMutation();
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = async (data) => {
    try {
      await addGroup(data).unwrap(); //unwrap is important
      handleClose();
    } catch (err) {
      console.log(err);
    }
  };

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(groupsYup.schema),
    mode: "onChange",
    defaultValues: groupsYup.defaultValues,
  });

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
            Add Group Form
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            {!errors.groupName ? (
              <Controller
                name="groupName"
                control={control}
                defaultValue={groupsYup.defaultValues}
                render={({ field }) => (
                  <TextField {...field} label="Group Name" variant="filled" />
                )}
              />
            ) : (
              <Controller
                name="groupName"
                control={control}
                defaultValue={groupsYup.defaultValues}
                render={({ field }) => (
                  <TextField
                    {...field}
                    error
                    label="Group Name"
                    variant="filled"
                    helperText={errors.groupName.message}
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
};

export default GroupForm;