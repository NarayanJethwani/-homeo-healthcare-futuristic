"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Printer, ArrowLeft, Check, Copy, Download, Send, Link } from "lucide-react";
import Image from "next/image";

interface InvoiceItem {
  description: string;
  qty: number;
  unitPrice: number;
  amount: number;
}

function InvoiceContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [copied, setCopied] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState("/images/logo.png");
  const [qrCodeUrl, setQrCodeUrl] = useState("/images/payment-qr.jpg");

  useEffect(() => {
    setLogoUrl(window.location.origin + "/images/logo.png");
    setQrCodeUrl(window.location.origin + "/images/payment-qr.jpg");
  }, []);

  // Extract invoice parameters from query string
  const invoiceNo = searchParams.get("invoiceNo") || "INV-TEMP-999";
  const date = searchParams.get("date") || new Date().toLocaleDateString("en-IN");
  const dueDate = searchParams.get("dueDate") || new Date().toLocaleDateString("en-IN");
  const patientId = searchParams.get("patientId") || "P-MOCK";
  const patientName = searchParams.get("patientName") || "Patient Name";
  const patientPhone = searchParams.get("patientPhone") || "N/A";
  const patientEmail = searchParams.get("patientEmail") || "";
  const patientAddress = searchParams.get("patientAddress") || "Baner, Pune, Maharashtra";
  const subtotal = Number(searchParams.get("subtotal") || 0);
  const discount = Number(searchParams.get("discount") || 0);
  const grandTotal = Number(searchParams.get("grandTotal") || 0);
  const paymentMode = searchParams.get("paymentMode") || "UPI";
  const status = searchParams.get("status") || "Paid";

  const rawItems = searchParams.get("items");
  let items: InvoiceItem[] = [];
  try {
    if (rawItems) {
      items = JSON.parse(decodeURIComponent(rawItems));
    }
  } catch (e) {
    console.error("Failed to parse invoice items:", e);
  }

  // Fallback if empty items list
  if (items.length === 0) {
    items = [{ description: "General Homeopathic Treatment Fee", qty: 1, unitPrice: grandTotal, amount: grandTotal }];
  }

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById("invoice-sheet");
    if (!element) return;

    const opt = {
      margin:       [0.4, 0.4, 0.4, 0.4],
      filename:     `Invoice-${invoiceNo}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2.5, useCORS: true, logging: false },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    const runHtml2Pdf = () => {
      // @ts-ignore
      window.html2pdf().from(element).set(opt).save();
    };

    // @ts-ignore
    if (window.html2pdf) {
      runHtml2Pdf();
    } else {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
      script.onload = runHtml2Pdf;
      document.body.appendChild(script);
    }
  };

  const handleWhatsAppShare = () => {
    const message = `Dear ${patientName},
    
Hope you are doing well. Please find below the invoice summary from *Homeo Healthcare*:

*Invoice No:* ${invoiceNo}
*Date:* ${date}
*Grand Total:* ₹${grandTotal.toLocaleString("en-IN")}
*Status:* ${status}

*Clinic Bank Details (HDFC Bank):*
Account Name: Dr. Narayan Jethwani
Current Account No: 50200039742057
IFSC Code: HDFC0004793
Branch: PAN Card Club Road Baner, Pune
Instant UPI ID: 8446056789@hdfc
(Please include your Patient ID or Invoice No in theRemarks)

*View / Download Invoice PDF:*
${window.location.href}

Wishing you good health.

Warm regards,
Dr. Narayan Jethwani, MD (Hom.)
Homeo Healthcare`;

    const encodedText = encodeURIComponent(message);
    const rawPhone = patientPhone || "";
    const phone = rawPhone.replace(/\D/g, "");
    const targetPhone = phone.length === 10 ? `91${phone}` : phone;
    
    window.open(`https://wa.me/${targetPhone}?text=${encodedText}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 print:bg-white print:py-0 print:px-0">
      
      {/* Control Bar (hidden during printing) */}
      <div className="max-w-4xl mx-auto mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <button
          onClick={() => router.push("/admin/dashboard")}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm cursor-pointer w-full sm:w-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Portal</span>
        </button>

        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 w-full sm:w-auto">
          {/* Copy Link */}
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert("Invoice link copied to clipboard!");
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-800 dark:hover:border-slate-350 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all shadow-sm cursor-pointer"
            title="Copy digital invoice link"
          >
            <Link className="w-3.5 h-3.5" />
            <span>Copy Link</span>
          </button>

          {/* Share on WhatsApp */}
          <button
            onClick={handleWhatsAppShare}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
            title="Share digital invoice on WhatsApp"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Invoice</span>
          </button>

          {/* Download PDF */}
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
            title="Download PDF directly"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>

          {/* Print */}
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#0f766e] hover:bg-[#0d645d] text-white text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Invoice Sheet */}
      <div id="invoice-sheet" className="max-w-4xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[24px] p-8 md:p-12 shadow-md print:shadow-none print:border-none print:bg-white print:text-slate-900 print:p-0 print:rounded-none">
        
        {/* Invoice Header (Clinic Info & Title) */}
        <div className="flex flex-col md:flex-row md:justify-between items-start gap-6 border-b border-slate-100 dark:border-slate-800 print:border-slate-100 pb-8">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 overflow-hidden shadow-sm flex items-center justify-center flex-shrink-0">
                <Image
                  src={logoUrl}
                  alt="Homeo Healthcare Logo"
                  width={32}
                  height={32}
                  className="object-contain p-0.5"
                />
              </div>
              <h1 className="text-xl font-black text-slate-900 dark:text-slate-100 print:text-slate-900 tracking-tight">
                Homeo Healthcare
              </h1>
            </div>
            <p className="text-xs text-[#0f766e] font-bold mt-1.5 uppercase tracking-wide">
              Dr. Narayan Jethwani, MD (Hom.)
            </p>
            <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 print:text-slate-500 max-w-sm mt-1 leading-relaxed">
              Consulting Homeopathic Physician & Clinical Specialist<br />
              Office 404, 4th Floor, Pyramid Axis, Baner Road, Behind Croma Showroom, Baner, Pune – 411045<br />
              Phone: +91 84460 56789 | narayan.jethwani@gmail.com
            </p>
          </div>
          
          <div className="text-left md:text-right space-y-1 md:self-end">
            <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 print:text-slate-800 tracking-tight uppercase">Invoice</h2>
            <div className="text-xs font-semibold text-slate-600 dark:text-slate-300 print:text-slate-600">
              <span className="text-slate-400 dark:text-slate-500 print:text-slate-400">Invoice No:</span> <strong className="text-slate-900 dark:text-slate-100 print:text-slate-900">{invoiceNo}</strong>
            </div>
            <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 print:text-slate-500 uppercase tracking-wider">
              Date: {date}
            </div>
          </div>
        </div>

        {/* Invoice Meta Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-b border-slate-100 dark:border-slate-800 print:border-slate-100 text-xs">
          
          {/* Bill To */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-black text-[#0f766e] dark:text-[#14b8a6] print:text-[#0f766e] uppercase tracking-widest">Billing Info</h4>
            <div className="font-extrabold text-slate-900 dark:text-slate-100 print:text-slate-900 text-sm">{patientName}</div>
            <div className="text-slate-600 dark:text-slate-300 print:text-slate-600 font-medium">
              <div><span className="text-slate-400 dark:text-slate-500 print:text-slate-400">Patient ID:</span> <span className="text-slate-900 dark:text-slate-100 print:text-slate-900">{patientId}</span></div>
              <div><span className="text-slate-400 dark:text-slate-500 print:text-slate-400">WhatsApp:</span> <span className="text-slate-900 dark:text-slate-100 print:text-slate-900">{patientPhone}</span></div>
              {patientEmail && <div><span className="text-slate-400 dark:text-slate-500 print:text-slate-400">Email:</span> <span className="text-slate-900 dark:text-slate-100 print:text-slate-900">{patientEmail}</span></div>}
              {patientAddress && (
                <div className="max-w-xs mt-1.5">
                  <span className="text-slate-400 dark:text-slate-500 print:text-slate-400 block mb-0.5">Shipping Address:</span>
                  <p className="leading-relaxed bg-slate-50 dark:bg-slate-950/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 print:bg-slate-50 print:border-slate-100">{patientAddress}</p>
                </div>
              )}
            </div>
          </div>

          {/* Payment info */}
          <div className="space-y-2 md:text-right md:flex md:flex-col md:items-end">
            <div className="w-full">
              <h4 className="text-[10px] font-black text-[#0f766e] dark:text-[#14b8a6] print:text-[#0f766e] uppercase tracking-widest mb-2">Payment Details</h4>
              <div className="space-y-1.5 text-slate-600 dark:text-slate-300 print:text-slate-600 font-medium md:flex md:flex-col md:items-end">
                <div>
                  <span className="text-slate-400 dark:text-slate-500 print:text-slate-400">Payment Status: </span>
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                    status === "Paid" 
                      ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 print:bg-emerald-50 print:text-emerald-700 print:border-emerald-200" 
                      : status === "Pending" 
                        ? "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800 print:bg-amber-50 print:text-amber-700 print:border-amber-200" 
                        : "bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800 print:bg-rose-50 print:text-rose-700 print:border-rose-200"
                  }`}>
                    {status}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500 print:text-slate-400">Due Date: </span>
                  <strong className="text-slate-800 dark:text-slate-100 print:text-slate-800">{dueDate}</strong>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500 print:text-slate-400">Payment Mode: </span>
                  <strong className="text-slate-800 dark:text-slate-100 print:text-slate-800 uppercase">{paymentMode}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Items Table */}
        <div className="py-8">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 print:border-slate-200 text-[10px] font-black text-slate-500 dark:text-slate-400 print:text-slate-500 uppercase tracking-widest">
                <th className="py-3 w-16">Sl No</th>
                <th className="py-3">Description</th>
                <th className="py-3 w-20 text-center">Qty</th>
                <th className="py-3 w-32 text-right">Unit Price</th>
                <th className="py-3 w-32 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 print:divide-slate-100 text-xs font-semibold text-slate-700 dark:text-slate-300 print:text-slate-755">
              {items.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 print:hover:bg-transparent">
                  <td className="py-4 text-slate-400 dark:text-slate-500 print:text-slate-400">{idx + 1}</td>
                  <td className="py-4 text-slate-900 dark:text-slate-100 print:text-slate-900 font-bold">{item.description}</td>
                  <td className="py-4 text-center text-slate-600 dark:text-slate-350 print:text-slate-600">{item.qty}</td>
                  <td className="py-4 text-right text-slate-600 dark:text-slate-350 print:text-slate-600">₹{item.unitPrice.toLocaleString("en-IN")}</td>
                  <td className="py-4 text-right text-slate-950 dark:text-slate-50 print:text-slate-950 font-extrabold">₹{item.amount.toLocaleString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Invoice Summary Totals */}
        <div className="flex flex-col md:flex-row md:justify-between items-start gap-8 pt-6 border-t border-slate-100 dark:border-slate-800 print:border-slate-100 text-xs">
          
          {/* Note / Terms */}
          <div className="max-w-md bg-slate-50 dark:bg-slate-950/40 p-4.5 rounded-2xl border border-slate-100 dark:border-slate-800 print:bg-slate-50 print:border-slate-100 text-[10px] text-slate-500 dark:text-slate-400 print:text-slate-500 leading-relaxed font-semibold">
            <span className="text-slate-800 dark:text-slate-200 print:text-slate-800 font-bold block mb-1">Invoice Notes & Terms:</span>
            Includes initial constitutional consultation matching, medicine compounding, courier shipping, and priority Whatsapp tracking. Standard follow-ups are reviews every fortnightly.
          </div>

          {/* Totals Box */}
          <div className="w-full md:w-80 space-y-2.5 text-right font-semibold text-slate-700 dark:text-slate-300 print:text-slate-700">
            <div className="flex justify-between">
              <span className="text-slate-400 dark:text-slate-500 print:text-slate-400">Subtotal:</span>
              <span className="text-slate-900 dark:text-slate-100 print:text-slate-900">₹{subtotal.toLocaleString("en-IN")}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400 print:text-emerald-600">
                <span className="text-slate-400 dark:text-slate-500 print:text-slate-400">Discount Applied:</span>
                <span>-₹{discount.toLocaleString("en-IN")}</span>
              </div>
            )}
            <div className="flex justify-between items-center border-t-2 border-[#0f766e]/20 dark:border-slate-850 pt-3 text-sm font-black text-slate-900 dark:text-slate-100 bg-[#0f766e]/[0.02] dark:bg-[#0f766e]/5 p-3.5 rounded-xl border border-[#0f766e]/10 dark:border-[#0f766e]/20 print:bg-[#0f766e]/[0.02] print:border-[#0f766e]/10">
              <span className="text-[#0f766e] dark:text-[#14b8a6] print:text-[#0f766e] uppercase tracking-wider text-[10px]">Grand Total</span>
              <span className="text-[#0f766e] dark:text-[#14b8a6] print:text-[#0f766e] text-base font-black">₹{grandTotal.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>

        {/* Bank Instructions (Unified with dashboard detail) */}
        <div className="mt-12 p-6 rounded-3xl border border-[#0f766e]/15 dark:border-[#0f766e]/30 bg-[#0f766e]/[0.02] dark:bg-[#0f766e]/5 print:bg-[#0f766e]/[0.02] print:border-[#0f766e]/15 text-xs">
          <h4 className="text-[10px] font-black text-[#0f766e] dark:text-[#14b8a6] print:text-[#0f766e] uppercase tracking-widest mb-3 border-b border-[#0f766e]/10 dark:border-[#0f766e]/20 print:border-[#0f766e]/10 pb-2">
            Clinical Payment Instructions
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-slate-700 dark:text-slate-350 print:text-slate-700 font-semibold">
            <div className="space-y-1">
              <span className="text-[9px] text-slate-400 dark:text-slate-500 print:text-slate-400 font-bold uppercase tracking-wider block">NEFT/IMPS Current Account</span>
              <div className="text-slate-900 dark:text-slate-100 print:text-slate-900 font-extrabold flex items-center justify-between">
                <span>HDFC Bank (PAN Card Club Rd, Baner)</span>
              </div>
              <div className="flex items-center justify-between bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 print:bg-white print:border-slate-100 p-1.5 px-2.5 rounded-lg">
                <span className="font-black text-slate-900 dark:text-slate-100 print:text-slate-900 select-all">50200039742057</span>
                <button 
                  onClick={() => handleCopyText("50200039742057", "acc")}
                  className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400 dark:text-slate-500 cursor-pointer"
                >
                  {copied === "acc" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className="flex items-center justify-between bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 print:bg-white print:border-slate-100 p-1.5 px-2.5 rounded-lg mt-1.5">
                <span className="text-slate-950 dark:text-slate-50 print:text-slate-950 font-bold select-all">IFSC: HDFC0004793</span>
                <button 
                  onClick={() => handleCopyText("HDFC0004793", "ifsc")}
                  className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400 dark:text-slate-500 cursor-pointer"
                >
                  {copied === "ifsc" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] text-slate-400 dark:text-slate-500 print:text-slate-400 font-bold uppercase tracking-wider block">UPI / QR Transfer Address</span>
              <div className="text-slate-900 dark:text-slate-100 print:text-slate-900 font-extrabold mb-1">Instant UPI Transfer</div>
              <div className="flex items-center justify-between bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 print:bg-white print:border-slate-100 p-1.5 px-2.5 rounded-lg">
                <span className="font-black text-slate-900 dark:text-slate-100 print:text-slate-900 select-all">8446056789@hdfc</span>
                <button 
                  onClick={() => handleCopyText("8446056789@hdfc", "upi")}
                  className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400 dark:text-slate-500 cursor-pointer"
                >
                  {copied === "upi" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className="pt-2 flex justify-center sm:justify-start">
                <div className="bg-white p-1.5 rounded-xl border border-slate-100 print:border-slate-200 shadow-sm inline-block">
                  <Image
                    src={qrCodeUrl}
                    alt="HDFC Payment QR Code"
                    width={100}
                    height={100}
                    unoptimized
                    className="w-24 h-24 object-contain"
                  />
                </div>
              </div>
              <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 font-medium">
                Note: Please mention <strong>Patient ID ({patientId})</strong> or <strong>Invoice No ({invoiceNo})</strong> inside transfer remarks.
              </div>
            </div>
          </div>
        </div>

        {/* Footer closing line */}
        <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800 print:border-slate-100 text-center text-[10px] text-slate-400 dark:text-slate-500 print:text-slate-400 font-bold uppercase tracking-wider">
          Thank you for choosing Homeo Healthcare. Wishing you constitutional health & happiness.
        </div>
      </div>
    </div>
  );
}

export default function InvoicePreviewPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-slate-500">Loading Invoice Preview...</div>}>
      <InvoiceContent />
    </Suspense>
  );
}
