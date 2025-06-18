import * as XLSX from "xlsx";

export function exportToExcelThongKe(dataList, month, selectedClass, daySet) {
  const wb = XLSX.utils.book_new();

  const titleRow1 = ["TRƯỜNG TIỂU HỌC BÌNH KHÁNH"];
  const titleRow2 = [`THỐNG KÊ BÁN TRÚ THÁNG ${month}`];
  const titleRow3 = [`LỚP: ${selectedClass}`];

  const headerRow = ["STT", "HỌ VÀ TÊN", ...daySet.map(d => `${d}`), "TỔNG CỘNG"];

  const rows = dataList.map((s) => {
    const dayData = daySet.map((d) => s.daySummary[d] || "");
    return [
      s.stt,
      s.hoVaTen,
      ...dayData,
      s.total > 0 ? s.total : "",
    ];
  });

  const footerRow = ["", "TỔNG CỘNG", ...Array(daySet.length).fill(""), ""];

  const wsData = [titleRow1, titleRow2, titleRow3, [], headerRow, ...rows, footerRow];

  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Đóng khung bảng
  const totalRows = wsData.length;
  const totalCols = headerRow.length;
  const range = XLSX.utils.decode_range(`A5:${XLSX.utils.encode_cell({ r: 4 + rows.length, c: totalCols - 1 })}`);

  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
      if (!ws[cellAddress]) ws[cellAddress] = { t: "s", v: "" };
      if (!ws[cellAddress].s) ws[cellAddress].s = {};
      ws[cellAddress].s.border = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      };
    }
  }

  XLSX.utils.book_append_sheet(wb, ws, "THỐNG KÊ");
  XLSX.writeFile(wb, `ThongKeThang_${selectedClass}_T${month}.xlsx`);
}
