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
  useGetAllRolesQuery,
  useArchiveRoleMutation,
  useUpdateRoleMutation,
} from "../redux/api/userAPI";
import { useDispatch, useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { rolesYup } from "../schema/Schema";
import { setSelectedRow } from "../redux/reducers/selectedRowSlice";

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
  console.log(data);

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

  const {
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(rolesYup.schema),
    mode: "onChange",
    defaultValues: rolesYup.defaultValues,
  });

  const onSubmit = async (data) => {
    try {
      updateRole({ Id: selectedRoleRow?.id, body: data }).unwrap();
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
      setValue("roleName", selectedRoleRow?.roleName);
    }
  }, [open, selectedRoleRow, setValue]);

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
                    <strong>Actions</strong>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {data?.rolesummary.map((role, index) => {
                  return (
                    <TableRow
                      key={index}
                      onClick={(e) => dispatch(setSelectedRow(role))}
                    >
                      <TableCell>{role.id}</TableCell>
                      <TableCell>{role.roleName}</TableCell>
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
                            color={roleStatus ? "error" : "warning"}
                            onClick={() => archiveRole({ Id: role.id })}
                          >
                            {roleStatus ? "Archive" : "Restore"}
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
            Edit Role Form
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            {!errors.roleName ? (
              <Controller
                name="roleName"
                control={control}
                defaultValue={rolesYup.defaultValues}
                render={({ field }) => (
                  <TextField {...field} label="Role Name" variant="filled" />
                )}
              />
            ) : (
              <Controller
                name="roleName"
                control={control}
                defaultValue={rolesYup.defaultValues}
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
};
