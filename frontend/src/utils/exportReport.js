import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ======================
// 📊 EXCEL EXPORT
// ======================
export const exportToExcel = (history) => {

  const allData = [];

  Object.keys(history || {}).forEach((zone) => {
    history[zone].forEach((entry) => {
      allData.push({
        Zone: zone,
        Time: entry.time,
        People: entry.people,
        Garbage: entry.garbage,
        Risk: entry.riskLevel,
        GarbagePercent: entry.garbagePercent,
      });
    });
  });

  const worksheet = XLSX.utils.json_to_sheet(allData);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

  XLSX.writeFile(workbook, "campus_report.xlsx");
};

// ======================
// 📄 PDF EXPORT
// ======================
export const exportToPDF = (history) => {

  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("Smart Swachhta Report", 14, 15);

  const tableData = [];

  Object.keys(history || {}).forEach((zone) => {
    history[zone].forEach((entry) => {
      tableData.push([
        zone,
        entry.time,
        entry.people,
        entry.garbage,
        entry.riskLevel,
        entry.garbagePercent?.toFixed?.(0) || 0
      ]);
    });
  });

  autoTable(doc, {
    head: [["Zone", "Time", "People", "Garbage", "Risk", "Garbage %"]],
    body: tableData,
    startY: 25,
    styles: { fontSize: 9 }
  });

  doc.save("campus_report.pdf");
};