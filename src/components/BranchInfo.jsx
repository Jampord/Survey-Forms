import React, { useEffect, useState } from "react";
import {
  useArchiveBranchMutation,
  useGetAllBranchesQuery,
  useUpdateBranchMutation,
} from "../redux/api/branchAPI";
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
import { useDispatch, useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { branchesYup } from "../schema/Schema";
import { setSelectedRow } from "../redux/reducers/selectedRowSlice";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import useDisclosure from "../hooks/useDisclosure";
import {
  setSnackbarMessage,
  setSnackbarSeverity,
} from "../redux/reducers/snackbarSlice";
import ExpandCircleDownIcon from "@mui/icons-material/ExpandCircleDown";
import EditIcon from "@mui/icons-material/Edit";
import ArchiveIcon from "@mui/icons-material/Archive";
import UnarchiveIcon from "@mui/icons-material/Unarchive";

const BranchInfo = () => {
  const branchSearch = useSelector((state) => state.branch.search);
  const branchStatus = useSelector((state) => state.branch.status);
  const selectedBranchRow = useSelector(
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

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handlePageChange = (e, newPage) => {
    setPage(newPage);
  };
  const handleRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const onSubmit = async (data) => {
    try {
      await updateBranch({
        Id: selectedBranchRow?.id,
        body: data,
      }).unwrap();
      reset();
      handleClose();
      dispatch(setSnackbarSeverity("success"));
      dispatch(setSnackbarMessage("Branch Updated Successfully!"));
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
      await archiveBranch({ Id: selectedBranchRow?.id }).unwrap();
      onConfirmDialogClose();
      dispatch(setSnackbarSeverity("success"));
      dispatch(
        setSnackbarMessage(
          branchStatus
            ? "Branch Archived Successfully!"
            : "Branch Restored Successfully!"
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

  const { data, isFetching } = useGetAllBranchesQuery({
    pageNumber: page + 1,
    pageSize: rowsPerPage,
    status: branchStatus,
    search: branchSearch,
  });
  const [archiveBranch] = useArchiveBranchMutation();
  const [updateBranch] = useUpdateBranchMutation();

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
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(branchesYup.schema),
    mode: "onChange",
    defaultValues: branchesYup.defaultValues,
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

  useEffect(() => {
    if (open) {
      setValue("branchName", selectedBranchRow?.branchName);
      setValue("branchCode", selectedBranchRow?.branchCode);
    }
  }, [open, selectedBranchRow, setValue]);

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
                    <strong>Branch Name</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Branch Code</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Actions</strong>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {data?.branchsummary.map((branch, index) => {
                  const isMenuOpen = Boolean(
                    anchorEl && openMenuIndex === index
                  );
                  return (
                    <TableRow
                      key={branch.id}
                      onClick={() => dispatch(setSelectedRow(branch))}
                    >
                      <TableCell>{branch.id}</TableCell>
                      <TableCell>{branch.branchName}</TableCell>
                      <TableCell>{branch.branchCode}</TableCell>
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
                            {branchStatus ? (
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
            Edit Branch Form
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="branchName"
              control={control}
              defaultValue={branchesYup.defaultValues}
              render={({ field }) =>
                !errors.branchName ? (
                  <TextField
                    {...field}
                    label="Branch Name"
                    variant="filled"
                    fullWidth
                  />
                ) : (
                  <TextField
                    {...field}
                    error
                    label="Branch Name"
                    variant="filled"
                    helperText={errors.branchName.message}
                    fullWidth
                  />
                )
              }
            />

            <Controller
              name="branchCode"
              control={control}
              defaultValue={branchesYup.defaultValues}
              render={({ field }) =>
                !errors.branchCode ? (
                  <TextField
                    {...field}
                    label="Branch Code"
                    variant="filled"
                    fullWidth
                  />
                ) : (
                  <TextField
                    {...field}
                    error
                    label="Branch Code"
                    variant="filled"
                    helperText={errors.branchCode.message}
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
          {branchStatus ? "Archive Branch" : "Restore Branch"}
        </DialogTitle>
        <DialogContent>
          {branchStatus ? (
            <DialogContentText>
              Are you sure you want to archive{" "}
              {selectedBranchRow ? selectedBranchRow.branchName : null}?
            </DialogContentText>
          ) : (
            <DialogContentText>
              Are you sure you want to restore{" "}
              {selectedBranchRow ? selectedBranchRow.branchName : null}?
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={onConfirm}
            variant="contained"
            autoFocus
            color={branchStatus ? "warning" : "primary"}
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
export default BranchInfo;
