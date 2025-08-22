import jsPDF from 'jspdf'
import 'jspdf-autotable'
import type { Invoice } from '../types'
import { calculateInvoiceTotals } from './totals'
import { formatCurrency, formatDateISO } from './currency'

export async function exportInvoiceToPdf(invoice: Invoice): Promise<void> {
	const doc = new jsPDF()

	// Header
	doc.setFontSize(18)
	doc.text('INVOICE', 14, 18)
	if (invoice.logoDataUrl) {
		try {
			doc.addImage(invoice.logoDataUrl, 'PNG', 150, 8, 45, 22)
		} catch {}
	}

	doc.setFontSize(11)
	doc.text(`Invoice # ${invoice.number}`, 14, 28)
	doc.text(`Date: ${formatDateISO(invoice.dateISO, invoice.locale)}`, 14, 34)
	if (invoice.dueDateISO) doc.text(`Due: ${formatDateISO(invoice.dueDateISO, invoice.locale)}`, 14, 40)

	// From / Bill To
	doc.setFontSize(12)
	doc.text('From', 14, 50)
	doc.setFontSize(10)
	doc.text([invoice.from.name, invoice.from.address || '', invoice.from.email || '', invoice.from.phone || ''].filter(Boolean) as string[], 14, 56)

	doc.setFontSize(12)
	doc.text('Bill To', 110, 50)
	doc.setFontSize(10)
	doc.text([invoice.billTo.name, invoice.billTo.address || '', invoice.billTo.email || ''].filter(Boolean) as string[], 110, 56)

	// Items table
	const body = invoice.items.map((item) => [
		item.description || '-',
		item.quantity.toString(),
		formatCurrency(item.unitPrice, invoice.currency, invoice.locale),
		formatCurrency(item.quantity * item.unitPrice, invoice.currency, invoice.locale),
	])

	// @ts-expect-error autotable type augmentation
	doc.autoTable({
		head: [['Description', 'Qty', 'Unit Price', 'Line Total']],
		body,
		startY: 80,
		styles: { fontSize: 10 },
		columnStyles: {
			0: { cellWidth: 90 },
			1: { halign: 'right' },
			2: { halign: 'right' },
			3: { halign: 'right' },
		},
	})

	const totals = calculateInvoiceTotals(invoice)
	const endY = (doc as any).lastAutoTable?.finalY || 80

	const rightX = 200
	doc.setFontSize(11)
	doc.text('Subtotal:', rightX - 60, endY + 10, { align: 'right' })
	doc.text(formatCurrency(totals.subtotal, invoice.currency, invoice.locale), rightX - 14, endY + 10, { align: 'right' })
	doc.text('Discount:', rightX - 60, endY + 16, { align: 'right' })
	doc.text(`-${formatCurrency(totals.discountAmount, invoice.currency, invoice.locale)}`, rightX - 14, endY + 16, { align: 'right' })
	doc.text('Tax:', rightX - 60, endY + 22, { align: 'right' })
	doc.text(formatCurrency(totals.taxAmount, invoice.currency, invoice.locale), rightX - 14, endY + 22, { align: 'right' })
	doc.setFontSize(12)
	doc.text('Total:', rightX - 60, endY + 32, { align: 'right' })
	doc.text(formatCurrency(totals.total, invoice.currency, invoice.locale), rightX - 14, endY + 32, { align: 'right' })

	if (invoice.notes) {
		doc.setFontSize(10)
		doc.text('Notes', 14, endY + 44)
		doc.setFont('helvetica', 'normal')
		doc.text(invoice.notes, 14, endY + 50)
	}

	doc.save(`Invoice-${invoice.number}.pdf`)
}