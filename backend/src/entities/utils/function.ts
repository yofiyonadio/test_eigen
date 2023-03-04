export default {
	formatSpace(string: any): string {
		return string.split('\n').join(' ').split('\r').join(' ').split('\t').join(' ').replace(/\s\s+/g, ' ').split(' ,').join(',').split(',  ').join(', ').split('),(').join('),\n(')
	},
}
