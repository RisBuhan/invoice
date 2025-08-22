import Toolbar from './components/Toolbar'
import InvoiceEditor from './components/InvoiceEditor'
import Preview from './components/Preview'
import InvoiceList from './components/InvoiceList'
import { useInvoiceStore } from './store/invoiceStore'

function App() {
	const showList = useInvoiceStore((s) => s.ui.showList)

	return (
		<div className="max-w-6xl mx-auto px-4 py-8">
			<header className="mb-6 flex items-center justify-between">
				<h1 className="text-2xl font-bold tracking-tight">Invoice Forge</h1>
				<Toolbar />
			</header>
			<main className="grid gap-4 md:grid-cols-2">
				<section className="rounded-xl border border-gray-200/70 bg-white/70 p-4 shadow-sm dark:bg-gray-900/60 dark:border-gray-800">
					<InvoiceEditor />
				</section>
				<section className="rounded-xl border border-gray-200/70 bg-white/70 p-4 shadow-sm dark:bg-gray-900/60 dark:border-gray-800">
					<Preview />
				</section>
			</main>
			{showList && <InvoiceList />}
		</div>
	)
}

export default App
