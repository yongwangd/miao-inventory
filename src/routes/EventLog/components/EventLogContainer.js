import React, { Component } from "react";
import { connect } from "react-redux";
import { Timeline } from "antd";
import { eventLogList } from "../../../fireQuery/eventLogQuery";

@connect(state => ({
  contacts: state.contactChunk.contacts
}))
class EventLogContainer extends Component {
  state = {
    eventLogs: []
  };

  componentWillMount() {
    this.eventListSub = eventLogList();
    this.eventListSub.subscribe(list =>
      this.setState({
        eventLogs: list
      })
    );
  }

  eventListSub = null;

  componenentWillUnmount() {
    this.eventListSub.unsubscribe();
  }

  render() {
    const { eventLogs } = this.state;
    const { contacts } = this.props;

    const renderLog = log => {
      const { id, scheme } = log;
      if (scheme == "contacts") {
        const ct = contacts.find(c => c._id == id) || {};
        console.log("ct is ", ct);
        const { name = "" } = ct;

        return (
          <Timeline.Item key={log._id}>{JSON.stringify(log)}</Timeline.Item>
        );
      }
    };

    return (
      <div>
        <Timeline>
          {eventLogs.map(renderLog)}
          <Timeline.Item color="green">
            Create a services site 2015-09-01
          </Timeline.Item>
          <Timeline.Item color="green">
            Create a services site 2015-09-01
          </Timeline.Item>
          <Timeline.Item color="red">
            <p>Solve initial network problems 1</p>
            <p>Solve initial network problems 2</p>
            <p>Solve initial network problems 3 2015-09-01</p>
          </Timeline.Item>
          <Timeline.Item>
            <p>Technical testing 1</p>
            <p>Technical testing 2</p>
            <p>Technical testing 3 2015-09-01</p>
          </Timeline.Item>
        </Timeline>
      </div>
    );
  }
}

export default EventLogContainer;
