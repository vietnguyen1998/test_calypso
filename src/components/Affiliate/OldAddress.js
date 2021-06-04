import React, { useState } from "react";
import { FormCheck } from "react-bootstrap";

const OldAddress = (props) => {
  return (
    <div className="row">
      <div
        className="col-md-10 col-10 whitelist-add"
        style={{ textDecoration: props.isChecked ? "line-through" : "" }}
      >
        <span className="black small-text">{props.address}</span>
      </div>
      <div className="col-md-2 col-2 my-auto" align="right">
        <FormCheck
          value={props.isChecked}
          onChange={(e) => props.toggleCheck(e.target.checked)}
        />
      </div>
    </div>
  );
};

export default OldAddress;
