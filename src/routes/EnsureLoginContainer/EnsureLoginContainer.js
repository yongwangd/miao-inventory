import React,{Component} from 'react';
import {connect} from 'react-redux';
import {browserHistory} from 'react-router';

@connect(
	state => ({
		isLoggedIn: state.auth.loggedIn,
		checkingAuth: state.auth.checkingAuth
	})
)
class EnsureLoggedInContainer extends Component {
	// componentDidMount() {
	//   const { dispatch, currentURL, isLoggedIn, checkingAuth } = this.props
  
	//   if (!isLoggedIn) {
	// 	// set the current url/path for future redirection (we use a Redux action)
	// 	// then redirect (we use a React Router method)
	// 	// dispatch(setRedirectUrl(currentURL))
		
	// 	console.log('ensure logged in detected not');  
	// 	browserHistory.replace("/login")
	//   }
	// }
  
	render() {
		const { isLoggedIn, checkingAuth, children } = this.props;
		if (checkingAuth) {
			return <span>Checking Login Status</span>;
		}
	  if (isLoggedIn) {
		  return children;
	  } else {
		browserHistory.replace("/login")
		return <span>You are not lggedin</span>
	  }
	}
}

export default EnsureLoggedInContainer;
  
  // Grab a reference to the current URL. If this is a web app and you are
  // using React Router, you can use `ownProps` to find the URL. Other
  // platforms (Native) or routing libraries have similar ways to find
  // the current position in the app.
//   function mapStateToProps(state, ownProps) {
// 	return {
// 	  isLoggedIn: state.auth.loggedIn,
// 	  currentURL: ownProps.location.pathname
// 	}
//   }
  
//   export default connect(mapStateToProps)(EnsureLoggedInContainer)