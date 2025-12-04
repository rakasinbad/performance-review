import { z } from "zod";

export const schemaReview = z.intersection(
  z.object({
    step1: z.object({
      goals: z.string().min(1, "Tujuan Penilaian is required"),
      nama: z.string().min(1, "Nama is required"),
      dept: z.string().min(1, "Dept is required"),
      deptSubDept: z.string().min(1, "Dept is required"),
      subDept: z.string().min(1, "Sub Dept is required"),
      namaTarget: z.string().min(1, "Nama Target is required"),
      deptTarget: z.string().min(1, "Dept Target is required"),
      deptSubDeptTarget: z.string().min(1, "Dept Target is required"),
      subDeptTarget: z.string().min(1, "Sub Dept Target is required"),
      position: z.string().min(1, "Position is required"),
    }),
    uiState: z.object({
      deptShrink: z.boolean(),
      deptTargetShrink: z.boolean(),
    }),
  }),

  z.discriminatedUnion("variant", [
    z.object({ variant: z.literal("create") }),
    z.object({ variant: z.literal("edit"), id: z.string().min(1) }),
  ])
);

export type SchemaReview = z.infer<typeof schemaReview>;

export const defaultValuesReview: SchemaReview = {
  variant: "create",
  step1: {
    goals: "",
    nama: "",
    dept: "",
    deptSubDept: "",
    subDept: "",
    namaTarget: "",
    deptSubDeptTarget: "",
    deptTarget: "",
    subDeptTarget: "",
    position: "",
  },

  uiState: {
    deptShrink: false,
    deptTargetShrink: false,
  },
};
