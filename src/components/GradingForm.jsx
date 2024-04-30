import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Autocomplete, TextField } from "@mui/material";
import { useGetAllGroupsQuery } from "../redux/api/groupAPI";
import { useSelector } from "react-redux";
import { groupSurveyYup } from "../schema/Schema";
import { yupResolver } from "@hookform/resolvers/yup";

const steps = ["Select a group", "Grade selected group", "Confirm"];

export default function GradingForm() {
  const [activeStep, setActiveStep] = useState(0);

  const isStepSkipped = (step) => {};

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

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(groupSurveyYup.schema),
    mode: "onChange",
    defaultValues: groupSurveyYup.defaultValues,
  });

  return (
    <Box sx={{ width: "100%" }}>
      <Typography
        id="modal-modal-title"
        variant="h4"
        component="h3"
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

      {activeStep === steps.length ? (
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

          <form>
            {/* <Controller
              control={control}
              name="groupsId"
              defaultValue={groupSurveyYup.defaultValues}
              render={({ field }) => {
                return (
                  <Autocomplete
                    {...field}
                    fullWidth
                    disablePortal
                    options={groups?.gcsummary.map((option) => ({
                      id: option.id,
                      name: option.groupName,
                    }))}
                    // value={options.id}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Groups"
                        helperText="Please select a group."
                      />
                    )}
                    onChange={(e, value) => field.onChange(value)}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id && option.name === value.name
                    }
                  />
                );
              }}
            /> */}

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

              <Button
                onClick={handleNext}
                type={activeStep === steps.length - 1 ? "submit" : null}
              >
                {activeStep === steps.length - 1 ? "Finish" : "Next"}
              </Button>
            </Box>
          </form>
        </>
      )}
    </Box>
  );
}
