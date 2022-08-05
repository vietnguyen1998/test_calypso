import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Main from "../Common/Main";
import { getWei } from "../../utils/Web3Utils";
import { getTestFaucet, getSigner } from "../../utils/Contracts";
import { connect, useSelector } from "react-redux";
import { toast } from "react-toastify";

const Faucet = () => {
  const [usdtAmount, setUsdtAmount] = useState("0");
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(false);
  const TestFaucet = getTestFaucet() && getTestFaucet().connect(getSigner());

  const requestUsdt = () => {
    setLoading(true);
    TestFaucet &&
      TestFaucet.transferUsdt(getWei(usdtAmount))
        .then((tx) => {
          tx.wait().then(() => {
            setReload(!reload);
            setLoading(false);
            toast.success("Transaction is successful!");
          });
        })
        .catch((err) => {
          setLoading(false);
          toast.error(err.message);
        });
  };

  return (
    <Main reload={reload} loading={loading} setLoading={setLoading}>
      <Container style={{ paddingTop: 200 }}>
        <Row>
          <Col xs={6}>
            <h4>Faucet</h4>
            <Form.Group className="mt-4">
              <Form.Label>Request USDT ( less than 1000 USDT)</Form.Label>
              <Form.Control
                type="number"
                value={usdtAmount}
                onChange={(e) => setUsdtAmount(e.target.value)}
              />
            </Form.Group>
            <Button variant="success" onClick={requestUsdt} className="mr-2">
              Submit
            </Button>
          </Col>
        </Row>
      </Container>
    </Main>
  );
};

export default connect(null)(Faucet);
