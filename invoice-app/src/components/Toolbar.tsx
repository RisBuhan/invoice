import { Plus, Save, FileDown, List, Image as ImageIcon } from 'lucide-react'
import { useInvoiceStore } from '../store/invoiceStore'
import { exportInvoiceToPdf } from '../utils/pdf'

export default function Toolbar() {
	const current = useInvoiceStore((s) => s.current)
	const createNew = useInvoiceStore((s) => s.createNew)
	const saveCurrent = useInvoiceStore((s) => s.saveCurrent)
	const setShowList = useInvoiceStore((s) => s.setShowList)
	const setLogoDataUrl = useInvoiceStore((s) => s.setLogoDataUrl)

	async function handleExport() {
		await exportInvoiceToPdf(current)
	}

	function onLogoSelected(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0]
		if (!file) return
		const reader = new FileReader()
		reader.onload = () => setLogoDataUrl(reader.result as string)
		reader.readAsDataURL(file)
	}

	return (
		<div className="flex flex-wrap items-center gap-2">
			<button className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700" onClick={createNew}>
				<Plus size={16} /> New
			</button>
			<button className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-3 py-2 text-sm font-semibold text-white hover:bg-black/80 dark:bg-gray-800" onClick={saveCurrent}>
				<Save size={16} /> Save
			</button>
			<button className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700" onClick={handleExport}>
				<FileDown size={16} /> Export PDF
			</button>
			<button className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800" onClick={() => setShowList(true)}>
				<List size={16} /> Invoices
			</button>
			<label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
				<ImageIcon size={16} /> Logo
				<input type="file" accept="image/*" onChange={onLogoSelected} className="hidden" />
			</label>
		</div>
	)
}