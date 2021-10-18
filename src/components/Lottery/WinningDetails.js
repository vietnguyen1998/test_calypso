import React from "react";
import { Modal } from "react-bootstrap";
import { getWinningTickets, stringifyNumber } from "./LotteryUtils";

const WinningDetails = (props) => {
  const { showDetails, handleCloseDetails, tickets, lottery } = props;

  const resultsTable = getWinningTickets(tickets, lottery).map((el, i) => {
    return (
      <>
        <tr>
          <td>{el.number}</td>
          <td>{stringifyNumber(el.place)} Prize</td>
          <td>{el.amountOfWinners}</td>
          <td>{el.prize}</td>
        </tr>
      </>
    );
  });

  return (
    <Modal
      show={showDetails}
      onHide={handleCloseDetails}
      keyboard={false}
      centered
    >
      {" "}
      <Modal.Header closeButton>
        <Modal.Title>{lottery._id}</Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{
          backgroundColor: "#4A556A",
          borderRadius: "15px",
        }}
      >
        <table className="table" style={{ color: "white" }}>
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
