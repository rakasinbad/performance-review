import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Button,
  Paper,
  CircularProgress,
} from "@mui/material";
import Step1 from "./Form/Step1";
import logo from "../../../public/logo-dapcok-new.png";
import { useFormContext, useWatch } from "react-hook-form";
import { posisiPenilaiCode } from "./Form/constant";
import StepQuestion from "./Form/StepQuestion";
import StepClosing from "./Form/StepClosing";
import { CREATE_RESPONSE_GQL } from "../../gql/question.gql";
import { useMutation } from "@apollo/client";
import { useToast } from "../../components/toast/ToastContext";

const MultiStepForm = ({
  activeStep,
  handleNext,
  handleBack,
  handleReset,
  isStepOptional,
  isStepSkipped,
  handleSkip,
}: any) => {
  const { showToast } = useToast();
  const { control } = useFormContext();
  const step1 = useWatch({
    control,
    name: "step1",
  });
  const step2 = useWatch({
    control,
    name: "step2",
  });
  const [
    createResponse,
    {
      data: responseCreateResponse,
      loading: loadingCreateResponse,
      error: erroeCreateResponse,
    },
  ] = useMutation<any>(CREATE_RESPONSE_GQL);

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
          return (
            !step1?.goals || !step1?.karyawanId || !step1?.targetKaryawanId
          );
        } else {
          return !step1?.goals || !step1?.karyawanId || !step1?.position;
        }
      case 1:
        return (
          step2?.ratings?.["GENERAL"]?.some((item: any) => !item.rating) ||
          !step2?.ratings?.["GENERAL"]
        );
      case 2:
        if (step2?.ratings?.["SPECIFIC"]) {
          return step2?.ratings?.["SPECIFIC"]?.some(
            (item: any) => !item.rating
          );
        }
        return false;
      default:
        return false;
    }
  }, [step1]);

  const onHandleNext = useCallback(async () => {
    if (activeStep === steps.length - 1) {
      const responseQuestion: any = [];
      step2?.ratings?.GENERAL?.forEach((r: any) => {
        responseQuestion?.push({
          questionId: parseInt(r?.questionId),
          text: r?.rating?.toString(),
        });
      });
      if (step2?.ratings?.SPECIFIC) {
        step2?.ratings?.SPECIFIC?.forEach((r: any) => {
          responseQuestion?.push({
            questionId: parseInt(r?.questionId),
            text: r?.rating?.toString(),
          });
        });
      }
      const variables = {
        input: {
          goals: step1?.goals,
          targetPosition: step1?.position,
          karyawanId: step1?.karyawanId,
          targetKaryawanId: step1?.targetKaryawanId,
          status: "1",
          responseQuestion,
        },
      };

      try {
        await createResponse({
          variables,
        });
        showToast("Data berhasil dikirim", "success");
        return handleNext();
      } catch (error: any) {
        console.error("Mutation error:", error);
        showToast(
          "Data gagal dikirim",
          error?.["message"] || error?.data?.message
        );
      }
      return handleNext();
    }
    return handleNext();
  }, [step1, step2, activeStep, steps]);

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
                Klik RESET untuk kembali ke halaman utama
              </Typography>
              <Button variant="contained" color="primary" onClick={handleReset}>
                Reset
              </Button>
            </Box>
          ) : (
            <>
              {activeStep === 0 && <Step1 />}
              {activeStep === 1 || (activeStep === 2 && steps?.length === 4) ? (
                <StepQuestion activeStep={activeStep} />
              ) : (activeStep === 2 && steps?.length === 3) ||
                (activeStep === 3 && steps?.length === 4) ? (
                <StepClosing />
              ) : null}
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
                  onClick={onHandleNext}
                  disabled={nextDisabled || loadingCreateResponse}
                >
                  {loadingCreateResponse ? (
                    <CircularProgress />
                  ) : activeStep === steps.length - 1 ? (
                    "Submit"
                  ) : (
                    "Next"
                  )}
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
