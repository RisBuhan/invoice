import { useInvoiceStore } from '../store/invoiceStore'
import type { InvoiceItem, ThemeName } from '../types'
import { X, PlusCircle } from 'lucide-react'

function NumberInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
	return <input {...props} type="number" className={`w-full rounded-md border border-gray-300 bg-white/80 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:bg-gray-900/60 dark:border-gray-700 ${props.className || ''}`} />
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
	return <input {...props} type={props.type || 'text'} className={`w-full rounded-md border border-gray-300 bg-white/80 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:bg-gray-900/60 dark:border-gray-700 ${props.className || ''}`} />
}

function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
	return <textarea {...props} className={`w-full rounded-md border border-gray-300 bg-white/80 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:bg-gray-900/60 dark:border-gray-700 ${props.className || ''}`} />
}

export default function InvoiceEditor() {
	const current = useInvoiceStore((s) => s.current)
	const updateField = useInvoiceStore((s) => s.updateField)
	const addItem = useInvoiceStore((s) => s.addItem)
	const updateItem = useInvoiceStore((s) => s.updateItem)
	const removeItem = useInvoiceStore((s) => s.removeItem)
	const setTheme = useInvoiceStore((s) => s.setTheme)

	function handleItemChange(id: string, key: keyof InvoiceItem, value: string) {
		if (key === 'quantity' || key === 'unitPrice') {
			const numeric = Number(value)
			updateItem(id, { [key]: isNaN(numeric) ? 0 : numeric } as Partial<InvoiceItem>)
		} else {
			updateItem(id, { [key]: value } as Partial<InvoiceItem>)
		}
	}

	return (
		<div className="space-y-6">
			<section className="space-y-3">
				<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
					<div>
						<label className="mb-1 block text-sm font-medium">From</label>
						<TextInput placeholder="Your Company" value={current.from.name} onChange={(e) => updateField('from', { ...current.from, name: e.target.value })} />
						<TextInput placeholder="Address" value={current.from.address} onChange={(e) => updateField('from', { ...current.from, address: e.target.value })} className="mt-2" />
						<div className="mt-2 grid grid-cols-2 gap-2">
							<TextInput placeholder="Email" value={current.from.email} onChange={(e) => updateField('from', { ...current.from, email: e.target.value })} />
							<TextInput placeholder="Phone" value={current.from.phone} onChange={(e) => updateField('from', { ...current.from, phone: e.target.value })} />
						</div>
					</div>
					<div>
						<label className="mb-1 block text-sm font-medium">Bill To</label>
						<TextInput placeholder="Client Name" value={current.billTo.name} onChange={(e) => updateField('billTo', { ...current.billTo, name: e.target.value })} />
						<TextInput placeholder="Address" value={current.billTo.address} onChange={(e) => updateField('billTo', { ...current.billTo, address: e.target.value })} className="mt-2" />
						<TextInput placeholder="Email" value={current.billTo.email} onChange={(e) => updateField('billTo', { ...current.billTo, email: e.target.value })} className="mt-2" />
					</div>
				</div>
				<div className="grid grid-cols-2 gap-3">
					<TextInput placeholder="Invoice #" value={current.number} onChange={(e) => updateField('number', e.target.value)} />
					<TextInput type="date" placeholder="Date" value={current.dateISO.slice(0,10)} onChange={(e) => updateField('dateISO', new Date(e.target.value).toISOString())} />
				</div>
				<div className="grid grid-cols-1 gap-3 md:grid-cols-3">
					<NumberInput placeholder="Discount %" value={current.discountPercent} onChange={(e) => updateField('discountPercent', Number(e.target.value) || 0)} />
					<NumberInput placeholder="Tax %" value={current.taxPercent} onChange={(e) => updateField('taxPercent', Number(e.target.value) || 0)} />
					<TextInput placeholder="Currency (e.g., USD, EUR)" value={current.currency} onChange={(e) => updateField('currency', e.target.value.toUpperCase())} />
				</div>
				<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
					<TextInput placeholder="Locale (auto)" value={current.locale || ''} onChange={(e) => updateField('locale', e.target.value || undefined)} />
					<select className="w-full rounded-md border border-gray-300 bg-white/80 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:bg-gray-900/60 dark:border-gray-700" value={current.theme} onChange={(e) => setTheme(e.target.value as ThemeName)}>
						<option value="classic">Classic</option>
						<option value="modern">Modern</option>
						<option value="elegant">Elegant</option>
					</select>
				</div>
			</section>

			<section>
				<div className="mb-2 flex items-center justify-between">
					<h3 className="text-sm font-medium">Items</h3>
					<button className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:underline" onClick={addItem}><PlusCircle size={16} /> Add item</button>
				</div>
				<div className="overflow-x-auto">
					<table className="w-full text-sm">
						<thead>
							<tr className="text-left text-gray-500">
								<th className="w-2/5 pb-2">Description</th>
								<th className="w-1/5 pb-2">Qty</th>
								<th className="w-1/5 pb-2">Unit Price</th>
								<th className="w-1/5 pb-2"></th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200/70 dark:divide-gray-800">
							{current.items.map((item) => (
								<tr key={item.id}>
									<td className="py-2 pr-2"><TextInput placeholder="Description" value={item.description} onChange={(e) => handleItemChange(item.id, 'description', e.target.value)} /></td>
									<td className="py-2 pr-2"><NumberInput step="1" min="0" value={item.quantity} onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)} /></td>
									<td className="py-2 pr-2"><NumberInput step="0.01" min="0" value={item.unitPrice} onChange={(e) => handleItemChange(item.id, 'unitPrice', e.target.value)} /></td>
									<td className="py-2 text-right">
										<button className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800" onClick={() => removeItem(item.id)}>
											<X size={14} /> Remove
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>

			<section>
				<label className="mb-1 block text-sm font-medium">Notes</label>
				<TextArea rows={4} placeholder="Additional notes or terms" value={current.notes} onChange={(e) => updateField('notes', e.target.value)} />
			</section>
		</div>
	)
}