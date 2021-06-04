import React from "react";
import ToolTip from "./ToolTip";

const TutorialPopup = (props) => {
  return <ToolTip content={props.content}>{props.children}</ToolTip>;
};

export default TutorialPopup;
