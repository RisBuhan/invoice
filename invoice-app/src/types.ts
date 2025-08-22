export type ThemeName = 'classic' | 'modern' | 'elegant'

export interface PartyDetails {
	name: string
	address?: string
	email?: string
	phone?: string
}

export interface InvoiceItem {
	id: string
	description: string
	quantity: number
	unitPrice: number
}

export interface Invoice {
	id: string
	number: string
	dateISO: string
	dueDateISO?: string
	from: PartyDetails
	billTo: PartyDetails
	items: InvoiceItem[]
	discountPercent: number
	taxPercent: number
	notes?: string
	currency: string
	locale?: string
	theme: ThemeName
	logoDataUrl?: string
}

export interface InvoiceTotals {
	subtotal: number
	discountAmount: number
	taxAmount: number
	total: number
}