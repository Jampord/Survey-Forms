import React, { useEffect, useState } from "react";
import {
  useArchiveGroupMutation,
  useGetAllGroupsQuery,
  useUpdateGroupMutation,
} from "../redux/api/groupAPI";
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
import { setSelectedRow } from "../redux/reducers/selectedRowSlice";
import { Controller, useForm } from "react-hook-form";
import { groupsYup } from "../schema/Schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useGetAllBranchesQuery } from "../redux/api/branchAPI";
import { useDispatch, useSelector } from "react-redux";
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

const GroupInfo = () => {
  const [open, setOpen] = useState(false);
  const groupSearch = useSelector((state) => state.group.search);
  const groupStatus = useSelector((state) => state.group.status);
  const selectedGroupRow = useSelector(
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

  //api
  const { data, isFetching } = useGetAllGroupsQuery({
    PageNumber: page + 1,
    PageSize: rowsPerPage,
    status: groupStatus,
    search: groupSearch,
  });
  const [archiveGroup] = useArchiveGroupMutation();
  const [updateGroup] = useUpdateGroupMutation();
  const branchStatus = useSelector((state) => state.branch.status);
  const { data: branches } = useGetAllBranchesQuery({ status: branchStatus });
  // end of api
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
    resolver: yupResolver(groupsYup.schema),
    mode: "onChange",
    defaultValues: groupsYup.defaultValues,
  });

  const onSubmit = async (data) => {
    const transformData = {
      ...data,
      branchId: data.branchId.id,
    };
    try {
      await updateGroup({
        Id: selectedGroupRow?.id,
        body: transformData,
      }).unwrap();
      reset();
      handleClose();
      dispatch(setSnackbarSeverity("success"));
      dispatch(setSnackbarMessage("Group Updated Successfully!"));
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
      await archiveGroup({ Id: selectedGroupRow?.id });
      onConfirmDialogClose();
      dispatch(setSnackbarSeverity("success"));
      dispatch(
        setSnackbarMessage(
          groupStatus
            ? "Group Archived Successfully!"
            : "Group Restored Successfully!"
        )
      );
      onSnackbarOpen();
      onMenuClose();
    } catch (err) {
      console.log(err);
      dispatch(setSnackbarSeverity("success"));
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

  console.log(selectedGroupRow);

  useEffect(() => {
    if (open) {
      setValue("groupName", selectedGroupRow?.groupName);
      setValue(
        "branchId",
        branches?.branchsummary?.find(
          (branch) => branch.id === selectedGroupRow?.branchId
        )
      );
    }
  }, [open, selectedGroupRow, setValue, branches]);
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
                    <strong>Group Name</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Branch Name</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Actions</strong>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {data?.gcsummary.map((group, index) => {
                  const isMenuOpen = Boolean(
                    anchorEl && openMenuIndex === index
                  );
                  return (
                    <TableRow
                      key={group.id}
                      onClick={() => dispatch(setSelectedRow(group))}
                    >
                      <TableCell>{group.id}</TableCell>
                      <TableCell>{group.groupName}</TableCell>
                      <TableCell>{group.branchName}</TableCell>
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
                            {groupStatus ? (
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
            Edit Group Form
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
                    fullWidth
                    disablePortal
                    options={branches?.branchsummary}
                    // value={options.id}
                    getOptionLabel={(option) => option.branchName}
                    renderInput={(params) =>
                      !errors.branchId ? (
                        <TextField
                          {...params}
                          label="Branches"
                          helperText="Please select a branch."
                        />
                      ) : (
                        <TextField
                          {...params}
                          error
                          label="Branches"
                          helperText={errors.branchId.message}
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
          {groupStatus ? "Archive Group" : "Restore Group"}
        </DialogTitle>
        <DialogContent>
          {groupStatus ? (
            <DialogContentText>
              Are you sure you want to archive{" "}
              {selectedGroupRow ? selectedGroupRow.groupName : null}?
            </DialogContentText>
          ) : (
            <DialogContentText>
              Are you sure you want to restore{" "}
              {selectedGroupRow ? selectedGroupRow.groupName : null}?
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={onConfirm}
            variant="contained"
            autoFocus
            color={groupStatus ? "warning" : "primary"}
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

export default GroupInfo;
