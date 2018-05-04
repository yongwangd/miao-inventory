export const phoneFormat = (phone = '', separetor = ' ') => {
	const p = phone.split('-').join('');
	return p.slice(0, 3) + (p.length > 3 ? separetor + p.slice(3, 6) : '') + (p.length > 6 ? separetor + p.slice(6) : '');
};
