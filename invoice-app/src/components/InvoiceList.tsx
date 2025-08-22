import { useInvoiceStore } from '../store/invoiceStore'
import { formatCurrency, formatDateISO } from '../utils/currency'
import { calculateInvoiceTotals } from '../utils/totals'
import { X, Copy, Trash2, FolderOpen } from 'lucide-react'

export default function InvoiceList() {
	const invoices = useInvoiceStore((s) => s.invoices)
	const current = useInvoiceStore((s) => s.current)
	const loadInvoice = useInvoiceStore((s) => s.loadInvoice)
	const deleteInvoice = useInvoiceStore((s) => s.deleteInvoice)
	const duplicateInvoice = useInvoiceStore((s) => s.duplicateInvoice)
	const setShowList = useInvoiceStore((s) => s.setShowList)

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
			<div className="w-full max-w-2xl rounded-xl border border-gray-200 bg-white p-4 shadow-xl dark:border-gray-800 dark:bg-gray-900">
				<div className="mb-3 flex items-center justify-between">
					<h3 className="text-lg font-semibold">Invoices</h3>
					<button className="rounded-md border px-2 py-1 text-sm hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800" onClick={() => setShowList(false)}><X size={16} /></button>
				</div>
				<div className="max-h-[60vh] overflow-y-auto">
					<table className="w-full text-sm">
						<thead>
							<tr className="text-left text-gray-500">
								<th className="pb-2">Invoice</th>
								<th className="pb-2">Client</th>
								<th className="pb-2">Date</th>
								<th className="pb-2 text-right">Total</th>
								<th className="pb-2 text-right">Actions</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200 dark:divide-gray-800">
							{invoices.length === 0 && (
								<tr><td className="py-6 text-center text-gray-500" colSpan={5}>No invoices yet. Save one to see it here.</td></tr>
							)}
							{invoices.map((inv) => {
								const totals = calculateInvoiceTotals(inv)
								return (
									<tr key={inv.id} className={inv.id === current.id ? 'bg-indigo-50/50 dark:bg-indigo-950/20' : ''}>
										<td className="py-2 pr-2 font-medium">#{inv.number}</td>
										<td className="py-2 pr-2">{inv.billTo.name}</td>
										<td className="py-2 pr-2">{formatDateISO(inv.dateISO, inv.locale)}</td>
										<td className="py-2 pr-2 text-right">{formatCurrency(totals.total, inv.currency, inv.locale)}</td>
										<td className="py-2 text-right">
											<div className="inline-flex gap-2">
												<button className="inline-flex items-center gap-1 rounded-md border px-2 py-1 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800" onClick={() => loadInvoice(inv.id)}><FolderOpen size={14} /> Open</button>
												<button className="inline-flex items-center gap-1 rounded-md border px-2 py-1 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800" onClick={() => duplicateInvoice(inv.id)}><Copy size={14} /> Duplicate</button>
												<button className="inline-flex items-center gap-1 rounded-md border px-2 py-1 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800" onClick={() => deleteInvoice(inv.id)}><Trash2 size={14} /> Delete</button>
											</div>
										</td>
									</tr>
								)
							})}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	)
}