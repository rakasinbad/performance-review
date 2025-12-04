import { Box } from "@mui/material";
import { useQuery } from "@apollo/client";
import { useFormContext, useWatch } from "react-hook-form";
import RHFRating from "../../../components/RHFRating";
import { QUESTION_GQL } from "../../../gql/question.gql";
import { useMemo } from "react";

const StepQuestion = ({ activeStep }: any) => {
  const { control, setValue } = useFormContext();

  const step1 = useWatch({
    control,
    name: "step1",
  });

  console.log("step1", step1);

  const getJabatan = useMemo(() => {
    // jika posisi penilai sebagai atasan maka jabatan untuk pertanyaannya sesuai target karyawannya
    if (step1?.position === "SUBORDINATE") {
      return step1?.jabatanTarget;
    }

    return step1?.position;
  }, [step1]);

  const { data, error, loading } = useQuery<any>(QUESTION_GQL, {
    variables: {
      input: {
        limit: 10,
        offset: 0,
        dept: step1?.dept,
        subDept: step1?.subDept,
        jabatan: getJabatan,
        isAllDept: activeStep === 1,
      },
      fetchPolicy: "no-cache",
    },
  });

  console.log("Data question", data);

  return (
    <Box sx={{}}>
      <RHFRating
        required
        name="rating"
        label="1. Sejauh mana karyawan mampu memberikan pengarahan dan bimbingan yang jelas serta mudah dipahami oleh tim atau rekan kerja?"
      />
    </Box>
  );
};

export default StepQuestion;
