import React, { useEffect, useMemo, useState } from "react";
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
import logo from "../../../public/logo-dapcok-new.png";
import { useFormContext, useWatch } from "react-hook-form";
import { posisiPenilaiCode } from "./Form/constant";
import Step2 from "./Form/Step2";

const MultiStepForm = ({
  activeStep,
  handleNext,
  handleBack,
  handleReset,
  isStepOptional,
  isStepSkipped,
  handleSkip,
}: any) => {
  const { control } = useFormContext();
  const step1 = useWatch({
    control,
    name: "step1",
  });

  const steps = useMemo(() => {
    if (step1?.position === posisiPenilaiCode?.SUBORDINATE) {
      return [
        "Step 1: Identitas",
        "Step 2: Pertanyaan Umum",
        "Step 3: Pertanyaan Spesifik",
        "Step 4: Penutup",
      ];
    }
    return ["Step 1: Identitas", "Step 2: Pertanyaan Umum", "Step 3: Penutup"];
  }, [step1]);

  const nextDisabled = useMemo(() => {
    switch (activeStep) {
      case 0:
        if (step1?.position && step1?.position !== posisiPenilaiCode.SELF) {
          return !step1?.goals || !step1?.nama || !step1?.namaTarget;
        } else {
          return !step1?.goals || !step1?.nama || !step1?.position;
        }

      default:
        return false;
    }
  }, [step1]);

  return (
    <Box
      sx={{
        width: "100%",
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        pt: 5,
        backgroundColor: "#F0EDED",
        minHeight: "100vh",
      }}
    >
      <Box
        component="img"
        src={logo}
        alt="Logo"
        sx={{
          width: 700,
          height: "auto",
          borderRadius: 2,
          mb: 2,
          backgroundColor: "white",
          padding: 4,
        }}
      />

      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 4,
            maxWidth: 700,
            width: "100%",
            borderRadius: 3,
            backgroundColor: "#fdfdfd",
            borderTop: "10px solid #764E3F",
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            textAlign="center"
            fontWeight={"bold"}
          >
            Penilaian Karyawan
          </Typography>
          <Stepper
            activeStep={activeStep}
            alternativeLabel
            sx={{
              mt: 2,
              mb: 4,
              "& .MuiStepLabel-root .Mui-completed": {
                color: "#4caf50", // completed step color
              },
              "& .MuiStepLabel-root .Mui-active": {
                color: "#764E3F", // active step color
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
              {activeStep === 1 && <Step2 />}
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
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  disabled={nextDisabled}
                >
                  {activeStep === steps.length - 1 ? "Finish" : "Next"}
                </Button>
              </Box>
            </>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default MultiStepForm;
