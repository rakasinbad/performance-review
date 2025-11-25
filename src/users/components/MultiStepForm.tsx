import React from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Button,
  Paper,
} from "@mui/material";
import Step1 from "./Form/Step1";

const MultiStepForm = ({
  steps,
  activeStep,
  handleNext,
  handleBack,
  handleReset,
  isStepOptional,
  isStepSkipped,
  handleSkip,
  tujuan,
  setTujuan,
  name,
  setName,
}: any) => {
  return (
    <Box
      sx={{ width: "100%", mt: 5, display: "flex", justifyContent: "center" }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          maxWidth: 600,
          width: "100%",
          borderRadius: 3,
          backgroundColor: "#fdfdfd",
        }}
      >
        <Typography variant="h4" gutterBottom textAlign="center">
          Penilaian Karyawan
        </Typography>

        <Stepper
          activeStep={activeStep}
          alternativeLabel
          sx={{
            mb: 4,
            "& .MuiStepLabel-root .Mui-completed": {
              color: "#4caf50", // completed step color
            },
            "& .MuiStepLabel-root .Mui-active": {
              color: "#1976d2", // active step color
            },
          }}
        >
          {steps.map((label: any, index: any) => {
            const stepProps: { completed?: boolean } = {};
            const labelProps: { optional?: React.ReactNode } = {};

            if (isStepOptional(index)) {
              labelProps.optional = (
                <Typography variant="caption" color="text.secondary">
                  Optional
                </Typography>
              );
            }

            if (isStepSkipped(index)) {
              stepProps.completed = false;
            }

            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>

        {activeStep === steps.length ? (
          <Box textAlign="center">
            <Typography sx={{ mt: 2, mb: 3 }} variant="h6">
              All steps completed - you&apos;re finished!
            </Typography>
            <Button variant="contained" color="primary" onClick={handleReset}>
              Reset
            </Button>
          </Box>
        ) : (
          <>
            {activeStep === 0 && <Step1 />}

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
              {isStepOptional(activeStep) && (
                <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                  Skip
                </Button>
              )}
              <Button variant="contained" color="primary" onClick={handleNext}>
                {activeStep === steps.length - 1 ? "Finish" : "Next"}
              </Button>
            </Box>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default MultiStepForm;
