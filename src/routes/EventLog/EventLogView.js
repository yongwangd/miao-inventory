import React, { Component } from "react";
import EventLogContainer from "./components/EventLogContainer";

class EventLogView extends Component {
  render() {
    return (
      <div>
        Events
        <EventLogContainer />
      </div>
    );
  }
}

export default EventLogView;
