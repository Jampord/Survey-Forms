import { useEffect, useState } from "react";

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
  Autocomplete,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import {
  useArchiveUserMutation,
  useGetAllRolesQuery,
  useGetAllUsersQuery,
  useResetPasswordMutation,
  useUpdateUserMutation,
} from "../redux/api/userAPI";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { usersEditYup } from "../schema/Schema";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedRow } from "../redux/reducers/selectedRowSlice";
import { useGetAllDepartmentsQuery } from "../redux/api/departmentAPI";
import useDisclosure from "../hooks/useDisclosure";
import {
  setSnackbarMessage,
  setSnackbarSeverity,
} from "../redux/reducers/snackbarSlice";
import { useGetAllGroupsQuery } from "../redux/api/groupAPI";
import ExpandCircleDownIcon from "@mui/icons-material/ExpandCircleDown";
import EditIcon from "@mui/icons-material/Edit";
import ArchiveIcon from "@mui/icons-material/Archive";
import UnarchiveIcon from "@mui/icons-material/Unarchive";
import KeyIcon from "@mui/icons-material/Key";
import PasswordIcon from "@mui/icons-material/Password";

export default function UserInfo() {
  const [open, setOpen] = useState(false);
  const userSearch = useSelector((state) => state.user.search);
  const userStatus = useSelector((state) => state.user.status);
  const selectedUserRow = useSelector((state) => state.selectedRow.selectedRow);
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
  const {
    isOpen: isResetPasswordDialogOpen,
    onOpen: onResetPasswordDialogOpen,
    onClose: onResetPasswordDialogClose,
  } = useDisclosure();

  //Table Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const roleStatus = useSelector((state) => state.role.status);
  const departmentStatus = useSelector((state) => state.department.status);
  const groupStatus = useSelector((state) => state.group.status);

  const handlePageChange = (e, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPage = (e) => {
    setRowsPerPage(+e.target.value);
    setPage(0);
  };

  //end of table pagination
  const [anchorEl, setAnchorEl] = useState(null);
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const handleClick = (event, index) => {
    setAnchorEl(event.currentTarget);
    setOpenMenuIndex(index);
  };

  const onMenuClose = () => {
    setAnchorEl(null);
    setOpenMenuIndex(null);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(usersEditYup.schema),
    mode: "onChange",
    defaultValues: usersEditYup.defaultValues,
  });

  const onSubmit = async (data) => {
    const transformData = {
      ...data,
      roleId: data.roleId.id,
      departmentId: data.departmentId.id,
      groupsId: data.groupsId.id,
    };
    try {
      await updateUser({
        Id: selectedUserRow?.id,
        body: transformData,
      }).unwrap();
      reset();
      handleClose();
      dispatch(setSnackbarSeverity("success"));
      dispatch(setSnackbarMessage("User Updated Successfully!"));
      onSnackbarOpen();
      onMenuClose();
    } catch (err) {
      console.log(err);
      dispatch(setSnackbarSeverity("error"));
      dispatch(setSnackbarMessage(err.data));
      onSnackbarOpen();
    }
  };

  const onConfirm = async () => {
    try {
      await archiveUser({ Id: selectedUserRow?.id });
      onConfirmDialogClose();
      dispatch(setSnackbarSeverity("success"));
      dispatch(
        setSnackbarMessage(
          userStatus
            ? "User Archived Successfully!"
            : "User Restored Successfully!"
        )
      );
      onSnackbarOpen();
      onMenuClose();
    } catch (err) {
      console.log(err);
      dispatch(setSnackbarSeverity("error"));
      dispatch(setSnackbarMessage(err.data));
      onSnackbarOpen();
    }
  };

  const onConfirmResetPassword = async () => {
    try {
      await resetPassword({ Id: selectedUserRow?.id });
      onResetPasswordDialogClose();
      dispatch(setSnackbarSeverity("success"));
      dispatch(setSnackbarMessage("Password was reset!"));
      onSnackbarOpen();
      onMenuClose();
    } catch (err) {
      console.log(err);
      dispatch(setSnackbarSeverity("error"));
      dispatch(setSnackbarMessage(err.data));
      onSnackbarOpen();
    }
  };

  // api
  const { data, isFetching } = useGetAllUsersQuery({
    pageNumber: page + 1,
    pageSize: rowsPerPage,
    search: userSearch,
    status: userStatus,
  });

  const { data: roles } = useGetAllRolesQuery({ status: roleStatus });
  const { data: departments } = useGetAllDepartmentsQuery({
    status: departmentStatus,
  });
  const { data: groups } = useGetAllGroupsQuery({ status: groupStatus });
  const [archiveUser] = useArchiveUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [resetPassword] = useResetPasswordMutation();
  // end of api

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
      setValue("fullName", selectedUserRow?.fullName);
      setValue("userName", selectedUserRow?.userName);
      setValue(
        "roleId",
        roles?.rolesummary?.find((role) => role.id === selectedUserRow?.roleId)
      );
      setValue(
        "departmentId",
        departments?.deptsummary?.find(
          (dept) => dept.id === selectedUserRow?.departmentId
        )
      );
      setValue(
        "groupsId",
        groups?.gcsummary?.find(
          (group) => group.id === selectedUserRow?.groupsId
        )
      );
    }
  }, [open, selectedUserRow, setValue, roles, departments, groups]);

  console.log(selectedUserRow);

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
                    <TableCell>
                      <strong>ID</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Full Name</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Username</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Role Name</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Department Name</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Group Name</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Actions</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {data?.usersummary.map((user, index) => {
                    const isMenuOpen = Boolean(
                      anchorEl && openMenuIndex === index
                    );
                    return (
                      <TableRow
                        key={index}
                        onClick={() => dispatch(setSelectedRow(user))}
                      >
                        <TableCell>{user.id}</TableCell>
                        <TableCell>{user.fullName}</TableCell>
                        <TableCell>{user.userName}</TableCell>
                        <TableCell>{user.roleName}</TableCell>
                        <TableCell>{user.departmentName}</TableCell>
                        <TableCell>{user.groupName}</TableCell>
                        <TableCell>
                          {/* <Box sx={{ display: "flex", gap: "10px" }}>
                            <Button
                              variant="contained"
                              size="small"
                              onClick={handleOpen}
                            >
                              <EditIcon />
                              Edit
                            </Button>
                            <Button
                              variant="contained"
                              size="small"
                              color={userStatus ? "error" : "warning"}
                              onClick={() => onConfirmDialogOpen()}
                              // archiveUser({ Id: user.id })
                            >
                              {userStatus ? "Archive" : "Restore"}
                            </Button>
                          </Box> */}

                          <ExpandCircleDownIcon
                            onClick={(event) => handleClick(event, index)}
                          />
                          <Menu
                            keepMounted
                            open={isMenuOpen}
                            onClose={onMenuClose}
                            anchorEl={anchorEl}
                          >
                            <MenuItem onClick={handleOpen}>
                              <EditIcon />
                              Edit
                            </MenuItem>
                            <Divider />
                            <MenuItem onClick={() => onConfirmDialogOpen()}>
                              {userStatus ? (
                                <>
                                  <ArchiveIcon /> Archive
                                </>
                              ) : (
                                <>
                                  <UnarchiveIcon />
                                  Restore
                                </>
                              )}
                            </MenuItem>
                            <Divider />
                            <MenuItem
                              onClick={() => onResetPasswordDialogOpen()}
                            >
                              <KeyIcon />
                              Reset Password
                            </MenuItem>
                          </Menu>
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
            Edit User Form
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="fullName"
              control={control}
              defaultValue={usersEditYup.defaultValues}
              render={({ field }) =>
                !errors.fullName ? (
                  <TextField {...field} label="Full Name" variant="filled" />
                ) : (
                  <TextField
                    {...field}
                    error
                    label="Full Name"
                    variant="filled"
                    helperText={errors.fullName.message}
                  />
                )
              }
            />

            <Controller
              name="userName"
              control={control}
              defaultValue={usersEditYup.defaultValues}
              render={({ field }) =>
                !errors.userName ? (
                  <TextField {...field} label="User Name" variant="filled" />
                ) : (
                  <TextField
                    {...field}
                    error
                    label="User Name"
                    variant="filled"
                    helperText={errors.userName.message}
                  />
                )
              }
            />

            {/* {!errors.roleName ? (
              <Controller
                name="roleName"
                control={control}
                defaultValue={userE.defaultValues}
                render={({ field }) => (
                  <TextField {...field} label="Role Name" variant="filled" />
                )}
              />
            ) : (
              <Controller
                name="roleName"
                control={control}
                defaultValue={userE.defaultValues}
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
            )} */}

            <Controller
              control={control}
              name="roleId"
              defaultValue={usersEditYup.defaultValues}
              render={({ field }) => {
                return (
                  <Autocomplete
                    {...field}
                    disablePortal
                    options={roles?.rolesummary}
                    // value={options.id}
                    getOptionLabel={(option) => option.roleName}
                    renderInput={(params) =>
                      !errors.roleId ? (
                        <TextField
                          {...params}
                          label="Roles"
                          helperText="Please select a role."
                        />
                      ) : (
                        <TextField
                          {...params}
                          error
                          label="Roles"
                          helperText={errors.roleId.message}
                        />
                      )
                    }
                    onChange={(e, value) => field.onChange(value)}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id && option.name === value.name
                    }
                  />
                );
              }}
            />

            <Controller
              control={control}
              name="departmentId"
              defaultValue={usersEditYup.defaultValues}
              render={({ field }) => {
                return (
                  <Autocomplete
                    {...field}
                    disablePortal
                    options={departments?.deptsummary}
                    // value={options.id}
                    getOptionLabel={(option) => option.departmentName}
                    renderInput={(params) =>
                      !errors.departmentId ? (
                        <TextField
                          {...params}
                          label="Departments"
                          helperText="Please select department."
                        />
                      ) : (
                        <TextField
                          {...params}
                          error
                          label="Departments"
                          helperText={errors.departmentId.message}
                        />
                      )
                    }
                    onChange={(e, value) => field.onChange(value)}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id && option.name === value.name
                    }
                  />
                );
              }}
            />

            <Controller
              control={control}
              name="groupsId"
              defaultValue={usersEditYup.defaultValues}
              render={({ field }) => {
                return (
                  <Autocomplete
                    {...field}
                    disablePortal
                    options={groups?.gcsummary}
                    // value={options.id}
                    getOptionLabel={(option) => option.groupName}
                    renderInput={(params) =>
                      !errors.groupsId ? (
                        <TextField
                          {...params}
                          label="Groups"
                          helperText="Please select group."
                        />
                      ) : (
                        <TextField
                          {...params}
                          error
                          label="Groups"
                          helperText={errors.groupsId.message}
                        />
                      )
                    }
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
                Update
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

      <Dialog open={isConfirmDialogOpen} onClose={onConfirmDialogClose}>
        <DialogTitle>
          {userStatus ? "Archive User" : "Restore User"}
        </DialogTitle>
        <DialogContent>
          {userStatus ? (
            <DialogContentText>
              Are you sure you want to archive{" "}
              {selectedUserRow ? selectedUserRow.fullName : null}?
            </DialogContentText>
          ) : (
            <DialogContentText>
              Are you sure you want to restore{" "}
              {selectedUserRow ? selectedUserRow.fullName : null}?
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={onConfirm}
            variant="contained"
            autoFocus
            color={userStatus ? "warning" : "primary"}
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

      <Dialog
        open={isResetPasswordDialogOpen}
        onClose={onResetPasswordDialogClose}
      >
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You cannot undo this process. Are you sure you want to reset the
            password of {selectedUserRow ? selectedUserRow.fullName : null}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={onConfirmResetPassword}
            variant="contained"
            autoFocus
            color={"error"}
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
            onClick={onResetPasswordDialogClose}
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
}
