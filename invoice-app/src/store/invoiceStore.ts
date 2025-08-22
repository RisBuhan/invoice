import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Invoice, InvoiceItem, ThemeName } from '../types'
import { generateId } from '../utils/id'
import { calculateInvoiceTotals } from '../utils/totals'

interface UIState {
	showList: boolean
}

interface InvoiceState {
	invoices: Invoice[]
	current: Invoice
	ui: UIState
	// derived
	getTotals: () => ReturnType<typeof calculateInvoiceTotals>
	// actions
	createNew: () => void
	saveCurrent: () => void
	loadInvoice: (id: string) => void
	deleteInvoice: (id: string) => void
	duplicateInvoice: (id: string) => void
	updateField: <K extends keyof Invoice>(key: K, value: Invoice[K]) => void
	addItem: () => void
	updateItem: (id: string, patch: Partial<InvoiceItem>) => void
	removeItem: (id: string) => void
	setLogoDataUrl: (dataUrl?: string) => void
	setTheme: (theme: ThemeName) => void
	setShowList: (open: boolean) => void
}

function defaultInvoice(): Invoice {
	return {
		id: generateId('inv'),
		number: nextInvoiceNumber(),
		dateISO: new Date().toISOString(),
		from: { name: 'Your Company', address: '', email: '', phone: '' },
		billTo: { name: 'Client Name', address: '', email: '' },
		items: [
			{ id: generateId('item'), description: 'Service description', quantity: 1, unitPrice: 100 },
		],
		discountPercent: 0,
		taxPercent: 0,
		notes: '',
		currency: 'USD',
		locale: undefined,
		theme: 'classic',
		logoDataUrl: undefined,
	}
}

function nextInvoiceNumber(): string {
	const now = new Date()
	const yyyy = now.getFullYear().toString().slice(-2)
	const mm = String(now.getMonth() + 1).padStart(2, '0')
	const dd = String(now.getDate()).padStart(2, '0')
	return `${yyyy}${mm}${dd}-${Math.floor(Math.random() * 900 + 100)}`
}

export const useInvoiceStore = create<InvoiceState>()(
	persist(
		(set, get) => ({
			invoices: [],
			current: defaultInvoice(),
			ui: { showList: false },
			getTotals: () => calculateInvoiceTotals(get().current),
			createNew: () => set({ current: defaultInvoice() }),
			saveCurrent: () => {
				const { current, invoices } = get()
				const idx = invoices.findIndex((i) => i.id === current.id)
				if (idx >= 0) {
					const updated = invoices.slice()
					updated[idx] = current
					set({ invoices: updated })
				} else {
					set({ invoices: [{ ...current }, ...invoices] })
				}
			},
			loadInvoice: (id) => {
				const inv = get().invoices.find((i) => i.id === id)
				if (inv) set({ current: { ...inv } })
			},
			deleteInvoice: (id) => set({ invoices: get().invoices.filter((i) => i.id !== id) }),
			duplicateInvoice: (id) => {
				const inv = get().invoices.find((i) => i.id === id)
				if (!inv) return
				const copy: Invoice = { ...inv, id: generateId('inv'), number: nextInvoiceNumber(), dateISO: new Date().toISOString() }
				set({ invoices: [copy, ...get().invoices] })
			},
			updateField: (key, value) => set({ current: { ...get().current, [key]: value } as Invoice }),
			addItem: () => set({ current: { ...get().current, items: [...get().current.items, { id: generateId('item'), description: '', quantity: 1, unitPrice: 0 }] } }),
			updateItem: (id, patch) => set({
				current: {
					...get().current,
					items: get().current.items.map((it) => (it.id === id ? { ...it, ...patch } : it)),
				},
			}),
			removeItem: (id) => set({ current: { ...get().current, items: get().current.items.filter((it) => it.id !== id) } }),
			setLogoDataUrl: (dataUrl) => set({ current: { ...get().current, logoDataUrl: dataUrl } }),
			setTheme: (theme) => set({ current: { ...get().current, theme } }),
			setShowList: (open) => set({ ui: { ...get().ui, showList: open } }),
		}),
		{ name: 'invoice-forge-store' }
	)
)