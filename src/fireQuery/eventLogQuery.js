const {
	getFireDB
} = require('./fireConnection');
const {
	fireRef
} = require('../lib/firedog');

const contactsRef = fireRef(getFireDB().ref('eventLogs/'));


export const eventLogList = () => contactsRef.arrayStream();
