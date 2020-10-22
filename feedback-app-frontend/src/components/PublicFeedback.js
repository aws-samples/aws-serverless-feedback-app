import React, { Component } from "react";
import axios from "axios";
import Constants from "../global/constants.json";
import { Table, Tag, message } from "antd";

class PublicFeedback extends Component {
  state = {
    publicFeedbacks: [],
  };

  constructor(props) {
    super(props);
    axios
      .get(
        Constants.feedback_api_url +
          Constants.get_feedback_by_status_path +
          Constants.parameter_for_public_feedback
      )
      .then((res) => {
        this.setState({ publicFeedbacks: res.data });
        this.populateTable();
      })
      .catch((err) => {
        message.error(
          "Oops! A little glitch retrieving feedbacks. Try again please!"
        );
        console.log(err);
      });
  }

  populateTable = () => {
    let count = 0;
    data = this.state.publicFeedbacks.map((feedback) => {
      count++;
      return {
        count: count,
        concerning: feedback.feedback_recepient,
        from: feedback.feedback_sender,
        comments: feedback.feeback_text,
        sentiment: [feedback.feedback_sentitment],
        situation: feedback.feedback_situation,
        behaviour: feedback.feedback_behaviour,
        impact: feedback.feedback_impact,
      };
    });
  };

  render() {
    return <Table columns={columns} dataSource={data} />;
  }
}

const columns = [
  {
    title: "S/N",
    dataIndex: "count",
    key: "count",
  },
  {
    title: "Concerning",
    dataIndex: "concerning",
    key: "concerning",
  },
  {
    title: "From",
    dataIndex: "from",
    key: "from",
  },
  {
    title: "Feedback Comments",
    dataIndex: "comments",
    key: "comments",
  },
  {
    title: "Sentiment",
    key: "Sentiment",
    dataIndex: "sentiment",
    render: (tags) => (
      <>
        {tags.map((tag) => {
          let color = "";
          if (tag === "NEGATIVE") {
            color = "volcano";
          } else if (tag === "POSITIVE") {
            color = "green";
          } else if (tag === "NEUTRAL") {
            color = "geekblue";
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
  {
    title: "Example Situation",
    dataIndex: "situation",
    key: "situation",
  },
  {
    title: "Example Behaviour",
    dataIndex: "behaviour",
    key: "behaviour",
  },
  {
    title: "Example Impact",
    dataIndex: "impact",
    key: "impact",
  },
];

let data = [];

export default PublicFeedback;
