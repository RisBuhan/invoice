import type { Invoice, InvoiceTotals } from '../types'

export function calculateInvoiceTotals(invoice: Invoice): InvoiceTotals {
	const subtotal = invoice.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
	const discountAmount = Math.max(0, subtotal * (invoice.discountPercent / 100))
	const taxable = Math.max(0, subtotal - discountAmount)
	const taxAmount = Math.max(0, taxable * (invoice.taxPercent / 100))
	const total = Math.max(0, taxable + taxAmount)
	return { subtotal, discountAmount, taxAmount, total }
}