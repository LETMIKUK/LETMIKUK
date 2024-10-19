export const categories = [
  {
    id: "analisa",
    title: "Analisa Stunting per Provinsi",
    color: "sky",
    separatorBefore: false,
    links: [
      { title: "Laporan Rangkuman", url: "/analisa" },
      {
        title: "Pengelolaan Budget Proyek",
        url: "/analisa/pengelolaan-budget",
      },
      { title: "Pembuatan Proposal Proyek", url: "/analisa/proposal" },
    ],
  },
  {
    id: "intervensi",
    title: "Pengelolaan Proyek Intervensi",
    color: "lime",
    separatorBefore: false,
    links: [
      { title: "Laporan Hasil Proyek", url: "/intervensi" },
      { title: "Suplai & Tenaga Kerja", url: "/intervensi/suplai-tenaga" },
      { title: "Pengrekrutan", url: "/intervensi/pengrekrutan" },
    ],
  },
  {
    id: "marketing",
    title: "Pengelolaan Marketing",
    color: "amber",
    separatorBefore: true, // This will add a separator before this category
    links: [
      { title: "Laporan Rangkuman", url: "/marketing" },
      { title: "Whatsapp", url: "/marketing/whatsapp" },
      { title: "Instagram", url: "/marketing/instagram" },
      { title: "Facebook", url: "/marketing/facebook" },
      { title: "Pengrekrutan", url: "/marketing/pengrekrutan" },
    ],
  },
  {
    id: "edukasi",
    title: "Pengelolaan Edukasi",
    color: "pink",
    separatorBefore: false,
    links: [
      { title: "Laporan Rangkuman", url: "/edukasi" },
      { title: "Instagram", url: "/edukasi/instagram" },
      { title: "Facebook", url: "/edukasi/facebook" },
      { title: "Pengrekrutan", url: "/edukasi/pengrekrutan" },
    ],
  },
];
