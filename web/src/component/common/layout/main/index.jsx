import * as React from "react";
import { useState } from "react";
import {
  useNavigate,
  useLocation,
  Outlet,
  useParams,
  Link,
} from "react-router-dom";
import { t } from "ttag";
import { Layout, Menu, Row, Col, Breadcrumb, Space, Typography } from "antd";
const { Title } = Typography;

import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  TeamOutlined,
  BookOutlined,
  UserOutlined,
  UnorderedListOutlined,
  SlidersOutlined,
  ReadOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import { LOGO_TEXT } from "src/consts";
import PemUtil from "service/helper/pem_util";
import NavUtil from "service/helper/nav_util";
import DropDownProfile from "./dropdown_profile";
import styles from "./styles.module.css";

const { Header, Footer, Sider, Content } = Layout;

/**
 * MainLayout.
 */
export default function MainLayout() {
  let { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const toggle = () => {
    setCollapsed(!collapsed);
  };

  const navigateTo = NavUtil.navigateTo(navigate);

  /**
   * processSelectedKey.
   *
   * @param {string} pathname
   * @returns {string}
   */
  function processSelectedKey(pathname) {
    const patharr = pathname.split("/");
    pathname = "/" + patharr[1];
    if (pathname === "/manages") {
      pathname = "/";
    }
    return pathname;
  }

  function getMenuItems() {
    const result = [];
    result.push({
      label: t`Manage`,
      key: "/",
      icon: <ReadOutlined />,
    });
    result.push({
      label: t`Statistic`,
      key: "/statistics",
      icon: <BarChartOutlined />,
    });
    result.push({
      label: t`Book`,
      key: "/books",
      icon: <BookOutlined />,
    });
    result.push({
      label: t`Author`,
      key: "/authors",
      icon: <UserOutlined />,
    });
    result.push({
      label: t`Category`,
      key: "/categories",
      icon: <UnorderedListOutlined />,
    });

    result.push({
      label: t`Rack`,
      key: "/racks",
      icon: <SlidersOutlined />,
    });
    result.push({
      label: t`Member`,
      key: "/members",
      icon: <TeamOutlined />,
    });

    return result;
  }

  function getBreadCrum() {
    const pages = [
      { members: t`Member` },
      { books: t`Book` },
      { authors: t`Author` },
      { categories: t`Category` },
      { racks: t`Rack` },
      { consumers: "Mượn trả" },
      { statistics: t`Statistic` },
      { manages: t`Manage` },
    ];
    const path = window.location.pathname;
    if (path === "/") {
      return t`Manage`;
    }
    let result = t`Manage`;
    for (let i = 0; i < pages.length; i++) {
      const key = Object.keys(pages[i])[0];
      if (path.indexOf(key) > 0) {
        result = pages[i][key];
        break;
      }
    }
    return id ? <Link to="/">{result}</Link> : <span>{result}</span>;
  }

  return (
    <Layout className={styles.wrapperContainer}>
      <Sider
        trigger={null}
        breakpoint="lg"
        collapsedWidth="80"
        width={220}
        collapsible
        collapsed={collapsed}
        onBreakpoint={(broken) => {
          setCollapsed(broken);
        }}
        // className="primary-color"
        style={{
          overflow: "hidden",
          position: "sticky",
          top: "0",
          height: "100vh",
        }}
      >
        {/* <div className="logo">{collapsed || LOGO_TEXT}</div> */}

        <div className={styles["box-logo"]}>
          <Space>
            <img src="/images/logo.png" alt="LOGO" width={40} />
            <Title level={5}>{collapsed || "Thư viện Điện Bàn"}</Title>
          </Space>
        </div>
        <Menu
          className="sidebar-nav "
          defaultSelectedKeys={[processSelectedKey(location.pathname)]}
          theme="dark"
          mode="inline"
          items={getMenuItems()}
          onSelect={({ key }) => navigateTo(key)}
          selectedKeys={[processSelectedKey(location.pathname)]}
        />
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-header" style={{ padding: 0 }}>
          <Row>
            <Col span={12}>
              {React.createElement(
                collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
                {
                  className: "trigger",
                  onClick: toggle,
                }
              )}
            </Col>
            <Col span={12} className="right">
              {<DropDownProfile />}
            </Col>
          </Row>
        </Header>
        <Content
          style={{
            margin: "0 1rem",
          }}
        >
          <Breadcrumb
            style={{
              margin: "0.5rem 0",
            }}
          >
            <Breadcrumb.Item>{getBreadCrum()}</Breadcrumb.Item>
            {id ? <Breadcrumb.Item>{id}</Breadcrumb.Item> : <></>}
          </Breadcrumb>
          <Outlet />
        </Content>
        <Footer className="layout-footer" style={{ marginTop: "24px" }}>
          <span>Copyright dienban.library 2022</span>
        </Footer>
      </Layout>
    </Layout>
  );
}
