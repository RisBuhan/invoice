export function generateId(prefix: string = 'id'): string {
	const random = Math.random().toString(36).slice(2, 8)
	const time = Date.now().toString(36)
	return `${prefix}_${time}_${random}`
}