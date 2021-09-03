import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { roundNumber } from "../../utils/Utils";

const ClaimReward = (props) => {
  const {
    PoolSc,
    onReload,
    setLoading,
    winOutcome,
    winTotal,
    winBets,
    currencyName,
    claimed,
    hasResult,
    userAddress,
    isActive,
    userRefund,
    isHandicapRefund,
  } = props;
  const betAmount = winBets.reduce(
    (acc, cur) =>
      cur.bettor.toLowerCase() == userAddress.toLowerCase()
        ? acc + Number(cur.amount)
        : acc,
    0
  );
  const winAmount =
    hasResult && !isHandicapRefund
      ? winTotal == 0
        ? 0
        : (betAmount * winOutcome) / winTotal + userRefund
      : winOutcome;
  const claimReward = () => {
    setLoading(true);
    PoolSc &&
      PoolSc.claimReward()
        .then((tx) => {
          tx.wait().then(() => {
            onReload();
            setLoading(false);
            toast.success("You received rewards successfully!");
          });
        })
        .catch((err) => {
          setLoading(false);
          toast.error(err.message);
        });
  };

  const claimLabel = () => {
    if (hasResult && isActive) {
      return "You win: ";
    } else {
      return "Claim back: ";
    }
  };

  return (
    <>
      <div>
        <div
          className="px-3 py-2 mt-2"
          style={{
            border: "2px solid #DFE2E5",
            display: "inline-block",
          }}
        >
          <span className="mb-1 bold">
            <span className="black mr-2">{claimLabel()}</span>{" "}
            {isActive ? roundNumber(winAmount) : winOutcome} {currencyName}
          </span>
          <br />
        </div>
      </div>{" "}
      {!claimed && (
        <button className="yellow-btn mt-2" onClick={claimReward}>
          Claim
        </button>
      )}
    </>
  );
};

export default ClaimReward;
