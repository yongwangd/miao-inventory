import React from 'react';
import { IndexLink, Link, browserHistory } from 'react-router';
import PropTypes from 'prop-types';
import { Layout, Menu, BackTop } from 'antd';
import { signoutWithFirebase } from '../fireQuery/fireConnection';
import './PageLayout.scss';
import '../../node_modules/antd/dist/antd.css';

const { Header, Content, Footer } = Layout;

const PageLayout = props => {
  const { children } = props;

  const signOut = () => {
    console.log('trying to signout');
    signoutWithFirebase();
    browserHistory.push('/login');
  };

  return (
    <Layout className="layout">
      <Header style={{ height: 24 }}>
        <div className="logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['1']}
          style={{ lineHeight: '24px' }}
        >
          <Menu.Item key="1">
            <IndexLink to="/">Home</IndexLink>
          </Menu.Item>
          <Menu.Item key="3" className="pull-right">
            <span onClick={signOut}>Sign Out</span>
          </Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <div className="content-body">{children}</div>
        <BackTop />
      </Content>
      <Footer style={{ textAlign: 'center' }}>Designed For Moira</Footer>
    </Layout>
  );
};

PageLayout.propTypes = {
  children: PropTypes.node
};

export default PageLayout;
