import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const ToolTip = (props) => {
  return (
    <OverlayTrigger
      placement="top"
      overlay={<Tooltip>{props.content}</Tooltip>}
    >
      {props.children}
    </OverlayTrigger>
  );
};

export default ToolTip;
