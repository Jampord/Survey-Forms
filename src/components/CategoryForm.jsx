import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useAddCategoryMutation } from "../redux/api/categoryAPI";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { categoriesYup } from "../schema/Schema";

const CategoryForm = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  //api
  const [addCategory] = useAddCategoryMutation();
  //end of api

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(categoriesYup.schema),
    mode: "onChange",
    defaultValues: categoriesYup.defaultValues,
  });

  const onSubmit = async (data) => {
    try {
      await addCategory(data).unwrap();
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
            Add Category Form
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            {!errors.categoryName ? (
              <Controller
                name="categoryName"
                control={control}
                defaultValue={categoriesYup.defaultValues}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Category Name"
                    variant="filled"
                  />
                )}
              />
            ) : (
              <Controller
                name="categoryName"
                control={control}
                defaultValue={categoriesYup.defaultValues}
                render={({ field }) => (
                  <TextField
                    {...field}
                    error
                    label="Category Name"
                    variant="filled"
                    helperText={errors.categoryName.message}
                  />
                )}
              />
            )}

            {!errors.categoryPercentage ? (
              <Controller
                name="categoryPercentage"
                control={control}
                defaultValue={categoriesYup.defaultValues}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Category Percentage"
                    variant="filled"
                  />
                )}
              />
            ) : (
              <Controller
                name="categoryPercentage"
                control={control}
                defaultValue={categoriesYup.defaultValues}
                render={({ field }) => (
                  <TextField
                    {...field}
                    error
                    label="Category Percentage"
                    variant="filled"
                    helperText={errors.categoryPercentage.message}
                  />
                )}
              />
            )}

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
};

export default CategoryForm;
