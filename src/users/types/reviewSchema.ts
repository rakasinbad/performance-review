import { z } from "zod";

export const schemaReview = z.intersection(
  z.object({
    goals: z.string().min(1, "Tujuan Penilaian is required"),
    nama: z.string().min(1, "Nama is required"),
    dept: z.string().min(1, "Dept is required"),
    namaTarget: z.string().min(1, "Nama Target is required"),
    deptTarget: z.string().min(1, "Dept Target is required"),
  }),

  z.discriminatedUnion("variant", [
    z.object({ variant: z.literal("create") }),
    z.object({ variant: z.literal("edit"), id: z.string().min(1) }),
  ])
);

export type SchemaReview = z.infer<typeof schemaReview>;

export const defaultValuesReview: SchemaReview = {
  variant: "create",
  goals: "",
  nama: "",
  dept: "",
  namaTarget: "",
  deptTarget: "",
};
