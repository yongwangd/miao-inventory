import React, { Component } from 'react';
import ContactListContainer from './containers/ContactListContainer';

class ContactsView extends Component {

	render() {
		return (
			<div style={{ padding: 10 }}>

				<ContactListContainer/>
			</div>
		);
	}
}

export default ContactsView;
