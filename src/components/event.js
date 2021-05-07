import React from "react";
import moment from "moment";
import checkIcon from "../public/icons/check-circle-fill.svg";

const Event = ({ element }) => {
  const eventType = (element) => {
    if (element.type === "identify") return element.traits.email;
    if (element.type === "page") return element.properties.path;
    if (element.type === "track") return element.event;
    else return "</>";
  };

  return (
    <tr className="table-row">
      <th width="5%">
        <img src={checkIcon}></img>
      </th>
      <th width="7%">{element.type}</th>
      <th width="65%">{eventType(element)}</th>
      <th width="20%">
        {moment(element.receiveTime).format("YYYY/MM/DD h:mm:ss")}
      </th>
    </tr>
  );
};
export default Event;
