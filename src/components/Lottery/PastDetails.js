import React from "react";
import { Modal } from "react-bootstrap";
import { timestampToLocalDate, formatTimezone } from "../../utils/Utils";
import { getLotteryWinners } from "./LotteryUtils";

const PastDetails = (props) => {
  const { showPastDetails, lottery, handleClosePastDetails } = props;

  const getWinNumberLogo = (number) => {
    return number != undefined
      ? number
          .toString()
          .split("")
          .map((el, i) => {
            return <div className="ticket-number mx-2">{el}</div>;
          })
      : 0;
  };

  return (
    <Modal
      show={showPastDetails}
      onHide={handleClosePastDetails}
      keyboard={false}
      centered
    >
      <Modal.Body
        style={{
          backgroundColor: "#4A556A",
          borderRadius: "15px",
        }}
      >
        <div class="d-flex">
          <div class="mr-auto white">LAST DRAW</div>
          <div class="bright-grey">
            #{/*lotteriesAmount*/ 100} | Draw:{" "}
            {timestampToLocalDate(lottery.endDate, "D MMM YYYY")}{" "}
            {timestampToLocalDate(lottery.endDate, "H:mm UTC").padStart(9, "0")}{" "}
            {formatTimezone(lottery.endDate)}
          </div>
        </div>
        <div className="row d-flex justify-content-center">
          <p className="white">{lottery._id}</p>
        </div>
        <hr style={{ border: "1px dashed  grey" }} />
        <div className="row d-flex justify-content-center">
          {getWinNumberLogo(lottery.winNumber)}
        </div>
        <div class="my-3">{getLotteryWinners(lottery)}</div>

        <hr style={{ border: "1px dashed  grey" }} />
      </Modal.Body>
    </Modal>
  );
};

export default PastDetails;
