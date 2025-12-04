import { FormProvider, useForm } from "react-hook-form";

import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";

import { defaultValues, Schema, schema } from "../types/schema";
import { useState } from "react";
import MultiStepForm from "./MultiStepForm";
import { SchemaReview } from "../types/reviewSchema";

export function ContentProvider() {
  const methods = useForm<SchemaReview>({
    mode: "onChange",
    resolver: zodResolver(schema),
    defaultValues,
  });

  const [activeStep, setActiveStep] = useState(0);
  const [tujuan, setTujuan] = useState("");
  const [name, setName] = useState("");
  const [skipped, setSkipped] = useState(new Set<number>());

  const isStepOptional = (step: number) => false; // make step 2 optional
  const isStepSkipped = (step: number) => skipped.has(step);

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
      setSkipped(newSkipped);
    }

    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      throw new Error("You can't skip a non-optional step.");
    }
    setSkipped((prev) => new Set(prev).add(activeStep));
    setActiveStep((prev) => prev + 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setTujuan("");
    setName("");
    setSkipped(new Set());
  };

  return (
    <FormProvider {...methods}>
      <MultiStepForm
        activeStep={1}
        handleNext={handleNext}
        handleBack={handleBack}
        handleReset={handleReset}
        isStepOptional={isStepOptional}
        isStepSkipped={isStepSkipped}
        handleSkip={handleSkip}
        tujuan={tujuan}
        setTujuan={setTujuan}
        name={name}
        setName={setName}
      />
      {/* <Users /> */}
      <DevTool control={methods.control} />
    </FormProvider>
  );
}
