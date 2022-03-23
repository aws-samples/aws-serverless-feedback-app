import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "./App.css";
import { Layout, Menu, Breadcrumb } from "antd";
import SubmitFeedback from "./components/SubmitFeedback";
import PublicFeedback from "./components/PublicFeedback";

const { Header, Content, Footer } = Layout;

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Layout className="layout">
            <Header>
              <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
                <Menu.Item key="1">
                  <Link to="/">Submit Feedback</Link>
                </Menu.Item>
                <Menu.Item key="2">
                  <Link to="/publicfeedbacks">Public Feedbacks</Link>
                </Menu.Item>
              </Menu>
            </Header>
            <Content style={{ padding: "0 50px" }}>
              <Breadcrumb style={{ margin: "16px 0" }}>
                <Breadcrumb.Item
                  style={{
                    fontWeight: "bold",
                    fontSize: "24px",
                    color: "#FF9900",
                  }}
                >
                  Provide Feedback to Managers - Anytime & Anywhere
                </Breadcrumb.Item>
              </Breadcrumb>
              <div className="site-layout-content">
                <Route exact path="/" component={SubmitFeedback} />
                <Route path="/publicfeedbacks" component={PublicFeedback} />
              </div>
            </Content>

            <Footer style={{ textAlign: "center" }}>
              © 2022 Created by @ouzoegwu
            </Footer>
          </Layout>
          ,
        </div>
      </Router>
    );
  }
}

export default App;
