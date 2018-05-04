import uuidv4 from 'uuid/v4';

const createUUID = () => uuidv4();
console.log('id1', createUUID());
console.log('id1', createUUID());
console.log('id1', createUUID());
console.log('id1', createUUID());
console.log('id1', createUUID());

export default createUUID;