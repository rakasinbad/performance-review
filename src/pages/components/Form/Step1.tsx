import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useFormContext, useWatch } from "react-hook-form";
import { RHFAutocompleteSingle } from "../../../components/RHFAutocompleteSingle";
import { SchemaReview } from "../../types/reviewSchema";
import { EMPLOYEES_GQL } from "../../../gql/employees.gql";
import { useQuery } from "@apollo/client";
import { useEffect, useMemo } from "react";
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
  const { control, watch, setValue, getValues, trigger, formState } =
    useFormContext();

  const nama = useWatch({
    control,
    name: "step1.nama",
  });

  const namaTarget = useWatch({
    control,
    name: "step1.namaTarget",
  });

  const uiState = useWatch({
    name: "uiState",
  });

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
        sortBy: "nama",
        sortType: "asc",
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

  useEffect(() => {
    setValue("uiState.deptShrink", !!nama);
    if (nama) {
      const selectedUser = employees?.find((emp: any) => emp?.id === nama);

      let dept = `${selectedUser?.data?.dept}`;
      if (selectedUser?.data?.subdept && selectedUser?.data?.subdept !== "") {
        dept += ` - ${selectedUser?.data?.subdept}`;
      }
      setValue("step1.dept", dept);
    }
  }, [nama]);

  useEffect(() => {
    setValue("uiState.deptTargetShrink", !!namaTarget);
    if (namaTarget) {
      const selectedUser = employees?.find(
        (emp: any) => emp?.id === namaTarget
      );
      let dept = `${selectedUser?.data?.dept}`;
      if (selectedUser?.data?.subdept && selectedUser?.data?.subdept !== "") {
        dept += ` - ${selectedUser?.data?.subdept}`;
      }
      setValue("step1.deptTarget", dept);
    }
  }, [namaTarget]);

  return (
    <Box>
      <FormControl fullWidth sx={{ mb: 3 }}>
        <RHFAutocompleteSingle<SchemaReview>
          name="step1.goals"
          label="Tujuan Penilaian"
          options={tujuanPenilaianOptions}
        />
      </FormControl>

      <FormControl fullWidth sx={{ mb: 4 }}>
        <RHFAutocompleteSingle<SchemaReview>
          name="step1.nama"
          label="Nama"
          options={employees}
          loading={loadingEmployees}
        />
      </FormControl>

      <FormControl fullWidth sx={{ mb: 4 }}>
        <RHFTextField<SchemaReview>
          name="step1.dept"
          label="Department"
          InputLabelProps={{
            shrink: uiState?.deptShrink,
          }}
          disabled
        />
      </FormControl>

      <FormControl fullWidth sx={{ mb: 4 }}>
        <RHFAutocompleteSingle<SchemaReview>
          name="step1.namaTarget"
          label="Nama yang akan dinilai"
          options={employees}
          loading={loadingEmployees}
        />
      </FormControl>

      <FormControl fullWidth sx={{ mb: 4 }}>
        <RHFTextField<SchemaReview>
          name="step1.deptTarget"
          label="Department"
          disabled
          InputLabelProps={{
            shrink: uiState?.deptTargetShrink,
          }}
        />
      </FormControl>
    </Box>
  );
};

export default Step1;
