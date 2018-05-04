import {
	env
} from '../../project.config';


const Track = function (target, name, descriptor) {

	let original = descriptor.value;
	let startTime = new Date();

	descriptor.value = () => {
		console.log(`@Track  ${name} started `);

		let result = original.apply(this, arguments);

		if (result.then) {
			return result.then(res => {
				let ellapsed = (new Date() - startTime) + ' ms';
				console.log(`@Track End  ${name} Elapsed time ${ellapsed} `);
				return res;
			});
		}

		let ellapsed = (new Date() - startTime) + ' ms';
		console.log(`@Track End  ${name} Elapsed time ${ellapsed} `);

		return result;
	}

	Object.defineProperty(target, name, descriptor);

}

export default Track;
