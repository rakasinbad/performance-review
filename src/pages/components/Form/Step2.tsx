import { Box } from "@mui/material";
import { EMPLOYEES_GQL } from "../../../gql/employees.gql";
import { useQuery } from "@apollo/client";
import { useFormContext, useWatch } from "react-hook-form";
import RHFRating from "../../../components/RHFRating";

const Step2 = ({}) => {
  const { control, setValue } = useFormContext();

  const step1 = useWatch({
    control,
    name: "step1",
  });

  console.log("step1", step1);

  const test = {
    goals: "promotion",
    nama: 2426,
    dept: "PRODUCTION - PRODUCTION",
    position: "SUBORDINATE",
    deptTarget: "ACCOUNTING - ACCOUNTING",
    namaTarget: 2423,
  };

  // const {
  //   data: responseEmployees,
  //   error: errorEmployees,
  //   loading: loadingEmployees,
  // } = useQuery<any>(EMPLOYEES_GQL, {
  //   variables: {
  //     input: {
  //       limit: 9999,
  //       keyword: "",
  //       offset: 0,
  //       sortBy: "nama",
  //       sortType: "asc",
  //     },
  //     fetchPolicy: "no-cache",
  //   },
  // });

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

export default Step2;
