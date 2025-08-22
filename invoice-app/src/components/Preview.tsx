import { useInvoiceStore } from '../store/invoiceStore'
import { calculateInvoiceTotals } from '../utils/totals'
import { formatCurrency, formatDateISO } from '../utils/currency'

export default function Preview() {
	const invoice = useInvoiceStore((s) => s.current)
	const totals = calculateInvoiceTotals(invoice)

	return (
		<div className="rounded-xl border border-gray-200/70 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
			<div className="mb-6 flex items-start justify-between">
				<div>
					<h2 className="text-xl font-semibold tracking-tight">Invoice #{invoice.number}</h2>
					<p className="text-sm text-gray-500">Date {formatDateISO(invoice.dateISO, invoice.locale)}</p>
				</div>
				{invoice.logoDataUrl ? (
					<img src={invoice.logoDataUrl} alt="Logo" className="h-12 w-auto rounded" />
				) : null}
			</div>

			<div className="mb-6 grid grid-cols-2 gap-6">
				<div>
					<p className="text-xs uppercase tracking-wide text-gray-500">From</p>
					<p className="font-medium">{invoice.from.name}</p>
					{invoice.from.address && <p className="text-sm text-gray-600">{invoice.from.address}</p>}
					{invoice.from.email && <p className="text-sm text-gray-600">{invoice.from.email}</p>}
					{invoice.from.phone && <p className="text-sm text-gray-600">{invoice.from.phone}</p>}
				</div>
				<div>
					<p className="text-xs uppercase tracking-wide text-gray-500">Bill To</p>
					<p className="font-medium">{invoice.billTo.name}</p>
					{invoice.billTo.address && <p className="text-sm text-gray-600">{invoice.billTo.address}</p>}
					{invoice.billTo.email && <p className="text-sm text-gray-600">{invoice.billTo.email}</p>}
				</div>
			</div>

			<table className="w-full text-sm">
				<thead>
					<tr className="border-b border-gray-200/70 text-left text-gray-500 dark:border-gray-800">
						<th className="py-2">Description</th>
						<th className="py-2 text-right">Qty</th>
						<th className="py-2 text-right">Unit</th>
						<th className="py-2 text-right">Amount</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-gray-100 dark:divide-gray-800">
					{invoice.items.map((it) => (
						<tr key={it.id}>
							<td className="py-2 pr-2">{it.description || '-'}</td>
							<td className="py-2 text-right">{it.quantity}</td>
							<td className="py-2 text-right">{formatCurrency(it.unitPrice, invoice.currency, invoice.locale)}</td>
							<td className="py-2 text-right">{formatCurrency(it.unitPrice * it.quantity, invoice.currency, invoice.locale)}</td>
						</tr>
					))}
				</tbody>
			</table>

			<div className="mt-6 space-y-1">
				<div className="flex justify-end gap-8 text-sm">
					<span className="text-gray-600">Subtotal</span>
					<span className="w-28 text-right">{formatCurrency(totals.subtotal, invoice.currency, invoice.locale)}</span>
				</div>
				<div className="flex justify-end gap-8 text-sm">
					<span className="text-gray-600">Discount ({invoice.discountPercent}%)</span>
					<span className="w-28 text-right">-{formatCurrency(totals.discountAmount, invoice.currency, invoice.locale)}</span>
				</div>
				<div className="flex justify-end gap-8 text-sm">
					<span className="text-gray-600">Tax ({invoice.taxPercent}%)</span>
					<span className="w-28 text-right">{formatCurrency(totals.taxAmount, invoice.currency, invoice.locale)}</span>
				</div>
				<div className="flex justify-end gap-8 border-t border-gray-200/70 pt-2 text-base font-semibold dark:border-gray-800">
					<span>Total</span>
					<span className="w-28 text-right">{formatCurrency(totals.total, invoice.currency, invoice.locale)}</span>
				</div>
			</div>

			{invoice.notes ? (
				<div className="mt-6">
					<p className="text-xs uppercase tracking-wide text-gray-500">Notes</p>
					<p className="text-sm text-gray-700 dark:text-gray-300">{invoice.notes}</p>
				</div>
			) : null}
		</div>
	)
}