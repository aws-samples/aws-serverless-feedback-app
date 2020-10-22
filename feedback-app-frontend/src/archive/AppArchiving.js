import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";
import { Layout, Menu, Breadcrumb } from "antd";
import NewForm from "./NewForm";
import PublicFeedback from "./PublicFeedback";

const { Header, Content, Footer } = Layout;

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Layout className="layout">
            <Header>
              <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["2"]}>
                <Menu.Item key="1">Submit Feedback</Menu.Item>
                <Menu.Item key="2">Public Feedbacks</Menu.Item>
              </Menu>
            </Header>
            <Route
              exact
              path="/"
              render={(props) => (
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
                    <NewForm />
                  </div>
                </Content>
              )}
            />
            <Route path="/publicfeedback" component={PublicFeedback} />
            <Footer style={{ textAlign: "center" }}>
              © 2020 Created by @ouzoegwu
            </Footer>
          </Layout>
          ,
        </div>
      </Router>
    );
  }
}

export default App;
