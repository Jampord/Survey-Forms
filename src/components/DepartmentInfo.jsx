import { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
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
  useArchiveDepartmentMutation,
  useGetAllDepartmentsQuery,
  useUpdateDepartmentMutation,
} from "../redux/api/departmentAPI";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedRow } from "../redux/reducers/selectedRowSlice";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { departmentsYup } from "../schema/Schema";
import useDisclosure from "../hooks/useDisclosure";
import {
  setSnackbarMessage,
  setSnackbarSeverity,
} from "../redux/reducers/snackbarSlice";
import { useGetAllDummyUsersQuery } from "../redux/api/dummyDepartmentAPI";
import ExpandCircleDownIcon from "@mui/icons-material/ExpandCircleDown";
import EditIcon from "@mui/icons-material/Edit";
import ArchiveIcon from "@mui/icons-material/Archive";
import UnarchiveIcon from "@mui/icons-material/Unarchive";

export const DepartmentInfo = () => {
  const [open, setOpen] = useState(false);
  const departmentSearch = useSelector((state) => state.department.search);
  const departmentStatus = useSelector((state) => state.department.status);
  const selectedDepartmentRow = useSelector(
    (state) => state.selectedRow.selectedRow
  );
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

  // dept api
  const { data, isFetching } = useGetAllDepartmentsQuery({
    PageNumber: page + 1,
    PageSize: rowsPerPage,
    search: departmentSearch,
    status: departmentStatus,
  });
  const [archiveDepartment] = useArchiveDepartmentMutation();
  const [updateDepartment] = useUpdateDepartmentMutation();
  const { data: dummyUsers } = useGetAllDummyUsersQuery();
  console.log(dummyUsers);
  //end of dept api

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
    control,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(departmentsYup.schema),
    mode: "onChange",
    defaultValues: departmentsYup.defaultValues,
  });

  const onSubmit = async (data) => {
    const transformData = {
      ...data,
      departmentNo: data.departmentNo,
    };
    try {
      await updateDepartment({
        Id: selectedDepartmentRow?.id,
        body: transformData,
      }).unwrap();
      reset();
      handleClose();
      dispatch(setSnackbarSeverity("success"));
      dispatch(setSnackbarMessage("Department Updated Successfully!"));
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
      await archiveDepartment({ Id: selectedDepartmentRow?.id }).unwrap();
      dispatch(setSnackbarSeverity("success"));
      dispatch(
        setSnackbarMessage(
          departmentStatus
            ? "Department Archived Successfully!"
            : "Department Restored Successfully!"
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
      setValue("departmentName", selectedDepartmentRow?.departmentName);
      setValue("departmentNo", selectedDepartmentRow?.departmentNo);
    }
  }, [open, selectedDepartmentRow, setValue]);

  return (
    <>
      {isFetching ? (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer>
            <Table style={{ width: "100%" }}>
              <TableHead>
                <TableRow align="center">
                  <TableCell>
                    <strong>ID</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Department Name</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Department No</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Actions</strong>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {data?.deptsummary.map((department, index) => {
                  const isMenuOpen = Boolean(
                    anchorEl && openMenuIndex === index
                  );
                  return (
                    <TableRow
                      key={department.id}
                      onClick={() => dispatch(setSelectedRow(department))}
                    >
                      <TableCell>{department.id}</TableCell>
                      <TableCell>{department.departmentName}</TableCell>
                      <TableCell>{department.departmentNo}</TableCell>
                      <TableCell>
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
                            {departmentStatus ? (
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
            Edit Department Form
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
                    type="number"
                    label="Department No"
                    variant="filled"
                    fullWidth
                  />
                ) : (
                  <TextField
                    {...field}
                    type="number"
                    error
                    label="Department No"
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
          {departmentStatus ? "Archive Department" : "Restore Department"}
        </DialogTitle>
        <DialogContent>
          {departmentStatus ? (
            <DialogContentText>
              Are you sure you want to archive{" "}
              {selectedDepartmentRow
                ? selectedDepartmentRow.departmentName
                : null}
              ?
            </DialogContentText>
          ) : (
            <DialogContentText>
              Are you sure you want to restore{" "}
              {selectedDepartmentRow
                ? selectedDepartmentRow.departmentName
                : null}
              ?
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={onConfirm}
            variant="contained"
            autoFocus
            color={departmentStatus ? "warning" : "primary"}
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
