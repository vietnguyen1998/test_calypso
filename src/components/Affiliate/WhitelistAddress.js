import React from "react";

const WhitelistAddress = (props) => {
  return (
    <div className="row">
      <div className="col-md-11 col-11 whitelist-add">
        <span className="black small-text">{props.address}</span>
      </div>
      <div
        className="col-md-1 col-1 my-auto"
        align="right"
        onClick={props.onRemove}
      >
        <i className="fa fa-times delete"></i>
      </div>
    </div>
  );
};

export default WhitelistAddress;
