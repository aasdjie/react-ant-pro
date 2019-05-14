import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Layout, Icon, message, Tabs, Button, Dropdown, Menu } from 'antd';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import { Route, Redirect, Switch, routerRedux } from 'dva/router';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import { enquireScreen } from 'enquire-js';
import GlobalHeader from 'components/GlobalHeader';
import GlobalFooter from 'components/GlobalFooter';
import SiderMenu from 'components/SiderMenu';
import Home from '../bustarget/Home/Home';
import NotFound from '../bustarget/Exception/404';
import { getRoutes } from '../utils/utils';
import Authorized from '../utils/Authorized';
import { getMenuData } from '../../config/menu';
import logo from '../assets/logo.svg';

const { Content, Header, Footer } = Layout;
const { AuthorizedRoute, check } = Authorized;

const { TabPane } = Tabs;
/**
 * 根据菜单取得重定向地址.
 */
const redirectData = [];
const getRedirect = item => {
  if (item && item.children) {
    if (item.children[0] && item.children[0].path) {
      redirectData.push({
        from: `${item.path}`,
        to: `${item.children[0].path}`,
      });
      item.children.forEach(children => {
        getRedirect(children);
      });
    }
  }
};
getMenuData().forEach(getRedirect);

/**
 * 获取面包屑映射
 * @param {Object} menuData 菜单配置
 * @param {Object} routerData 路由配置
 */
const getBreadcrumbNameMap = (menuData, routerData) => {
  const result = {};
  const childResult = {};
  for (const i of menuData) {
    if (!routerData[i.path]) {
      result[i.path] = i;
    }
    if (i.children) {
      Object.assign(childResult, getBreadcrumbNameMap(i.children, routerData));
    }
  }
  return Object.assign({}, routerData, result, childResult);
};

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
  },
};

let isMobile;
enquireScreen(b => {
  isMobile = b;
});

class BasicLayout extends React.PureComponent {
  static childContextTypes = {
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object,
  };
  state = {
    isMobile,
    tabList: [
      {
        closable: false,
        content: <Home onHandlePage={this.onHandlePage} />,
        exact: true,
        key: '/home',
        name: 'Home',
        path: '/home',
      },
    ],
    tabListKey: ['/home'],
    activeKey: '/home',
  };
  getChildContext() {
    const { location, routerData } = this.props;
    return {
      location,
      breadcrumbNameMap: getBreadcrumbNameMap(getMenuData(), routerData),
    };
  }
  componentDidMount() {
    this.initTab();

    enquireScreen(mobile => {
      this.setState({
        isMobile: mobile,
      });
    });
    this.props.dispatch({
      type: 'user/fetchCurrent',
    });
  }

  /**
   *  初始化标签页
   */
  initTab() {
    const lastTabKey = this.getActiveKey();
    console.log('lastTabKey,', lastTabKey);
    if (lastTabKey) {
      this.findTabByKey(lastTabKey);
    }
  }

  getPageTitle() {
    const { routerData, location } = this.props;
    const { pathname } = location;
    let title = 'Ant Tabs';
    if (routerData[pathname] && routerData[pathname].name) {
      title = `${routerData[pathname].name} - Ant Tabs`;
    }
    return title;
  }
  getBashRedirect = () => {
    // According to the url parameter to redirect
    // 这里是重定向的,重定向到 url 的 redirect 参数所示地址
    const urlParams = new URL(window.location.href);
    const redirect = urlParams.searchParams.get('redirect');
    // Remove the parameters in the url
    if (redirect) {
      urlParams.searchParams.delete('redirect');
      window.history.replaceState(null, 'redirect', urlParams.href);
    } else {
      const { routerData } = this.props;
      // get the first authorized route path in routerData
      const authorizedPath = Object.keys(routerData).find(
        item => check(routerData[item].authority, item) && item !== '/'
      );
      return authorizedPath;
    }
    return redirect;
  };

  handleMenuCollapse = collapsed => {
    this.props.dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  };

  handleNoticeClear = type => {
    message.success(`清空了${type}`);
    this.props.dispatch({
      type: 'global/clearNotices',
      payload: type,
    });
  };
  handleMenuClick = ({ key }) => {
    if (key === 'triggerError') {
      const { tabListKey } = this.state;
      if (!tabListKey.includes('/exception/trigger')) {
        this.onHandlePage({ key: '/exception/trigger' });
        this.props.dispatch(routerRedux.push('/exception/trigger'));
      } else {
        this.setState({ activeKey: '/exception/trigger' });
      }

      return;
    }
    if (key === 'logout') {
      this.props.dispatch({
        type: 'login/logout',
      });
    }
  };
  handleNoticeVisibleChange = visible => {
    if (visible) {
      this.props.dispatch({
        type: 'global/fetchNotices',
      });
    }
  };

  /**
   *
   * @param {string} key  保存当前 tab页地址
   */
  storeActiveKey(key) {
    console.log('now key,', key);
    if (key) {
      window.localStorage.setItem('ant-active-tab', key);
    }
    this.setState({
      activeKey: key,
    });
  }

  /**
   * 获取上一次标签页
   * @returns {string}
   */
  getActiveKey() {
    const activeKey = window.localStorage.getItem('ant-active-tab');
    if (activeKey) {
      return activeKey;
    }
    return '/home';
  }

  /**
   * 查找菜单路由对应的组件内容
   * @param {string} key 
   */
  findTabByKey(key) {
    const { routerData, match } = this.props;
    const tabLists = getRoutes(match.path, routerData);
    const { tabListKey, tabList } = this.state;

    this.storeActiveKey(key);
    tabLists.map(v => {
      if (v.key === key) {
        if (tabList.length === 0) {
          v.closable = false;
          this.state.tabList.push(v);
        } else if (!tabListKey.includes(v.key)) {
          if (v.content) {
            v.content = {
              ...v.content,
              props: Object.assign({}, v.content.props, { onHandlePage: this.onHandlePage }),
            };
          }
          this.state.tabList.push(v);
        }
      }
    });
    this.setState({
      tabListKey: tabList.map(va => va.key),
    });
  }

  onHandlePage = e => {
    // 点击左侧菜单
    const { key } = e;
    this.findTabByKey(key);
  };
  // 切换 tab页 router.push(key);
  onChange = key => {
    this.storeActiveKey(key);
    this.props.history.push({ pathname: key });
  };

  onEdit = (targetKey, action) => {
    this[action](targetKey);
  };

  remove = targetKey => {
    let { activeKey } = this.state;
    let lastIndex;
    this.state.tabList.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const tabList = [];
    this.state.tabList.map(pane => {
      if (pane.key !== targetKey) {
        tabList.push(pane);
      }
    });
    if (lastIndex >= 0 && activeKey === targetKey) {
      activeKey = tabList[lastIndex].key;
    }

    this.props.history.push({ pathname: activeKey });
    this.setState({ tabList, activeKey, tabListKey: tabList.map(va => va.key) });
  };

  onClickHover = e => {
    console.log(e);
    message.info(`Click on item ${key}`);
    let { key } = e,
      { activeKey, tabList, tabListKey } = this.state;
    if (key === '1') {
      tabList = tabList.filter(v => v.key !== activeKey || v.key === '/home');
      tabListKey = tabListKey.filter(v => v !== activeKey || v === '/home');
      this.setState({
        activeKey: '/home',
        tabList,
        tabListKey,
      });
    } else if (key === '2') {
      tabList = tabList.filter(v => v.key === activeKey || v.key === '/home');
      tabListKey = tabListKey.filter(v => v === activeKey || v === '/home');
      this.setState({
        activeKey,
        tabList,
        tabListKey,
      });
    } else if (key === '3') {
      tabList = tabList.filter(v => v.key === '/home');
      tabListKey = tabListKey.filter(v => v === '/home');
      this.setState({
        activeKey: '/home',
        tabList,
        tabListKey,
      });
    }
  };

  render() {
    const { currentUser, collapsed, fetchingNotices, notices, location } = this.props,
      { tabList, isMobile } = this.state,
      { pathname } = location;
    if (pathname === '/') {
      this.state.activeKey = '/home';
      // this.props.history.push({ pathname : '/home'  })
    }

    const menu = (
      <Menu onClick={this.onClickHover}>
        <Menu.Item key="1">关闭当前标签页</Menu.Item>
        <Menu.Item key="2">关闭其他标签页</Menu.Item>
        <Menu.Item key="3">关闭全部标签页</Menu.Item>
      </Menu>
    );
    const operations = (
      <Dropdown overlay={menu}>
        <a className="ant-dropdown-link" href="#">
          Hover me<Icon type="down" />
        </a>
      </Dropdown>
    );
    const layout = (
      <Layout>
        <SiderMenu
          logo={logo}
          // 不带Authorized参数的情况下如果没有权限,会强制跳到403界面
          // If you do not have the Authorized parameter
          // you will be forced to jump to the 403 interface without permission
          Authorized={Authorized}
          menuData={getMenuData()}
          collapsed={collapsed}
          location={location}
          isMobile={this.state.isMobile}
          onCollapse={this.handleMenuCollapse}
          onHandlePage={this.onHandlePage}
        />
        <Layout>
          <Header style={{ padding: 0 }}>
            <GlobalHeader
              logo={logo}
              currentUser={currentUser}
              fetchingNotices={fetchingNotices}
              notices={notices}
              collapsed={collapsed}
              isMobile={this.state.isMobile}
              onNoticeClear={this.handleNoticeClear}
              onCollapse={this.handleMenuCollapse}
              onMenuClick={this.handleMenuClick}
              onNoticeVisibleChange={this.handleNoticeVisibleChange}
            />
          </Header>
          <Content className="globalTabs" style={{ margin: '10px', height: '100%' }}>
            <Tabs
              // className={styles.tabs}
              activeKey={this.state.activeKey}
              onChange={this.onChange}
              tabBarExtraContent={operations}
              tabBarStyle={{ background: '#fff' }}
              tabPosition="top"
              tabBarGutter={-1}
              hideAdd
              type="editable-card"
              onEdit={this.onEdit}
            >
              {tabList.map(item => (
                <TabPane tab={item.name} key={item.key} closable={item.closable}>
                  {item.content ? item.content : <NotFound />}
                </TabPane>
              ))}
            </Tabs>
          </Content>
          <Footer style={{ padding: 0 }}>
            <GlobalFooter
              links={[
                {
                  key: 'Pro 首页',
                  title: 'Pro 首页',
                  href: 'https://github.com/kuhami',
                  blankTarget: true,
                },
              ]}
              copyright={
                <Fragment>
                  Copyright <Icon type="copyright" /> 2019 思维创科股份有限公司
                </Fragment>
              }
            />
          </Footer>
        </Layout>
      </Layout>
    );

    return (
      <DocumentTitle title={this.getPageTitle()}>
        <ContainerQuery query={query}>
          {params => <div className={classNames(params)}>{layout}</div>}
        </ContainerQuery>
      </DocumentTitle>
    );
  }
}

export default connect(({ user, global, loading }) => ({
  currentUser: user.currentUser,
  collapsed: global.collapsed,
  fetchingNotices: loading.effects['global/fetchNotices'],
  notices: global.notices,
}))(BasicLayout);
