import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
  Autocomplete,
} from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useAddGroupMutation } from "../redux/api/groupAPI";
import { yupResolver } from "@hookform/resolvers/yup";
import { groupsYup } from "../schema/Schema";
import { useGetAllBranchesQuery } from "../redux/api/branchAPI";
import { useSelector, useDispatch } from "react-redux";
import useDisclosure from "../hooks/useDisclosure";
import {
  setSnackbarMessage,
  setSnackbarSeverity,
} from "../redux/reducers/snackbarSlice";

const GroupForm = () => {
  const [addGroup] = useAddGroupMutation();
  const dispatch = useDispatch();
  const snackbarMessage = useSelector((state) => state.snackbar.message);
  const snackbarSeverity = useSelector((state) => state.snackbar.severity);

  const handleClose = () => {
    // setOpen(false);
    onClose();
    reset();
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isSnackbarOpen,
    onOpen: onSnackbarOpen,
    onClose: onSnackbarClose,
  } = useDisclosure();

  const branchStatus = useSelector((state) => state.branch.status);
  const { data: branches } = useGetAllBranchesQuery({ status: branchStatus });

  const onSubmit = async (data) => {
    const transformData = {
      ...data,
      branchId: data.branchId.id,
    };
    try {
      await addGroup(transformData).unwrap(); //unwrap is important
      handleClose();
      dispatch(setSnackbarSeverity("success"));
      dispatch(setSnackbarMessage("Group Added Successfully!"));
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
        onClick={onOpen}
        size="small"
      >
        Add
      </Button>
      <Modal open={isOpen}>
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Group Form
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="groupName"
              control={control}
              defaultValue={groupsYup.defaultValues}
              render={({ field }) =>
                !errors.groupName ? (
                  <TextField
                    {...field}
                    label="Group Name"
                    variant="filled"
                    fullWidth
                  />
                ) : (
                  <TextField
                    {...field}
                    error
                    label="Group Name"
                    variant="filled"
                    helperText={errors.groupName.message}
                    fullWidth
                  />
                )
              }
            />

            <Controller
              control={control}
              name="branchId"
              defaultValue={groupsYup.defaultValues}
              render={({ field }) => {
                return (
                  <Autocomplete
                    {...field}
                    disablePortal
                    fullWidth
                    options={branches?.branchsummary.map((option) => ({
                      id: option.id,
                      name: option.branchName,
                    }))}
                    // value={options.id}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Branches"
                        helperText="Please select a branch."
                      />
                    )}
                    onChange={(e, value) => field.onChange(value)}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id && option.name === value.name
                    }
                  />
                );
              }}
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
    </div>
  );
};

export default GroupForm;
