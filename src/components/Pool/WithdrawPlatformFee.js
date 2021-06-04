import React, { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { getEther } from "../../utils/Web3Utils";
import { toast } from "react-toastify";

const WithdrawPlatformFee = (props) => {
  const { pool, coin, PoolSc, onReload, setLoading } = props;
  const platformFeeAmount = pool && pool._platformFeeAmount;

  const withdraw = () => {
    setLoading(true);
    PoolSc &&
      PoolSc.withdrawPlatformFee()
        .then((tx) => {
          tx.wait().then(() => {
            onReload();
            setLoading(false);
            toast.success("You withdrawed successfully!");
          });
        })
        .catch((err) => {
          setLoading(false);
          toast.error(err.message);
        });
  };

  return (
    <Container className="my-4">
      <Row>
        <Col xs={6}>
          <h5>Withdraw platform fee</h5>
          <ul>
            <li>
              Platform Fee:{" "}
              <span className="font-weight-bold">
                {getEther(platformFeeAmount)} {coin}
              </span>
            </li>
          </ul>
          <Button onClick={withdraw}>Withdraw</Button>
        </Col>
      </Row>
    </Container>
  );
};

export default WithdrawPlatformFee;
