import React from 'react';
import moment from 'moment';
import R from 'ramda';


export const eventReader = (event, name) => {
	const {
		id,
		type,
		scheme,
		time,
		data = {},
		prev = {}
	} = event;

	const table = scheme == 'contacts' ? 'Contact' : 'Tag';
	const tableCode = {
		constant: table
	};
	const nameCode = {
		code: name
	};

	let resultArray = [];

	const code = val => ({ code: val });
	const constant = val => ({ constant: val });

	const momentIns = moment(time);
	const format = 'MM/DD/YYYY';

	if (type == 'DELETE') {
		return [
			'Delete ',
			<strong>{tableCode}</strong>,
			<strong>{nameCode}</strong>
		];
	}
	if (type == 'CREATE') {
		return [
			'Create ',
			<strong>{tableCode}</strong>,
			<strong>{nameCode}</strong>
		];
	}
	if (type == 'UPDATE') {
		let r = ['Update ',
			<strong>{tableCode}</strong>,
			<strong>{nameCode}</strong>
		];

		if (scheme == 'contacts') {
			const unionKeys = R.difference(R.union(R.keys(data), R.keys(prev)), ['tagKeySet']);
			// unionKeys.map(key => [key, code(prev[key]), code(data[key])]);
			unionKeys.forEach(key => r = r.concat([key, <strong>{prev[key]}</strong>, <strong>{data[key]}</strong>]))
		}

		return r;

	}

}
