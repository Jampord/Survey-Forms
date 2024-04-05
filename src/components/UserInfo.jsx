import "./UserInfo.scss";
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
} from "@mui/material";

import {
  useArchiveUserMutation,
  useGetAllUsersQuery,
  useUpdateUserMutation,
} from "../redux/api/userAPI";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { usersYup } from "../schema/Schema";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedRow } from "../redux/reducers/selectedRowSlice";

export default function UserInfo() {
  const [open, setOpen] = useState(false);
  const userSearch = useSelector((state) => state.user.search);
  const userStatus = useSelector((state) => state.user.status);
  const selectedUserRow = useSelector((state) => state.selectedRow.selectedRow);
  const dispatch = useDispatch();

  console.log(selectedUserRow);
  //Table Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handlePageChange = (e, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPage = (e) => {
    setRowsPerPage(+e.target.value);
    setPage(0);
  };

  //end of table pagination

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
    resolver: yupResolver(usersYup.schema),
    mode: "onChange",
    defaultValues: usersYup.defaultValues,
  });

  const onSubmit = async (data) => {
    try {
      await updateUser({ Id: selectedUserRow?.id, body: data }).unwrap();
      reset();
      handleClose();
    } catch (err) {
      console.log(err);
    }
  };

  // api
  const { data, isFetching } = useGetAllUsersQuery({
    pageNumber: page + 1,
    pageSize: rowsPerPage,
    search: userSearch,
    status: userStatus,
  });
  console.log(data);
  const [archiveUser] = useArchiveUserMutation();
  const [updateUser] = useUpdateUserMutation();
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
    }
  }, [open, selectedUserRow, setValue]);

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
                      <strong>User Name</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Department Name</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Role Name</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Actions</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {data?.usersummary.map((user, index) => {
                    return (
                      <TableRow
                        key={index}
                        onClick={() => dispatch(setSelectedRow(user))}
                      >
                        <TableCell>{user.id}</TableCell>
                        <TableCell>{user.fullName}</TableCell>
                        <TableCell>{user.userName}</TableCell>
                        <TableCell>{user.departmentName}</TableCell>
                        <TableCell>{user.roleName}</TableCell>
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
                              color={userStatus ? "error" : "warning"}
                              onClick={() => archiveUser({ Id: user.id })}
                            >
                              {userStatus ? "Archive" : "Restore"}
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
      </Box>

      <Modal open={open}>
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Edit User Form
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            {!errors.fullName ? (
              <Controller
                name="fullName"
                control={control}
                defaultValue={usersYup.defaultValues}
                render={({ field }) => (
                  <TextField {...field} label="Full Name" variant="filled" />
                )}
              />
            ) : (
              <Controller
                name="fullName"
                control={control}
                defaultValue={usersYup.defaultValues}
                render={({ field }) => (
                  <TextField
                    {...field}
                    error
                    label="Full Name"
                    variant="filled"
                    helperText={errors.fullName.message}
                  />
                )}
              />
            )}
            {!errors.userName ? (
              <Controller
                name="userName"
                control={control}
                defaultValue={usersYup.defaultValues}
                render={({ field }) => (
                  <TextField {...field} label="User Name" variant="filled" />
                )}
              />
            ) : (
              <Controller
                name="userName"
                control={control}
                defaultValue={usersYup.defaultValues}
                render={({ field }) => (
                  <TextField
                    {...field}
                    error
                    label="User Name"
                    variant="filled"
                    helperText={errors.userName.message}
                  />
                )}
              />
            )}
            {!errors.roleName ? (
              <Controller
                name="roleName"
                control={control}
                defaultValue={usersYup.defaultValues}
                render={({ field }) => (
                  <TextField {...field} label="Role Name" variant="filled" />
                )}
              />
            ) : (
              <Controller
                name="roleName"
                control={control}
                defaultValue={usersYup.defaultValues}
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
    </>
  );
}
