import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  Autocomplete,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { useGetAllGroupsQuery } from "../redux/api/groupAPI";
import { useDispatch, useSelector } from "react-redux";
import { groupSurveyYup } from "../schema/Schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useGetAllCategoriesQuery } from "../redux/api/categoryAPI";
import { useAddGroupSurveyMutation } from "../redux/api/groupSurveyAPI";
import useDisclosure from "../hooks/useDisclosure";
import { setSnackbar } from "../redux/reducers/snackbarSlice";

const steps = ["Select a group", "Grade selected group", "Confirm"];

export default function GradingForm({ onClose }) {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const groupStatus = useSelector((state) => state.group.status);
  const { data: groups } = useGetAllGroupsQuery({ status: groupStatus });
  const { data: categories } = useGetAllCategoriesQuery();
  const [addGroupSurvey] = useAddGroupSurveyMutation();

  const {
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(groupSurveyYup.schema),
    mode: "onChange",
    defaultValues: groupSurveyYup.defaultValues,
  });

  const onSubmit = async (data) => {
    const transformData = {
      ...data,
      groupsId: data.groupsId.id,
    };
    try {
      await addGroupSurvey(transformData).unwrap();

      dispatch(setSnackbar({ message: "Group Survey Added Successfully!" }));
      onSnackbarOpen();
      onClose();
      reset();
    } catch (err) {
      console.log(err);
      reset();
      dispatch(setSnackbar({ message: err.data, severity: "error" }));
      onSnackbarOpen();
      onClose();
    }
  };

  const dispatch = useDispatch();
  const snackbarMessage = useSelector((state) => state.snackbar.message);
  const snackbarSeverity = useSelector((state) => state.snackbar.severity);
  const {
    isOpen: isSnackbarOpen,
    onOpen: onSnackbarOpen,
    onClose: onSnackbarClose,
  } = useDisclosure();

  console.log(errors);
  console.log(watch());

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Typography
          id="modal-modal-title"
          variant="h4"
          sx={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 5,
          }}
        >
          Grading Form
        </Typography>
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => {
            const stepProps = {};
            const labelProps = {};

            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>

        {activeStep === 3 ? (
          <>
            <Typography sx={{ mt: 2, mb: 1 }}>
              All steps completed - you&apos;re finished
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button onClick={handleReset}>Reset</Button>
            </Box>
          </>
        ) : (
          <>
            <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>

            <form onSubmit={handleSubmit(onSubmit)}>
              {activeStep === 0 && (
                <Controller
                  control={control}
                  name="groupsId"
                  defaultValue={groupSurveyYup.defaultValues}
                  render={({ field }) => {
                    return (
                      <Autocomplete
                        {...field}
                        disablePortal
                        options={groups?.gcsummary}
                        // value={options.id}
                        getOptionLabel={(option) => option.groupName}
                        renderInput={(params) =>
                          !errors.groupsId ? (
                            <TextField
                              {...params}
                              label="Groups"
                              helperText="Please select group."
                            />
                          ) : (
                            <TextField
                              {...params}
                              error
                              label="Groups"
                              helperText={errors.groupsId.message}
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
              )}

              {activeStep === 1 && (
                <>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow align="center">
                          <TableCell>
                            <strong>Category</strong>
                          </TableCell>
                          <TableCell>
                            <strong>Score</strong>
                          </TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {categories?.categorysummary.map((category, index) => {
                          return (
                            <>
                              <TableRow key={index}>
                                <TableCell>{category.categoryName}</TableCell>
                                <TableCell>
                                  {" "}
                                  <Controller
                                    name={`updateSurveyScores[${index}].score`}
                                    control={control}
                                    defaultValue={groupSurveyYup.defaultValues}
                                    render={({ field }) =>
                                      !errors.limit ? (
                                        <TextField
                                          {...field}
                                          autoComplete="false"
                                          label="Score"
                                          variant="outlined"
                                          type="number"
                                          helperText={
                                            "Max score is " +
                                            category.limit +
                                            "."
                                          }
                                          //  fullWidth
                                        />
                                      ) : (
                                        <TextField
                                          {...field}
                                          autoComplete="false"
                                          error
                                          label="Score"
                                          variant="filled"
                                          type="number"
                                          helperText={errors.limit.message}
                                          //  fullWidth
                                        />
                                      )
                                    }
                                  />
                                </TableCell>
                              </TableRow>
                            </>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              )}

              {activeStep === 2 && (
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    width: 80,
                    marginRight: 2,
                    fontSize: 12,
                  }}
                >
                  Confirm
                </Button>
              )}

              <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                <Button
                  color="inherit"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
                <Box sx={{ flex: "1 1 auto" }} />

                <Button onClick={handleNext}>
                  {activeStep === steps.length - 1 ? "Finish" : "Next"}
                </Button>
              </Box>
            </form>
          </>
        )}
      </Box>

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
}
