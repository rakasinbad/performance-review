export const posisiPenilaiCode = {
  SELF: "SELF",
  SUBORDINATE: "SUBORDINATE",
  SUPERIOR: "SUPERIOR",
  COLLEAGUE: "COLLEAGUE",
};

export const tujuanPenilaianOptions = [
  {
    id: "EXTENSION",
    label: "Perpanjangan Kontrak Tahunan",
  },
  {
    id: "PROMOTION",
    label: "Promosi",
  },
  {
    id: "DEMOTION",
    label: "Demosi",
  },
  {
    id: "APPOINTMENT",
    label: "Pengangkatan Karyawan Tetap",
  },
];

export const sebagaiAtasan = {
  id: posisiPenilaiCode.SUBORDINATE,
  label: "Sebagai Atasan",
};

export const sebagaiRekan = {
  id: posisiPenilaiCode.COLLEAGUE,
  label: "Sebagai Rekan Kerja (Peer)",
};

export const diriSendiri = {
  id: posisiPenilaiCode.SELF,
  level: null,
  label: "Penilaian Diri Sendiri",
};

export const sebagaiBawahan = {
  id: posisiPenilaiCode.SUPERIOR,
  label: "Sebagai Bawahan",
};
