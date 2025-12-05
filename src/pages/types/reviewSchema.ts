import { z } from "zod";

export const schemaReview = z.intersection(
  z.object({
    step1: z.object({
      goals: z.string().min(1, "Tujuan Penilaian is required"),
      karyawanId: z.number().min(1, "Nama is required"),
      dept: z.string().min(1, "Dept is required"),
      deptSubDept: z.string().min(1, "Dept is required"),
      subDept: z.string().min(1, "Sub Dept is required"),
      targetKaryawanId: z.number().min(1, "Nama Target is required"),
      deptTarget: z.string().min(1, "Dept Target is required"),
      deptSubDeptTarget: z.string().min(1, "Dept Target is required"),
      subDeptTarget: z.string().min(1, "Sub Dept Target is required"),
      position: z.string().min(1, "Position is required"),
      jabatanTarget: z.string().min(1, "Jabatan Target is required"),
    }),
    step2: z.object({
      ratings: z.object({
        general: z
          .array(
            z.object({
              questionId: z.string(),
              rating: z
                .number()
                .min(1, "Rating is required") // if scoring 1–5
                .max(5),
            })
          )
          .min(1),
        specific: z
          .array(
            z.object({
              questionId: z.string(),
              rating: z
                .number()
                .min(1, "Rating is required") // if scoring 1–5
                .max(5),
            })
          )
          .min(1),
      }),
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
    karyawanId: 0,
    dept: "",
    deptSubDept: "",
    subDept: "",
    targetKaryawanId: 0,
    deptSubDeptTarget: "",
    deptTarget: "",
    subDeptTarget: "",
    position: "",
    jabatanTarget: "",
  },
  step2: {
    ratings: {
      general: [],
      specific: [],
    },
  },

  uiState: {
    deptShrink: false,
    deptTargetShrink: false,
  },
};
