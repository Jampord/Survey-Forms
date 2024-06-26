import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
  Menu,
  MenuItem,
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
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import {
  useGetAllRolesQuery,
  useArchiveRoleMutation,
  useUpdateRoleMutation,
} from "../redux/api/userAPI";
import { useDispatch, useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { rolesYup } from "../schema/Schema";
import { setSelectedRow } from "../redux/reducers/selectedRowSlice";
import useDisclosure from "../hooks/useDisclosure";
import {
  setSnackbar,
} from "../redux/reducers/snackbarSlice";
import { navigationData } from "../routes/NavigationData";
import ExpandCircleDownIcon from "@mui/icons-material/ExpandCircleDown";
import EditIcon from "@mui/icons-material/Edit";
import ArchiveIcon from "@mui/icons-material/Archive";
import UnarchiveIcon from "@mui/icons-material/Unarchive";

export const RoleInfo = () => {
  // const [roleInfo, setRoleInfo] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const roleSearch = useSelector((state) => state.role.search);
  const roleStatus = useSelector((state) => state.role.status);
  const selectedRoleRow = useSelector((state) => state.selectedRow.selectedRow);
  const [archiveRole] = useArchiveRoleMutation();
  const [updateRole] = useUpdateRoleMutation();
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

  //Table Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handlePageChange = (e, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  //end of table pagination

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // api
  const { data, isFetching } = useGetAllRolesQuery({
    PageNumber: page + 1,
    PageSize: rowsPerPage,
    status: roleStatus,
    search: roleSearch,
  });

  // console.log(data);

  // useEffect(() => {
  //   const getAllRoles = async () => {
  //     setIsLoading(true);

  //     try {
  //       const res = await API.get("Role/CustomerListPagnation");
  //       setRoleInfo(res.data.posummary);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //     setIsLoading(false);
  //   };
  //   getAllRoles();
  // }, []);

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

  const {
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(rolesYup.schema),
    mode: "onChange",
    defaultValues: rolesYup.defaultValues,
  });

  const onSubmit = async (data) => {
    const permissionArray = [];

    data.permission.forEach((item, index) => {
      if (item === true) permissionArray.push(navigationData[index].name);
    });

    const transformData = {
      ...data,
      permission: permissionArray,
    };
    try {
      updateRole({ Id: selectedRoleRow?.id, body: transformData }).unwrap();
      reset();
      handleClose();
      dispatch(setSnackbar({ message: "Role Updated Successfully!" }));
      onSnackbarOpen();
      onMenuClose();
    } catch (err) {
      console.log(err);
      dispatch(setSnackbar({ message: err.data, severity: "error" }));
      onSnackbarOpen();
    }
  };

  const onConfirm = async () => {
    try {
      await archiveRole({ Id: selectedRoleRow?.id }).unwrap();
      dispatch(
        setSnackbar({message: 
          roleStatus
            ? "Role Archived Successfully!"
            : "Role Restored Successfully!"}
        )
      );
      onSnackbarOpen();
      onMenuClose();
    } catch (err) {
      console.log(err, "error");
      dispatch(setSnackbar({ message: err.data, severity: "error" }));
      onSnackbarOpen();
    }
    onConfirmDialogClose();
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

  useEffect(() => {
    if (open) {
      const permissionData = navigationData.map((item) => {
        if (selectedRoleRow?.permission?.includes(item.name)) {
          return true;
        } else {
          return false;
        }
      });
      setValue("roleName", selectedRoleRow?.roleName);
      setValue("permission", permissionData);
      console.log(data.permission);
    }
  }, [open, selectedRoleRow, setValue, data]);

  // console.log(navigationData);
  console.log(errors);
  console.log(watch());
  // console.log(selectedRoleRow);

  return (
    <>
      {isFetching ? (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow align="center">
                  <TableCell>
                    <strong>ID</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Role Name</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Permissions</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Actions</strong>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {data?.rolesummary.map((role, index) => {
                  const isMenuOpen = Boolean(
                    anchorEl && openMenuIndex === index
                  );
                  return (
                    <TableRow
                      key={index}
                      onClick={(e) => dispatch(setSelectedRow(role))}
                    >
                      <TableCell>{role.id}</TableCell>
                      <TableCell>{role.roleName}</TableCell>
                      <TableCell>
                        <span>{role.permission + " "}</span>
                      </TableCell>
                      <TableCell>
                        {/* <Box sx={{ display: "flex", gap: "10px" }}>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={handleOpen}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="contained"
                            size="small"
                            color={roleStatus ? "error" : "warning"}
                            onClick={() => onConfirmDialogOpen()}
                          >
                            {roleStatus ? "Archive" : "Restore"}
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
                            {roleStatus ? (
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

      <Modal open={open}>
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Edit Role Form
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

            {/* {navigationData.map((item) => {
              return (
                <Box>
                  <FormControlLabel
                    control={<Checkbox name="permission" key={item.id} />}
                    label={item.name}
                  />
                </Box>
              );
            })} */}

            <h5>Set Permissions:</h5>
            {navigationData.map((item, index) => (
              <Box key={item.id}>
                <Controller
                  control={control}
                  name={`permission[${index}]`} // Use an appropriate name for your form data
                  // Set default value if needed
                  render={({ field }) => (
                    <FormControlLabel
                      {...field}
                      control={<Checkbox checked={field.value} />}
                      label={item.name}
                    />
                  )}
                />
              </Box>
            ))}

            {/* <Controller
              name="permission"
              control={control}
              defaultValue={rolesYup.defaultValues}
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
          {roleStatus ? "Archive Role" : "Restore Role"}
        </DialogTitle>
        <DialogContent>
          {roleStatus ? (
            <DialogContentText>
              Are you sure you want to archive{" "}
              {selectedRoleRow ? selectedRoleRow.roleName : null}?
            </DialogContentText>
          ) : (
            <DialogContentText>
              Are you sure you want to restore{" "}
              {selectedRoleRow ? selectedRoleRow.roleName : null}?
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={onConfirm}
            variant="contained"
            autoFocus
            color={roleStatus ? "warning" : "primary"}
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
    </>
  );
};
