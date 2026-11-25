import { jsPDF } from 'jspdf';
import type { CropReport } from '../types/cropsense';

export function exportReportToPdf(report: CropReport): void {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 48;
  const maxWidth = pageWidth - margin * 2;
  let y = 56;

  const ensureSpace = (needed: number) => {
    if (y + needed > doc.internal.pageSize.getHeight() - 56) {
      doc.addPage();
      y = 56;
    }
  };

  // Header band
  doc.setFillColor(45, 58, 46);
  doc.rect(0, 0, pageWidth, 88, 'F');
  doc.setTextColor(250, 248, 245);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('CropSense', margin, 42);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Agricultural Intelligence & Crop Health Report', margin, 62);

  y = 116;
  doc.setTextColor(45, 58, 46);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  const titleLines = doc.splitTextToSize(report.diseaseDetected, maxWidth);
  doc.text(titleLines, margin, y);
  y += titleLines.length * 20 + 8;

  doc.setDrawColor(218, 213, 203);
  doc.line(margin, y, pageWidth - margin, y);
  y += 20;

  // Metadata rows
  doc.setFontSize(10);
  const metaRows: [string, string][] = [
    ['Report Type', report.type === 'disease_analysis' ? 'Disease Analysis' : 'Historical Analysis'],
    ['Generated On', new Date(report.createdAt).toLocaleString('en-IN')],
    ['Location', report.location],
    ['Crop', `${report.crop} (${report.season})`],
    ['Farm Size', report.farmSizeLabel],
    ['Status', report.status],
  ];

  if (typeof report.confidence === 'number') {
    metaRows.push(['Detection Confidence', `${report.confidence}%`]);
  }
  if (report.severity) {
    metaRows.push(['Severity', report.severity]);
  }
  if (report.riskLevel) {
    metaRows.push(['Risk Level', report.riskLevel]);
  }

  for (const [label, value] of metaRows) {
    ensureSpace(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(119, 120, 111);
    doc.text(`${label}:`, margin, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(45, 58, 46);
    doc.text(String(value), margin + 135, y);
    y += 18;
  }

  const addSection = (heading: string, content: string | string[]) => {
    y += 10;
    ensureSpace(36);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(61, 90, 62);
    doc.text(heading, margin, y);
    y += 16;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(45, 58, 46);

    const items = Array.isArray(content) ? content : [content];
    for (const item of items) {
      const prefix = Array.isArray(content) ? '- ' : '';
      const lines = doc.splitTextToSize(`${prefix}${item}`, maxWidth);
      ensureSpace(lines.length * 14 + 6);
      doc.text(lines, margin, y);
      y += lines.length * 14 + 4;
    }
  };

  if (report.summary) {
    addSection('Analysis Summary', report.summary);
  }
  if (report.symptoms && report.symptoms.length > 0) {
    addSection('Visible Symptoms', report.symptoms);
  }
  if (report.causes && report.causes.length > 0) {
    addSection('Potential Causes', report.causes);
  }
  if (report.preventiveMeasures && report.preventiveMeasures.length > 0) {
    addSection('Preventive Measures', report.preventiveMeasures);
  }
  if (report.recommendations && report.recommendations.length > 0) {
    addSection('Recommendations & Next Steps', report.recommendations);
  }
  if (report.whenToSeekExpert) {
    addSection('When to Seek Expert Assistance', report.whenToSeekExpert);
  }

  if (report.disclaimer) {
    y += 12;
    ensureSpace(40);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);
    doc.setTextColor(119, 120, 111);
    const discLines = doc.splitTextToSize(`Disclaimer: ${report.disclaimer}`, maxWidth);
    doc.text(discLines, margin, y);
  }

  const safeCrop = report.crop.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const dateStamp = new Date(report.createdAt).toISOString().slice(0, 10);
  doc.save(`cropsense-${safeCrop}-report-${dateStamp}.pdf`);
}
