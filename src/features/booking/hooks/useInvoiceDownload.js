import { useState, useCallback } from 'react';
import { useErrorHandler } from '@/shared/services/error';
import { bookingService } from '../services/bookingService';

/**
 * useInvoiceDownload
 *
 * Handles fetching invoice data from the API and rendering it
 * as a printable HTML document in a new browser window.
 */
export function useInvoiceDownload() {
  const { handleApiError } = useErrorHandler();
  const [invoiceLoadingMap, setInvoiceLoadingMap] = useState({});

  const handleDownloadInvoice = useCallback(async (appointmentId) => {
    if (!appointmentId) {
return;
}

    setInvoiceLoadingMap((prev) => ({ ...prev, [appointmentId]: true }));
    try {
      const payload = await bookingService.getInvoice(appointmentId);
      const invoice = payload?.data ?? payload?.invoice ?? payload;
      if (!invoice) {
throw new Error('Invoice not found');
}

      const billTo = invoice.bill_to || {};
      const item = invoice.item || {};
      const status = invoice.status || 'PAID';

      const items = [
        {
          description: item.name || 'Consultation Service',
          hsn: item.hsn_sac || '9983',
          duration: item.duration ? `${item.duration} Minutes` : '30 Minutes',
          quantity: item.quantity || 1,
          rate: item.base_price || 0,
          amount: invoice.sub_total || 0,
        },
      ];

      const formatINR = (n) =>
        Number(n || 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR' });

      const html = buildInvoiceHtml({ invoice, billTo, items, status, formatINR });

      const w = window.open('', '_blank', 'noopener,noreferrer');
      if (!w) {
throw new Error('Pop-up blocked. Please allow pop-ups to download invoice.');
}
      w.document.open();
      w.document.write(html);
      w.document.close();
    } catch (err) {
      handleApiError(err, { context: { feature: 'booking', action: 'downloadInvoice' } });
    } finally {
      setInvoiceLoadingMap((prev) => ({ ...prev, [appointmentId]: false }));
    }
  }, [handleApiError]);

  return { invoiceLoadingMap, handleDownloadInvoice };
}

function buildInvoiceHtml({ invoice, billTo, items, status, formatINR }) {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8"/>
    <title>Invoice ${invoice.invoice_number || ''}</title>
    <style>
      body { font-family: Arial, sans-serif; padding: 24px; color:#111; }
      .header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 16px; }
      .title { font-size: 22px; font-weight: 700; color: #4f46e5; text-align:center; margin: 8px 0 16px; }
      .muted { color:#6b7280; font-size: 12px; }
      .box { border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; }
      table { width:100%; border-collapse: collapse; margin-top: 12px; }
      th, td { border-bottom: 1px solid #e5e7eb; padding: 10px 8px; font-size: 12px; }
      th { background: #908ce4; color:#fff; text-align:left; }
      .row-right { text-align:right; }
      .status-paid { color: #16a34a; font-weight:700; }
      .status-cancelled { color: #ef4444; font-weight:700; }
      .footer { margin-top: 18px; display:flex; justify-content: space-between; gap: 16px; }
      .signature { text-align:right; }
    </style>
  </head>
  <body>
    <div class="header">
      <div>
        <div style="font-size:18px;font-weight:700;">Vishvara Tech India Pvt.Ltd</div>
        <div class="muted">Tax Invoice</div>
      </div>
      <div class="muted" style="text-align:right;">
        <div><b>Invoice No:</b> ${invoice.invoice_number || ''}</div>
        <div><b>Booking ID:</b> ${invoice.appointment_id || ''}</div>
        <div><b>Date:</b> ${invoice.createdAt ? new Date(invoice.createdAt).toLocaleDateString('en-IN') : ''}</div>
        <div><b>Status:</b> <span class="${status === 'PAID' ? 'status-paid' : 'status-cancelled'}">${status}</span></div>
      </div>
    </div>

    <div class="title">Tax Invoice</div>

    <div class="box">
      <div style="display:flex; justify-content:space-between; gap:16px;">
        <div>
          <div style="font-weight:700; font-size: 13px; margin-bottom: 6px;">Bill To</div>
          <div><b>${billTo.name || ''}</b></div>
          <div class="muted">${billTo.address || ''}</div>
          <div class="muted">${billTo.city || ''} ${billTo.state_name || billTo.state_code || ''}</div>
        </div>
        <div style="text-align:right;">
          <div style="font-weight:700; font-size: 13px; margin-bottom: 6px;">Customer</div>
          <div class="muted">Phone: ${billTo.contact || ''}</div>
          <div class="muted">GSTIN: ${billTo.gst_number || ''}</div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th style="width:5%;">#</th>
            <th>Description</th>
            <th style="width:18%;">HSN/SAC</th>
            <th style="width:18%;">Time</th>
            <th style="width:10%;" class="row-right">Qty</th>
            <th style="width:18%;" class="row-right">Rate</th>
            <th style="width:18%;" class="row-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${items
            .map(
              (it, idx) => `
            <tr>
              <td>${idx + 1}</td>
              <td style="font-weight:700;">${it.description}</td>
              <td>${it.hsn}</td>
              <td>${it.duration}</td>
              <td class="row-right">${it.quantity}</td>
              <td class="row-right">${formatINR(it.rate)}</td>
              <td class="row-right">${formatINR(it.amount)}</td>
            </tr>
          `,
            )
            .join('')}
        </tbody>
      </table>

      <div class="footer">
        <div>
          <div style="font-weight:700; margin-bottom: 6px;">Amount in Words</div>
          <div class="muted">${invoice.amount_in_words || ''}</div>
        </div>
        <div class="signature">
          <div class="muted" style="margin-bottom: 6px;">Total</div>
          <div style="font-size: 16px; font-weight:700;">${formatINR(invoice.total_amount || 0)}</div>
        </div>
      </div>
    </div>

    <script>
      setTimeout(() => window.print(), 350);
    </script>
  </body>
</html>`;
}
