import { Box, CircularProgress } from "@mui/material";
import { useQuery } from "@apollo/client";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import RHFRating from "../../../components/RHFRating";
import { QUESTION_GQL, QUESTION_GROUP_GQL } from "../../../gql/question.gql";
import { useEffect, useMemo } from "react";
import { RHFTextField } from "../../../components/RHFTextField";
import Loading from "../../../components/Loading";

const StepQuestion = ({ activeStep }: any) => {
  const { control, setValue, register } = useFormContext();

  const step1 = useWatch({
    control,
    name: "step1",
  });

  const ratingType = useMemo(() => {
    if (activeStep === 2) {
      return "SPECIFIC";
    }
    return "GENERAL";
  }, [activeStep]);

  useFieldArray({
    control,
    name: `ratings.${ratingType}`,
  });

  const getJabatan = useMemo(() => {
    // jika posisi penilai sebagai atasan maka jabatan untuk pertanyaannya sesuai target karyawannya
    if (step1?.position === "SUBORDINATE") {
      return step1?.jabatanTarget;
    }

    return step1?.position;
  }, [step1]);

  const getDept = useMemo(() => {
    console.log("step1?.deptDeclareTarget", step1?.deptDeclareTarget);
    let dept = step1?.dept;
    let subDept = step1?.subDept;
    if (step1?.position === "SUBORDINATE") {
      dept = step1?.deptTarget;

      if (step1?.deptDeclareTarget && step1?.deptDeclareTarget === "OUTLET") {
        subDept = "OUTLET";
      } else {
        subDept = step1?.subDeptTarget;
      }
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

  return (
    <Box sx={{}}>
      {loadingQg ? (
        <Loading />
      ) : (
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
      )}
      {loading ? (
        <Loading />
      ) : (
        questions?.data?.map((q: any, index: any) =>
          q?.type === "rating" ? (
            <Box key={q.id} sx={{ mb: 4 }}>
              <RHFRating
                required
                name={`step2.ratings.${ratingType}.${index}.rating`} // <— Nested array form
                label={`${index + 1}. ${q.text}`}
              />
              <input
                type="hidden"
                value={q?.id}
                {...register(`step2.ratings.${ratingType}.${index}.questionId`)}
              />
            </Box>
          ) : (
            <Box key={q.id} sx={{ mb: 4 }}>
              <RHFTextField
                required
                name={`step2.ratings.${ratingType}.${index}.rating`} // <— Nested array form
                label={`${index + 1}. ${q.text}`}
              />
              <input
                type="hidden"
                value={q?.id}
                {...register(`step2.ratings.${ratingType}.${index}.questionId`)}
              />
            </Box>
          )
        )
      )}
    </Box>
  );
};

export default StepQuestion;
