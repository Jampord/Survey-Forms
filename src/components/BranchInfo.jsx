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
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { branchesYup } from "../schema/Schema";
import { setSelectedRow } from "../redux/reducers/selectedRowSlice";

const BranchInfo = () => {
  const branchSearch = useSelector((state) => state.branch.search);
  const branchStatus = useSelector((state) => state.branch.status);
  const selectedBranchRow = useSelector(
    (state) => state.selectedRow.selectedRow
  );
  const dispatch = useDispatch();

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
    } catch (err) {
      console.log(err);
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
                {data?.branchsummary.map((branch) => {
                  return (
                    <TableRow
                      key={branch.id}
                      onClick={() => dispatch(setSelectedRow(branch))}
                    >
                      <TableCell>{branch.id}</TableCell>
                      <TableCell>{branch.branchName}</TableCell>
                      <TableCell>{branch.branchCode}</TableCell>
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
                            color={branchStatus ? "error" : "warning"}
                            onClick={() => archiveBranch({ Id: branch.id })}
                          >
                            {branchStatus ? "Archive" : "Restore"}
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
            Edit Branch Form
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            {!errors.branchName ? (
              <Controller
                name="branchName"
                control={control}
                defaultValue={branchesYup.defaultValues}
                render={({ field }) => (
                  <TextField {...field} label="Branch Name" variant="filled" />
                )}
              />
            ) : (
              <Controller
                name="branchName"
                control={control}
                defaultValue={branchesYup.defaultValues}
                render={({ field }) => (
                  <TextField
                    {...field}
                    error
                    label="Branch Name"
                    variant="filled"
                    helperText={errors.branchName.message}
                  />
                )}
              />
            )}

            {!errors.branchCode ? (
              <Controller
                name="branchCode"
                control={control}
                defaultValue={branchesYup.defaultValues}
                render={({ field }) => (
                  <TextField {...field} label="Branch Code" variant="filled" />
                )}
              />
            ) : (
              <Controller
                name="branchCode"
                control={control}
                defaultValue={branchesYup.defaultValues}
                render={({ field }) => (
                  <TextField
                    {...field}
                    error
                    label="Branch Code"
                    variant="filled"
                    helperText={errors.branchCode.message}
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
export default BranchInfo;
