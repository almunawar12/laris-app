import { usePage } from "@inertiajs/react";

export default function InvoiceDownload({ transaction }) {
    const { appSettings } = usePage().props;
    const fmt = (n) => new Intl.NumberFormat("id-ID").format(n);
    const fmtDate = (d) =>
        new Date(d).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });

    const storeName = appSettings?.store_name ?? "Kedai UMK Laris";
    const storeAddress = appSettings?.store_address ?? "";
    const storePhone = appSettings?.store_phone ?? "";
    const logoUrl = appSettings?.logo_url ?? null;

    const handlePrint = () => {
        const items = transaction.transaction_items ?? transaction.transactionItems ?? [];
        const html = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8" />
<title>Invoice ${transaction.invoice_code}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Courier New', monospace; font-size: 12px; color: #1e293b; background: #fff; padding: 24px; max-width: 320px; margin: auto; }
  .center { text-align: center; }
  .bold { font-weight: 700; }
  .divider { border: none; border-top: 1px dashed #94a3b8; margin: 10px 0; }
  .divider-solid { border: none; border-top: 2px solid #1e293b; margin: 10px 0; }
  .store-name { font-size: 18px; font-weight: 900; letter-spacing: 1px; margin-bottom: 2px; }
  .invoice-no { font-size: 11px; color: #64748b; }
  table { width: 100%; border-collapse: collapse; margin: 8px 0; }
  td { padding: 3px 0; vertical-align: top; }
  td.right { text-align: right; }
  td.label { color: #64748b; width: 40%; }
  .item-name { font-weight: 600; }
  .item-qty { color: #64748b; font-size: 11px; }
  .total-row td { font-size: 14px; font-weight: 900; padding-top: 6px; }
  .footer { margin-top: 16px; font-size: 10px; color: #94a3b8; }
  .badge { display: inline-block; background: #dcfce7; color: #16a34a; padding: 2px 8px; border-radius: 999px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
  .store-logo { width: 64px; height: 64px; object-fit: contain; margin: 0 auto 8px; display: block; }
  @media print {
    body { padding: 0; }
    button { display: none; }
  }
</style>
</head>
<body>
<div class="center">
  ${logoUrl ? `<img src="${logoUrl}" alt="Logo" class="store-logo" />` : ""}
  <div class="store-name">${storeName.toUpperCase()}</div>
  ${storeAddress ? `<div style="font-size:10px;color:#64748b;margin-top:2px;">${storeAddress}</div>` : ""}
  ${storePhone ? `<div style="font-size:10px;color:#64748b;">Telp: ${storePhone}</div>` : ""}
  <div class="invoice-no" style="margin-top:6px;">${transaction.invoice_code}</div>
  <div style="font-size:10px;color:#94a3b8;margin-top:4px;">${fmtDate(transaction.transaction_date ?? transaction.created_at)}</div>
</div>

<hr class="divider-solid" style="margin-top:12px;" />

<table>
  <tr>
    <td class="label">Kasir</td>
    <td>${transaction.user?.name ?? "-"}</td>
  </tr>
  <tr>
    <td class="label">Pelanggan</td>
    <td>${transaction.customer?.name ?? "Umum"}</td>
  </tr>
  <tr>
    <td class="label">Pembayaran</td>
    <td class="bold" style="text-transform:uppercase;">${transaction.payment_method}</td>
  </tr>
</table>

<hr class="divider" />

<table>
  <thead>
    <tr>
      <td class="bold">Item</td>
      <td class="bold right">Subtotal</td>
    </tr>
  </thead>
  <tbody>
    ${items.map((item) => `
    <tr>
      <td>
        <div class="item-name">${item.product?.name ?? "-"}</div>
        <div class="item-qty">${item.quantity} × Rp ${fmt(item.price)}</div>
      </td>
      <td class="right bold">Rp ${fmt(item.subtotal)}</td>
    </tr>`).join("")}
  </tbody>
</table>

<hr class="divider" />

<table>
  <tr>
    <td class="label">Total</td>
    <td class="right bold">Rp ${fmt(transaction.total_price)}</td>
  </tr>
  <tr>
    <td class="label">Bayar</td>
    <td class="right">Rp ${fmt(transaction.total_paid)}</td>
  </tr>
  <tr>
    <td class="label">Kembalian</td>
    <td class="right bold">Rp ${fmt(transaction.change)}</td>
  </tr>
</table>

<hr class="divider-solid" />

<div class="center" style="margin-top:12px;">
  <span class="badge">Lunas</span>
  <div class="footer" style="margin-top:10px;">Terima kasih telah berbelanja!<br/>Barang yang sudah dibeli tidak dapat dikembalikan.</div>
</div>
</body>
</html>`;

        const win = window.open("", "_blank", "width=400,height=600");
        win.document.write(html);
        win.document.close();
        win.focus();
        setTimeout(() => win.print(), 300);
    };

    return (
        <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold rounded-xl shadow-sm shadow-primary-600/20 transition-all active:scale-95"
        >
            <span className="material-symbols-outlined text-lg">download</span>
            Download Invoice
        </button>
    );
}
