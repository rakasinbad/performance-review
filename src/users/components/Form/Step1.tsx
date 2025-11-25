import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { RHFAutocompleteSingle } from "../../../components/RHFAutocompleteSingle";
import { SchemaReview } from "../../types/reviewSchema";
import { EMPLOYEES_GQL } from "../../../gql/employees.gql";
import { useQuery } from "@apollo/client";
import { useMemo } from "react";
import { RHFTextField } from "../../../components/RHFTextField";

const tujuanPenilaianOptions = [
  {
    id: "extension",
    label: "Perpanjangan Kontrak Tahunan",
  },
  {
    id: "promotion",
    label: "Promosi",
  },
  {
    id: "demotion",
    label: "Demosi",
  },
  {
    id: "appointment",
    label: "Pengangkatan Karyawan Tetap",
  },
];

const Step1 = ({}) => {
  const { watch, setValue } = useFormContext();

  const {
    data: responseEmployees,
    error: errorEmployees,
    loading: loadingEmployees,
  } = useQuery<any>(EMPLOYEES_GQL, {
    variables: {
      input: {
        limit: 9999,
        keyword: "",
        offset: 0,
      },
      fetchPolicy: "no-cache",
    },
  });

  const employees = useMemo(() => {
    if (responseEmployees && responseEmployees.Employees) {
      return responseEmployees.Employees.data?.map((emp: any) => ({
        id: emp.id,
        label: `${emp?.nik} - ${emp?.nama}`,
        data: emp,
      }));
    }
    return [];
  }, [responseEmployees]);

  return (
    <Box>
      <FormControl fullWidth sx={{ mb: 3 }}>
        <RHFAutocompleteSingle<SchemaReview>
          name="goals"
          label="Tujuan Penilaian"
          options={tujuanPenilaianOptions}
        />
      </FormControl>

      <FormControl fullWidth sx={{ mb: 4 }}>
        <RHFAutocompleteSingle<SchemaReview>
          name="nama"
          label="Nama"
          options={employees}
          loading={loadingEmployees}
          customOnChange={(value) => {
            console.log("labe value", value);
            setValue("dept", value ? value.label.split(" - ")[0] : "");
          }}
        />
      </FormControl>

      <FormControl fullWidth sx={{ mb: 4 }}>
        <RHFTextField<SchemaReview> name="dept" label="Department" disabled />
      </FormControl>

      <FormControl fullWidth sx={{ mb: 4 }}>
        <RHFAutocompleteSingle<SchemaReview>
          name="namaTarget"
          label="Nama yang akan dinilai"
          options={employees}
          loading={loadingEmployees}
        />
      </FormControl>

      <FormControl fullWidth sx={{ mb: 4 }}>
        <RHFTextField<SchemaReview>
          name="deptTarget"
          label="Department"
          disabled
        />
      </FormControl>
    </Box>
  );
};

export default Step1;
