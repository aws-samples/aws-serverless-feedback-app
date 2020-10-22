import React, { Component } from "react";
import {
  Form,
  Input,
  Divider,
  Select,
  Button,
  Switch,
  Tooltip,
  message,
} from "antd";
import axios from "axios";
import Constants from "../global/constants.json";

const { Option } = Select;
const { TextArea } = Input;

class SubmitFeedback extends Component {
  state = {
    feedbackRecipient: "",
    feedbackSender: "",
    feedbackText: "",
    feedbackSituation: "",
    feedbackBehaviour: "",
    feedbackImpact: "",
    shareFeedback: false,
  };

  formRef = React.createRef();

  onRecipientChange = (e) => {
    this.setState({ feedbackRecipient: e });
  };

  onTextChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  onShareFeedbackChange = (e) => {
    this.setState({ shareFeedback: e });
  };

  onFinish = (values) => {
    console.log(values);
    axios
      .post(
        Constants.feedback_api_url + Constants.submit_feedback_path,
        {
          feedback_recepient: values.feedbackRecipientFormItem,
          feedback_text: values.feedbackTextFormItem,
          feedback_sender:
            values.feedbackSenderFormItem === ""
              ? "anonymous"
              : "@" + values.feedbackSenderFormItem,
          feedback_situation: values.feedbackSituationFormItem,
          feedback_behaviour: values.feedbackBehaviourFormItem,
          feedback_impact: values.feedbackImpactFormItem,
          share_feedback: this.state.shareFeedback === true ? "true" : "false",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        console.log("successfully added feedback");
        message.success("Feedback received... Thank You!");
        this.formRef.current.resetFields();
      })
      .catch((err) => {
        console.log("error saving to database");
        message.error("Oops! A little glitch can you try again please!");
      });
  };

  render() {
    return (
      <Form {...formItemLayout} onFinish={this.onFinish} ref={this.formRef}>
        <Form.Item
          name="feedbackRecipientFormItem"
          label="Concerning"
          rules={[
            {
              required: true,
              message: "Kindly select the main recipient of your feedback",
            },
          ]}
        >
          <Select
            placeholder="Select the main recipient"
            allowClear
            style={{ textAlign: "left" }}
            onChange={this.onRecipientChange}
            name="feedbackRecipient"
          >
            <Option value="@tmaddox">@tmaddox</Option>
            <Option value="@manager2">@manager2</Option>
            <Option value="@manager3">@manager3</Option>
            <Option value="@manager4">@manager4</Option>
            <Option value="@allmanagers">@allmanagers</Option>
            <Option value="@wholeteam">@wholeteam</Option>
          </Select>
        </Form.Item>
        <Form.Item name="feedbackSenderFormItem" label="From">
          <Input
            addonBefore="@"
            placeholder="Please provide your amazon id"
            name="feedbackSender"
            onChange={this.onTextChange}
            value={this.state.feedbackSender}
          />
        </Form.Item>
        <Form.Item
          name="feedbackTextFormItem"
          label="Feedback"
          rules={[
            {
              required: true,
              message: "Kindly provide your feedback comments",
            },
          ]}
        >
          <TextArea
            placeholder="Provide your feedback comments"
            autoSize={{ minRows: 2, maxRows: 5 }}
            onChange={this.onTextChange}
            name="feedbackText"
          />
        </Form.Item>

        <Form.Item
          label="Share Feedback"
          {...switchTailLayout}
          name="sharefeedbackFormItem"
        >
          <Tooltip
            placement="topLeft"
            title="Select to make feeback public and visible to the wider team"
          >
            <Switch onChange={this.onShareFeedbackChange} />
          </Tooltip>
        </Form.Item>

        <Divider plain style={{ fontStyle: "italic", color: "#FF9900" }}>
          Please provide an example to set the context for managers
        </Divider>
        <Form.Item name="feedbackSituationFormItem" label="Situation">
          <TextArea
            placeholder="Provide an example situation"
            autoSize={{ minRows: 2, maxRows: 5 }}
            onChange={this.onTextChange}
            name="feedbackSituation"
          />
        </Form.Item>
        <Form.Item name="feedbackBehaviourFormItem" label="Behaviour">
          <TextArea
            placeholder="Provide an example behaviour"
            autoSize={{ minRows: 2, maxRows: 5 }}
            onChange={this.onTextChange}
            name="feedbackBehaviour"
          />
        </Form.Item>
        <Form.Item name="feedbackImpactFormItem" label="Impact">
          <TextArea
            placeholder="Provide an example impact"
            autoSize={{ minRows: 2, maxRows: 5 }}
            onChange={this.onTextChange}
            name="feedbackImpact"
          />
        </Form.Item>
        <Form.Item {...submitTailLayout}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

const formItemLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 8,
  },
  layout: "horizontal",
};

const switchTailLayout = {
  wrapperCol: {
    span: 1,
  },
};

const submitTailLayout = {
  wrapperCol: {
    offset: 8,
    span: 1,
  },
};

export default SubmitFeedback;
