import {
  Autocomplete,
  Box,
  Button,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { usersYup } from "../schema/Schema";
import { useAddUserMutation, useGetAllRolesQuery } from "../redux/api/userAPI";
import { useSelector } from "react-redux";
import { useGetAllDepartmentsQuery } from "../redux/api/departmentAPI";

export default function UserForm() {
  const [open, setOpen] = useState(false);
  const roleStatus = useSelector((state) => state.role.status);
  const departmentStatus = useSelector((state) => state.department.status);

  const {
    handleSubmit,
    reset,
    watch,
    control,

    formState: { errors },
  } = useForm({
    resolver: yupResolver(usersYup.schema),
    mode: "onChange",
    defaultValues: usersYup.defaultValues,
  });
  console.log(watch("roleName"));

  console.log("errors", errors);

  function handleOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  // api
  const [addUser, { isLoading }] = useAddUserMutation();
  const { data: roles } = useGetAllRolesQuery({ status: roleStatus });
  const { data: departments } = useGetAllDepartmentsQuery({
    status: departmentStatus,
  });

  //end of api

  // const options = {
  //   options: roles?.rolesummary.map((option) => ({
  //     id: option.id,
  //     name: option.roleName,
  //   })),

  //   getOptionLabel: (options) => options.name,
  // };
  // console.log(options, "options");

  const getData = (data) => {
    console.log(data.id);
    console.log(data.name);
  };

  const onSubmit = async (data) => {
    const transformData = {
      ...data,
      roleId: data.roleId.id,
      departmentId: data.departmentId.id,
    };
    try {
      // await API.post("User/AddUser", data);
      // dispatch(setUser(data));

      //use unwrap to catch error on RTK
      await addUser(transformData).unwrap();
      reset();
      handleClose();
    } catch (err) {
      console.log(err);
    }
  };

  // console.log(watch(), "watch");

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
    <div>
      <Button
        id="addButton"
        variant="contained"
        onClick={handleOpen}
        sx={{ height: "25px", marginBottom: "5px" }}
      >
        Add
      </Button>
      <Modal open={open}>
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add User Form
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            {!errors.fullName ? (
              <Controller
                name="fullName"
                control={control}
                defaultValue={usersYup.defaultValues}
                render={({ field }) => (
                  <TextField {...field} label="Full Name" variant="standard" />
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
                    variant="standard"
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
                  <TextField {...field} label="User Name" variant="standard" />
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
                    variant="standard"
                    helperText={errors.userName.message}
                  />
                )}
              />
            )}

            {!errors.password ? (
              <Controller
                name="password"
                control={control}
                defaultValue={usersYup.defaultValues}
                render={({ field }) => (
                  <TextField {...field} label="Password" variant="standard" />
                )}
              />
            ) : (
              <Controller
                name="password"
                control={control}
                defaultValue={usersYup.defaultValues}
                render={({ field }) => (
                  <TextField
                    {...field}
                    error
                    label="Password"
                    variant="standard"
                    helperText={errors.password.message}
                  />
                )}
              />
            )}

            <Controller
              control={control}
              name="roleId"
              defaultValue={usersYup.defaultValues}
              render={({ field }) => {
                return (
                  <Autocomplete
                    {...field}
                    disablePortal
                    options={roles?.rolesummary.map((option) => ({
                      id: option.id,
                      name: option.roleName,
                    }))}
                    // value={options.id}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Roles"
                        helperText="Please select a role."
                      />
                    )}
                    onChange={(e, value) => field.onChange(value)}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id && option.name === value.name
                    }
                  />
                );
              }}
            />

            <Controller
              control={control}
              name="departmentId"
              defaultValue={usersYup.defaultValues}
              render={({ field }) => {
                return (
                  <Autocomplete
                    {...field}
                    disablePortal
                    options={departments?.deptsummary.map((option) => ({
                      id: option.id,
                      name: option.departmentName,
                    }))}
                    // value={options.id}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Departments"
                        helperText="Please select a department."
                      />
                    )}
                    onChange={(e, value) => field.onChange(value)}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id && option.name === value.name
                    }
                  />
                );
              }}
            />

            {/* <FormControl variant="standard" sx={{ minWidth: 183 }}>
              <InputLabel>Role</InputLabel>
              <Select
              {...register("roleName")}
              name="roleId"
              value={role}
              label="Role"
              >
              {roles?.rolesummary.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                {option.roleName}
                </MenuItem>
                ))}
                </Select>
              </FormControl> */}

            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Button
                type="submit"
                variant="contained"
                // disabled={!isValid}
                sx={{
                  display: "inline-flex",
                  width: 80,
                  marginRight: 2,
                  fontSize: 12,
                }}
              >
                Submit
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
    </div>
  );
}

// function handleInput(e) {
//   setPost({ ...post, [e.target.name]: e.target.value });
// }

// function handleSubmit(e) {
//   e.preventDefault();
//   API.post("User/AddUser", {
//     fullName: post.fullName,
//     userName: post.userName,
//     roleName: post.roleName,
//   })
//     .then((res) => console.log(res))
//     .catch((err) => console.log(err));
// }

// const [post, setPost] = useState({
//   fullName: "",
//   userName: "",
//   roleName: "",
// });
