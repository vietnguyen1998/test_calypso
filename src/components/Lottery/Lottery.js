import React, { useEffect, useState } from "react";
import Main from "../Common/Main";
import { useHistory } from "react-router";
import { getLotteries } from "../../redux/actions";
import { connect, useSelector } from "react-redux";
import { secondsToHms, timestampToLocalDate } from "../../utils/Utils";

const Lottery = (props) => {
  const { getLotteries } = props;
  const history = useHistory();
  const lotteries = useSelector((state) => state.lotteries) || [];
  const sortedLotteries = lotteries.sort(
    (lot1, lot2) => lot2.createdDate - lot1.createdDate
  );

  useEffect(() => {
    getLotteries();
  }, []);

  const items = sortedLotteries.map((el, id) => {
    return (
      <div
        className="row mt-3"
        style={{ backgroundColor: "#0f1f38", borderRadius: "15px" }}
      >
        <div className="col-md-4">
          <div className="row px-2 mt-3">
            <div className="col">
              <h1 style={{ color: "white" }}>LUCKY DAY</h1>
              <p style={{ color: "yellow" }}>7 Digit Lottery</p>
            </div>
          </div>
          <br />
          <br />
          <br />
          <div className="row px-2">
            <div className="col-md-12 col-12">
              <p className="white text">CALYPSO1</p>
            </div>
          </div>
        </div>
        <div className="col-md-7">
          <div className="row">
            <div className="col-md-9 mt-3">
              <p className="white text-wrap">
                Do you have what it takes to be a winner?
              </p>
              <p className="white text-wrap">{el._id}</p>
            </div>
          </div>
          <br />
          <br />
          <br />
          <div className="row">
            <div className="col-md-3 col-6">
              <p className="white small-text mb-0">Draw time:</p>{" "}
              <p style={{ color: "yellow" }}>
                {timestampToLocalDate(el.endDate)}
              </p>
            </div>
            <div className="col-md-3 col-6">
              <p className="white small-text mb-0">Prize Pool</p>
              <p style={{ color: "yellow" }}>2.000.000 CAL</p>
            </div>
            <div className="col-md-3 col-6">
              <p className="white small-text mb-0">Pool size</p>
              <p style={{ color: "yellow" }}>{el.originalTotalStaked} CAL</p>
            </div>
            <div className="col-md-3 col-6">
              <p className="white small-text mb-0">Est. APY</p>
              <p style={{ color: "yellow" }}>00:11:42:31</p>
            </div>
          </div>
        </div>
        <div className="col-md-1">
          <button
            className="border-btn extra-small-text small-border-btn mt-3 mr-3"
            onClick={() => history.push("/lottery/" + el._id)}
          >
            <span>View</span>
          </button>
        </div>
      </div>
    );
  });

  return (
    <Main>
      <div style={{ backgroundColor: "#021025" }}>
        <div className="container body-section">{items}</div>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
      </div>
    </Main>
  );
};

export default connect(null, { getLotteries })(Lottery);
