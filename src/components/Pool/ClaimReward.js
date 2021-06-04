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
  } = props;
  const betAmount = winBets.reduce((acc, cur) => acc + Number(cur.amount), 0);
  const winAmount = winTotal == 0 ? 0 : (betAmount * winOutcome) / winTotal;
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
            <span className="black mr-2">You win: </span>{" "}
            {roundNumber(winAmount)} {currencyName}
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
