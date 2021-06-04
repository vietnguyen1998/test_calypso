import React, { useState, useEffect } from "react";
import { Container, Form, Row, Col, Button } from "react-bootstrap";
import { connect, useSelector } from "react-redux";
import { byte32ToString } from "../../utils/Web3Utils";
import { toast } from "react-toastify";

const SubmitResult = (props) => {
  const { onReload, setLoading, PoolSc } = props;
  const pool = useSelector((state) => state.pool);
  const sides =
    pool && pool._sides && pool._sides.map((item) => byte32ToString(item));
  const items =
    sides &&
    sides.map((item, index) => (
      <option key={index} value={index}>
        {item}
      </option>
    ));
  const [selectedItem, setSelectedItem] = useState(0);

  const submitResult = () => {
    setLoading(true);
    PoolSc &&
      PoolSc.setResult(selectedItem)
        .then((tx) => {
          tx.wait().then(() => {
            onReload();
            setLoading(false);
            toast.success("Result was submitted!");
          });
        })
        .catch((err) => {
          setLoading(false);
          toast.error(err.message);
        });
  };
  return (
    <Container className="mt-4">
      <Row>
        <Col xs={6}>
          <h5>Set Result</h5>
          <Form.Group>
            <Form.Label>Winner</Form.Label>
            <Form.Control
              as="select"
              value={selectedItem}
              onChange={(e) => setSelectedItem(Number(e.target.value))}
            >
              {items}
            </Form.Control>
          </Form.Group>

          <Button onClick={submitResult}>Submit</Button>
        </Col>
      </Row>
    </Container>
  );
};

export default connect(null)(SubmitResult);
