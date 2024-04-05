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
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedRow } from "../redux/reducers/selectedRowSlice";
import { Controller, useForm } from "react-hook-form";
import { groupsYup } from "../schema/Schema";
import { yupResolver } from "@hookform/resolvers/yup";

const GroupInfo = () => {
  const [open, setOpen] = useState(false);
  const groupSearch = useSelector((state) => state.group.search);
  const groupStatus = useSelector((state) => state.group.status);
  const selectedGroupRow = useSelector(
    (state) => state.selectedRow.selectedRow
  );
  const dispatch = useDispatch();

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
    status: groupStatus,
    search: groupSearch,
  });
  const [archiveGroup] = useArchiveGroupMutation();
  const [updateGroup] = useUpdateGroupMutation();
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
    try {
      await updateGroup({
        Id: selectedGroupRow?.id,
        body: data,
      }).unwrap();
      reset();
      handleClose();
    } catch (err) {
      console.log(err);
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

  useEffect(() => {
    if (open) {
      setValue("groupName", selectedGroupRow?.groupName);
    }
  }, [open, selectedGroupRow, setValue]);
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
};

export default GroupInfo;
