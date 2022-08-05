import React, { useState } from "react";
import { Modal, Row } from "react-bootstrap";
import { RingLoader } from "react-spinners";

const Loading = (props) => {
  const { show, onHide } = props;
  return (
    <Modal show={show} onHide={onHide} size="sm" centered backdrop="static">
      <Modal.Body>
        <Row className="justify-content-center my-5">
          <RingLoader color="#36D7B7" />
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default Loading;
