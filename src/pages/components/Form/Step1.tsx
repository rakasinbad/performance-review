import { Box, FormControl, Typography } from "@mui/material";
import { useFormContext, useWatch } from "react-hook-form";
import { RHFAutocompleteSingle } from "../../../components/RHFAutocompleteSingle";
import { SchemaReview } from "../../types/reviewSchema";
import { EMPLOYEES_GQL } from "../../../gql/employees.gql";
import { useQuery } from "@apollo/client";
import { useEffect, useMemo, useState } from "react";
import { RHFTextField } from "../../../components/RHFTextField";
import { posisiPenilaiCode } from "./constant";

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

const sebagaiAtasan = {
  id: posisiPenilaiCode.SUBORDINATE,
  label: "Sebagai Atasan",
};

const sebagaiRekan = {
  id: posisiPenilaiCode.COLLEAGUE,
  label: "Sebagai Rekan Kerja (Peer)",
};

const diriSendiri = {
  id: posisiPenilaiCode.SELF,
  level: null,
  label: "Penilaian Diri Sendiri",
};

const sebagaiBawahan = {
  id: posisiPenilaiCode.SUPERIOR,
  label: "Sebagai Bawahan",
};

const Step1 = ({}) => {
  const [posisiPenilaiOptions, setPosisiPenilaiOptions] = useState<any>([]);
  const [jabatanLevel, setJabatanLevel] = useState<any>(null);
  const [employeeId, setEmployeeId] = useState<any>(null);
  const [queryParamsTargetUser, setQueryParamsTargetUser] = useState<any>({});

  const { control, setValue, resetField } = useFormContext();

  const karyawanId = useWatch({
    control,
    name: "step1.karyawanId",
  });

  const targetKaryawanId = useWatch({
    control,
    name: "step1.targetKaryawanId",
  });

  const uiState = useWatch({
    name: "uiState",
  });

  const position = useWatch({
    name: "step1.position",
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

  const {
    data: responseEmpTarget,
    error: errorEmpTarget,
    loading: loadingEmpTarget,
  } = useQuery<any>(EMPLOYEES_GQL, {
    variables: {
      input: {
        limit: 9999,
        keyword: "",
        offset: 0,
        sortBy: "nama",
        sortType: "asc",
        jabatanLevel: queryParamsTargetUser?.jabatanLevel,
        jabatanLevelSearch: queryParamsTargetUser?.jabatanLevelSearch,
        notInId: queryParamsTargetUser?.notInId,
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

  const targetEmployees = useMemo(() => {
    if (responseEmpTarget && responseEmpTarget.Employees) {
      return responseEmpTarget.Employees.data?.map((emp: any) => ({
        id: emp.id,
        label: `${emp?.nik} - ${emp?.nama}`,
        data: emp,
      }));
    }
    return [];
  }, [responseEmpTarget]);

  useEffect(() => {
    setValue("uiState.deptShrink", !!karyawanId);
    if (karyawanId) {
      const selectedUser = employees?.find(
        (emp: any) => emp?.id === karyawanId
      );

      let deptSubDept = `${selectedUser?.data?.dept}`;
      let dept = `${selectedUser?.data?.dept}`;
      let subDept = `${selectedUser?.data?.subdept}`;
      if (selectedUser?.data?.subdept && selectedUser?.data?.subdept !== "") {
        deptSubDept += ` - ${selectedUser?.data?.subdept}`;
      }
      setValue("step1.deptSubDept", deptSubDept);
      setValue("step1.dept", dept);
      setValue("step1.subDept", subDept);

      const jabatan = selectedUser?.data?.jabatan;
      if (["STAFF"]?.includes(jabatan)) {
        setPosisiPenilaiOptions([sebagaiBawahan, sebagaiRekan, diriSendiri]);
      } else {
        setPosisiPenilaiOptions([
          sebagaiAtasan,
          sebagaiRekan,
          sebagaiBawahan,
          diriSendiri,
        ]);
      }
      setJabatanLevel(selectedUser?.data?.jabatanDetail?.id);
      setEmployeeId(selectedUser?.data?.id);
    } else {
      setValue("step1.dept", "");
      setValue("step1.deptSubDept", "");
      setValue("step1.subDept", "");
    }
  }, [karyawanId]);

  useEffect(() => {
    setValue("uiState.deptTargetShrink", !!targetKaryawanId);
    if (targetKaryawanId) {
      const selectedUser = employees?.find(
        (emp: any) => emp?.id === targetKaryawanId
      );
      let deptSubDept = `${selectedUser?.data?.dept}`;
      let dept = `${selectedUser?.data?.dept}`;
      let subDept = `${selectedUser?.data?.subdept}`;
      let jabatan = `${selectedUser?.data?.jabatan}`;
      if (selectedUser?.data?.subdept && selectedUser?.data?.subdept !== "") {
        deptSubDept += ` - ${selectedUser?.data?.subdept}`;
      }
      setValue("step1.deptTarget", dept);
      setValue("step1.deptSubDeptTarget", deptSubDept);
      setValue("step1.subDeptTarget", subDept);
      setValue("step1.jabatanTarget", jabatan);
    } else {
      setValue("step1.deptTarget", "");
      setValue("step1.deptSubDeptTarget", "");
      setValue("step1.subDeptTarget", "");
      setValue("step1.jabatanTarget", "");
    }
  }, [targetKaryawanId]);

  useEffect(() => {
    if (position && position !== posisiPenilaiCode?.SELF) {
      setQueryParamsTargetUser((state: any) => {
        const jabatanLevelSearch = {
          [posisiPenilaiCode.SUBORDINATE]: "lte",
          [posisiPenilaiCode.SUPERIOR]: "gte",
          [posisiPenilaiCode.COLLEAGUE]: "eq",
        };
        return {
          ...state,
          jabatanLevel,
          jabatanLevelSearch: jabatanLevelSearch[position],
          notInId: employeeId,
        };
      });
    }
  }, [position, jabatanLevel, employeeId]);

  return (
    <Box>
      <Typography variant="body1" paragraph>
        Sebagai bagian dari proses evaluasi karyawan, perusahaan melakukan
        penilaian kinerja dan sikap kerja untuk keperluan
        <b>
          Perpanjangan Kontrak, Promosi, Demosi, maupun Pengangkatan karyawan
          tetap.
        </b>
      </Typography>

      <Typography variant="body1" paragraph>
        Melalui formulir ini, Bapak/Ibu dimohon memberikan penilaian secara
        objektif dan berdasarkan pengamatan selama periode kerja.
      </Typography>

      <Typography variant="body1" paragraph>
        Hasil penilaian akan menjadi pertimbangan manajemen dalam pengambilan
        keputusan terkait karyawan.
      </Typography>

      <Typography variant="body1" paragraph>
        Terima kasih atas perhatian dan kerja samanya.
      </Typography>

      <Typography variant="body1" fontWeight={600}>
        Tim HRD
      </Typography>

      <FormControl fullWidth sx={{ mb: 3, mt: 4 }}>
        <RHFAutocompleteSingle<SchemaReview>
          name="step1.goals"
          label="Tujuan Penilaian"
          options={tujuanPenilaianOptions}
          required
        />
      </FormControl>

      <FormControl fullWidth sx={{ mb: 4 }}>
        <RHFAutocompleteSingle<SchemaReview>
          name="step1.karyawanId"
          label="Nama"
          options={employees}
          loading={loadingEmployees}
          required
          // onInputChange={(e: any) =>
          //   console.log("on change input", e.target.value)
          // }
        />
      </FormControl>

      <FormControl fullWidth sx={{ mb: 4 }}>
        <RHFTextField<SchemaReview>
          name="step1.deptSubDept"
          label="Department"
          InputLabelProps={{
            shrink: uiState?.deptShrink,
          }}
          disabled
        />
      </FormControl>

      <Typography variant="body1" paragraph>
        Silakan pilih posisi Anda dalam memberikan penilaian. Pilihan ini akan
        membantu menyesuaikan perspektif penilaian sesuai dengan hubungan kerja
        Anda dengan karyawan yang dinilai.
      </Typography>

      <FormControl fullWidth sx={{ mt: 2, mb: 4 }}>
        <RHFAutocompleteSingle<SchemaReview>
          name="step1.position"
          label="Posisi Penilai"
          options={posisiPenilaiOptions}
          required
          disabled={!karyawanId}
          customOnChange={() => {
            setValue("step1.targetKaryawanId", "");
            resetField("step2");
          }}
        />
      </FormControl>

      {!position || position === posisiPenilaiCode.SELF ? null : (
        <>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <RHFAutocompleteSingle<SchemaReview>
              name="step1.targetKaryawanId"
              label="Nama yang akan dinilai"
              options={targetEmployees}
              loading={loadingEmpTarget}
              required
              customOnChange={() => {
                resetField("step2");
              }}
            />
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <RHFTextField<SchemaReview>
              name="step1.deptSubDeptTarget"
              label="Department"
              disabled
              InputLabelProps={{
                shrink: uiState?.deptTargetShrink,
              }}
            />
          </FormControl>
        </>
      )}
    </Box>
  );
};

export default Step1;
