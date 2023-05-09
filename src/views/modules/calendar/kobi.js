const tables = {
  hatirlatici: {
    table_display: "Hatırlatıcı/Not",
    table_name: "hatirlatici",
    date_name: "hatirlatici_tarih",
    title: "title",
    color: "#68A7AD",
    add: true,
  },

  e_fatura: {
    table_display: "E-Fatura",
    table_name: "e_fatura",
    date_name: "fatura_tarihi",
    title: "e_fatura_numarasi",
    color: "#c1c8f1",
    add: "/e-donusum/fatura/ekle",
    edit: "/e-donusum/fatura/duzenle/",
  },
  e_irsaliye: {
    table_display: "E-İrsaliye",
    table_name: "e_irsaliye",
    date_name: "irsaliye_tarihi",
    title: "irsaliye_numarasi",
    color: "#bfd3e9",
    add: "/e-donusum/irsaliye/ekle",
    edit: "/e-donusum/irsaliye/duzenle/",
  },
  e_arsiv_fatura: {
    table_display: "E-Arşiv",
    table_name: "e_arsiv_fatura",
    date_name: "fatura_tarihi",
    title: "e_fatura_numarasi",
    color: "#90b9a3",
    add: "/e-donusum/arsiv/ekle",
    edit: "/e-donusum/arsiv/duzenle/",
  },
  serbest_meslek_makbuzu: {
    table_display: "Serbest Meslek M.",
    table_name: "serbest_meslek_makbuzu",
    date_name: "duzenleme_tarihi",
    title: "belge_no",
    color: "#8189b4",
    add: "/e-donusum/smm/ekle",
    edit: "/e-donusum/smm/duzenle/",
  },
  e_mustahsil_makbuzu: {
    table_display: "Müstahsil M.",
    table_name: "e_mustahsil_makbuzu",
    date_name: "duzenleme_tarihi",
    title: "belge_no",
    color: "#87c8d0",
    add: "/e-donusum/e-mm/ekle",
    edit: "/e-donusum/e-mm/duzenle/",
  },
};

export default tables;
