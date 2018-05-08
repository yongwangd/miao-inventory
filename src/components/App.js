import React from 'react';
import 'babel-polyfill';
import { browserHistory, Router, Route, IndexRoute } from 'react-router';
import { Provider } from 'react-redux';
import PropTypes from 'prop-types';
import HomeView from '../routes/Home/components/HomeView';
import LoginView from '../routes/Login/LoginView';
import ContactsView from '../routes/Contacts/ContactsView';
import EventLogView from '../routes/EventLog/EventLogView';
import EnsureLoginContainer from '../routes/EnsureLoginContainer/EnsureLoginContainer';
import PageLayout from '../layouts/PageLayout';
import $ from 'jquery';
import { actions } from '../store/envReducer';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'

class App extends React.Component {
  static propTypes = {
    store: PropTypes.object.isRequired
  };

  componentDidMount() {
    const { store } = this.props;
    console.log('app has mounted', $, $('body'));
    const $body = $('body');
    var detectMouse = function(e) {
      let touchOnly = true;

      if (e.type === 'mousedown') {
        touchOnly = false;
      } else if (e.type === 'touchstart') {
        touchOnly = true;
      }
      // remove event bindings, so it only runs once
      store.dispatch(actions.setTouchOnly(touchOnly));
      $body.off('mousedown touchstart', detectMouse);
    };
    // attach both events to body
    $body.on('mousedown touchstart', detectMouse);
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <Provider store={this.props.store}>
        <div style={{ height: '100%' }}>
          <Router history={browserHistory}>
            <Route path="/" component={PageLayout}>
              <Route path="home" component={HomeView} />
              <Route component={EnsureLoginContainer}>
                <IndexRoute component={ContactsView} />
                <Route path="logs" component={EventLogView} />
              </Route>
            </Route>
            <Route path="login" component={LoginView} />
          </Router>
        </div>
      </Provider>
    );
  }
}

export default App;

//   render () {
//     return (
//       <Provider store={this.props.store}>
//         <div style={{ height: '100%' }}>
//           <Router history={browserHistory} children={this.props.routes} />
//         </div>
//       </Provider>
//     )
//   }
