export function formatCurrency(amount: number, currency: string, locale?: string): string {
	const resolvedLocale = locale || (typeof navigator !== 'undefined' ? navigator.language : 'en-US')
	try {
		return new Intl.NumberFormat(resolvedLocale, { style: 'currency', currency }).format(amount)
	} catch {
		return `$${amount.toFixed(2)}`
	}
}

export function formatDateISO(iso: string, locale?: string): string {
	const resolvedLocale = locale || (typeof navigator !== 'undefined' ? navigator.language : 'en-US')
	try {
		const d = new Date(iso)
		return new Intl.DateTimeFormat(resolvedLocale, { year: 'numeric', month: 'short', day: '2-digit' }).format(d)
	} catch {
		return iso
	}
}