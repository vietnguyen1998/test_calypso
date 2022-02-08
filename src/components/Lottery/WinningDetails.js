import React from "react";
import { Modal } from "react-bootstrap";
import { getWinningTickets, stringifyNumber } from "./LotteryUtils";
import "./WinningDetails.css";

const WinningDetails = (props) => {
  const { showDetails, handleCloseDetails, tickets, lottery, winningIndex } =
    props;

  const resultsTable = getWinningTickets(tickets, lottery).map((el, i) => {
    return (
      <>
        <tr>
          <td>{el.number}</td>
          <td>{stringifyNumber(el.place)} Prize</td>
          <td style={{ textAlign: "center" }}>{el.amountOfWinners}</td>
          <td style={{ textAlign: "center" }}>{el.prize}</td>
        </tr>
      </>
    );
  });

  return (
    <Modal
      show={showDetails}
      onHide={handleCloseDetails}
      winningIndex={winningIndex}
      keyboard={false}
      centered
      dialogClassName="winning-details"
      className="transparent-modal"
    >
      {" "}
      {/* <Modal.Header closeButton>
        <Modal.Title>{lottery._id}</Modal.Title>
      </Modal.Header> */}
      <Modal.Body
        style={{
          backgroundColor: "#4A556A",
          borderRadius: "15px",
        }}
      >
        <table
          className="table"
          style={{ color: "white", alignItems: "center" }}
        >
          <caption
            style={{
              captionSide: "top",
              color: "white",
              textAlign: "center",
            }}
          >
            <div>
              <strong>DRAW #{winningIndex}</strong>
            </div>
            <div>
              {/* <strong style={{ color: "grey" }}> */}
              {lottery._id}
              {/* </strong> */}
            </div>
          </caption>
          <thead className="details-table">
            <tr>
              <th scope="col">Winning Tickets</th>
              <th scope="col">Tier</th>
              <th scope="col">Winners</th>
              <th scope="col">Amount</th>
            </tr>
          </thead>
          <tbody>{resultsTable}</tbody>
        </table>
      </Modal.Body>
    </Modal>
  );
};

export default WinningDetails;
