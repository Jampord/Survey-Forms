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
} from "@mui/material";
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
    } catch (err) {
      console.log(err);
      dispatch(setSnackbarSeverity("error"));
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
                {data?.gcsummary.map((group) => {
                  return (
                    <TableRow
                      key={group.id}
                      onClick={() => dispatch(setSelectedRow(group))}
                    >
                      <TableCell>{group.id}</TableCell>
                      <TableCell>{group.groupName}</TableCell>
                      <TableCell>{group.branchName}</TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", gap: "10px" }}>
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
                            color={groupStatus ? "error" : "warning"}
                            onClick={() => archiveGroup({ Id: group.id })}
                          >
                            {groupStatus ? "Archive" : "Restore"}
                          </Button>
                        </Box>
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
                  <TextField {...field} label="Group Name" variant="filled" />
                ) : (
                  <TextField
                    {...field}
                    error
                    label="Group Name"
                    variant="filled"
                    helperText={errors.groupName.message}
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
    </>
  );
};

export default GroupInfo;
