import { useQuery } from "@apollo/client";
import { useMemo } from "react";
import { QUESTION_GROUP_GQL } from "../../../gql/question.gql";
import { Box } from "@mui/material";

function StepClosing() {
  const { data: responseQg } = useQuery<any>(QUESTION_GROUP_GQL, {
    variables: {
      input: {
        section: "CLOSING",
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
    <Box>
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
    </Box>
  );
}

export default StepClosing;
