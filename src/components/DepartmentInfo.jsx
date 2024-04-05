import { useState } from "react";
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
  useArchiveDepartmentMutation,
  useGetAllDepartmentsQuery,
  useUpdateDepartmentMutation,
} from "../redux/api/departmentAPI";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedRow } from "../redux/reducers/selectedRowSlice";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { departmentsYup } from "../schema/Schema";

export const DepartmentInfo = () => {
  const [open, setOpen] = useState(false);
  const departmentSearch = useSelector((state) => state.department.search);
  const departmentStatus = useSelector((state) => state.department.status);
  const selectedDepartmentRow = useSelector(
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

  // dept api
  const { data, isFetching } = useGetAllDepartmentsQuery({
    search: departmentSearch,
    status: departmentStatus,
  });
  const [archiveDepartment] = useArchiveDepartmentMutation();
  const [updateDepartment] = useUpdateDepartmentMutation();
  //end of dept api

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(departmentsYup.schema),
    mode: "onChange",
    defaultValues: departmentsYup.defaultValues,
  });

  const onSubmit = async (data) => {
    try {
      await updateDepartment({
        Id: selectedDepartmentRow?.id,
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
                    <strong>Actions</strong>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {data?.deptsummary.map((department) => {
                  return (
                    <TableRow
                      key={department.id}
                      onClick={() => dispatch(setSelectedRow(department))}
                    >
                      <TableCell>{department.id}</TableCell>
                      <TableCell>{department.departmentName}</TableCell>
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
                            color={departmentStatus ? "error" : "warning"}
                            onClick={() =>
                              archiveDepartment({ Id: department.id })
                            }
                          >
                            {departmentStatus ? "Archive" : "Restore"}
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
            Edit Department Form
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            {!errors.departmentName ? (
              <Controller
                name="departmentName"
                control={control}
                defaultValue={departmentsYup.defaultValues}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Department Name"
                    variant="filled"
                  />
                )}
              />
            ) : (
              <Controller
                name="departmentName"
                control={control}
                defaultValue={departmentsYup.defaultValues}
                render={({ field }) => (
                  <TextField
                    {...field}
                    error
                    label="Department Name"
                    variant="filled"
                    helperText={errors.departmentName.message}
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
