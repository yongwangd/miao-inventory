const createFormInitialState = (fields = [], validate, initData = {}) => {
	let form = {
		fields: {},
		stats: {}
	};


	return Promise.resolve(typeof initData == 'function' ? initData() : initData).then(values => {
		for (let f of fields) {
			form.fields[f] = values[f] || '',
				form.stats[f] = {
					touched: false,
					focused: false
				};
		}
		form.errors = validate ? validate(form.fields) : {};
		form.hasSubmitted = false;

		return form;
	});
}

const createEmptyInitialState = (fields, validate) => {

	let form = {
		fields: {},
		stats: {}
	};


	for (let f of fields) {
		form.stats[f] = {
			touched: false,
			focused: false
		};
	}

	form.errors = validate ? validate(form.fields) : {};
	form.hasSubmitted = false;

	return form;
}

const formEvtHandler = (setState, validate) => (fieldName, state) => {

	let hasVlidator = typeof validate == 'function';
	let getErrors = () => hasVlidator ? validate(state.fields) : [];
	return {
		onChange(e, value) {
			let v = e ? e.target.value : value;

			if (e && e.target.type == 'checkbox') {
				v = e.target.checked;
			}

			state.fields[fieldName] = v;
			let errors = hasVlidator ? validate(state.fields) : []
			state.errors = errors;
			setState(state);
		},
		onFocus: e => {

			state.stats[fieldName].focused = true;
			setState(state);
		},
		onBlur: e => {
			state.stats[fieldName].touched = true;
			setState(state);
		}
	};
}

export {
	createEmptyInitialState,
	createFormInitialState,
	formEvtHandler
};
