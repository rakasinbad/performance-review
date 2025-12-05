import { Box } from "@mui/material";
import { useQuery } from "@apollo/client";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import RHFRating from "../../../components/RHFRating";
import { QUESTION_GQL, QUESTION_GROUP_GQL } from "../../../gql/question.gql";
import { useMemo } from "react";

const StepQuestion = ({ activeStep }: any) => {
  const { control, setValue } = useFormContext();
  const { fields } = useFieldArray({
    control,
    name: "ratings",
  });
  console.log("fields", fields);

  const step1 = useWatch({
    control,
    name: "step1",
  });

  const getJabatan = useMemo(() => {
    // jika posisi penilai sebagai atasan maka jabatan untuk pertanyaannya sesuai target karyawannya
    if (step1?.position === "SUBORDINATE") {
      return step1?.jabatanTarget;
    }

    return step1?.position;
  }, [step1]);

  const getDept = useMemo(() => {
    let dept = step1?.dept;
    let subDept = step1?.subDept;
    if (step1?.position === "SUBORDINATE") {
      dept = step1?.deptTarget;
      subDept = step1?.subDeptTarget;
    }

    return {
      dept,
      subDept,
    };
  }, [step1]);

  const { data, error, loading } = useQuery<any>(QUESTION_GQL, {
    variables: {
      input: {
        limit: 10,
        offset: 0,
        dept: getDept?.dept,
        subDept: getDept?.subDept,
        jabatan: getJabatan,
        isAllDept: activeStep === 1,
      },
      fetchPolicy: "no-cache",
    },
  });

  const questions = useMemo(() => {
    if (data && data.Questions) {
      return data.Questions;
    }
    return [];
  }, [data]);

  console.log("Data question", questions);
  const {
    data: responseQg,
    error: errorQg,
    loading: loadingQg,
  } = useQuery<any>(QUESTION_GROUP_GQL, {
    variables: {
      input: {
        id: questions?.data?.[0]?.questionGroupId,
      },
      fetchPolicy: "no-cache",
    },
  });

  const questionGroup = useMemo(() => {
    if (responseQg && responseQg.QuestionGroup) {
      return responseQg.QuestionGroup;
    }
    return null;
  }, [responseQg]);

  console.log("Data question group", questionGroup);

  return (
    <Box sx={{}}>
      <Box
        sx={{
          fontSize: "15px",
          lineHeight: 1.7,
          "& table": {
            width: "100%",
            borderCollapse: "collapse",
            mt: 1,
          },
          "& th, & td": {
            border: "1px solid #ccc",
            padding: "8px",
          },
          "& th": {
            backgroundColor: "#f5f5f5",
          },
          mb: 4,
        }}
        dangerouslySetInnerHTML={{ __html: questionGroup?.instruction }}
      />
      {questions?.data?.map((q: any, index: any) => (
        <Box key={q.id} sx={{ mb: 4 }}>
          <RHFRating
            required
            name={`ratings.${index}.rating`} // <— Nested array form
            label={`${index + 1}. ${q.text}`}
          />
        </Box>
      ))}
    </Box>
  );
};

export default StepQuestion;
