
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';

interface InvoiceItem {
  description: string;
  amount: number;
  originalPrice?: number;
}

interface InvoiceData {
  invoiceNumber: string;
  date: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  items: InvoiceItem[];
  total: number;
  companyName: string;
  companyAddress: string;
  discount?: number;
}

export const generateInvoicePDF = async (data: InvoiceData): Promise<Blob> => {
  const doc = new jsPDF();
  
  // Add company details
  doc.setFontSize(20);
  doc.text(data.companyName, 20, 20);
  doc.setFontSize(10);
  doc.text(data.companyAddress, 20, 30);
  
  // Add invoice title and number
  doc.setFontSize(16);
  doc.text(`INVOICE #${data.invoiceNumber}`, 150, 20, { align: 'right' });
  doc.setFontSize(10);
  doc.text(`Date: ${data.date}`, 150, 30, { align: 'right' });
  
  // Add customer details
  doc.setFontSize(12);
  doc.text('Bill To:', 20, 45);
  doc.setFontSize(10);
  doc.text(data.customerName, 20, 52);
  doc.text(data.customerAddress, 20, 59);
  doc.text(`Phone: ${data.customerPhone}`, 20, 66);
  
  // Add items table
  const tableColumn = ["Description", "Original Price (₹)", "Discount (₹)", "Amount (₹)"];
  const tableRows = data.items.map(item => [
    item.description,
    (item.originalPrice || 0).toString(),
    ((item.originalPrice || 0) - item.amount).toString(),
    item.amount.toString()
  ]);
  
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 75,
    theme: 'grid',
    styles: { fontSize: 9 },
    headStyles: { fillColor: [41, 128, 185] },
    margin: { top: 75 }
  });
  
  const finalY = (doc as any).lastAutoTable.finalY || 120;
  
  // Add totals
  doc.setFontSize(10);
  if (data.discount) {
    doc.text(`Subtotal: ₹${data.discount}`, 150, finalY + 15, { align: 'right' });
    doc.text(`Discount: ₹${data.discount}`, 150, finalY + 22, { align: 'right' });
  }
  
  doc.setFontSize(12);
  doc.text(`Total Amount: ₹${data.total}`, 150, finalY + 30, { align: 'right' });
  
  // Add payment status
  doc.setFontSize(14);
  doc.setTextColor(0, 128, 0);
  doc.text('PAID', 150, finalY + 40, { align: 'right' });
  doc.setTextColor(0, 0, 0);
  
  // Add footer
  doc.setFontSize(8);
  doc.text('Thank you for using our service!', 105, finalY + 50, { align: 'center' });
  doc.text('This is an automatically generated invoice.', 105, finalY + 55, { align: 'center' });
  
  return doc.output('blob');
};
