import React from 'react';
import {phoneFormat} from '../lib/formatter';

class PhoneInput extends React.Component {

	onInputChange = e => {
		const {onChange} = this.props;
		const raw = e.target.value || '';
		let str = raw.replace(/\D/g, '');

		if (str.length > 10) return;
		const cp = { ...e };
		cp.target.value = str;
		onChange(cp);
	}

	render() {
		console.log('propssss is ja', this.props);

		let {
			value,
			onChange,
			...rest
		} = this.props;
		const {
			onInputChange
		} = this;

		return (
			<input {...rest} value={phoneFormat(value)} onChange={e => onInputChange(e)} />
		)
	}
}

export default PhoneInput;
