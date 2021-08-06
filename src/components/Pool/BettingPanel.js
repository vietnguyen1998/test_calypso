import React, { useState, useEffect } from "react";
import { connect, useSelector } from "react-redux";
import { getBettingPool, getErc20, getSigner } from "../../utils/Contracts";
import { byte32ToString, stringToBytes32, getWei } from "../../utils/Web3Utils";
import { RadioGroup, Radio } from "react-radio-group";
import { BetSides, SupportedCoins, ZeroAddress } from "../../const/Const";
import { toast } from "react-toastify";
import useInput from "../hook/useInput";
import { roundNumber, getOdds, swapBetAmounts } from "../../utils/Utils";
import { createBetTxId } from "../../redux/actions";
import { v4 as uuidv4 } from "uuid";
import TutorialPopup from "../Common/TutorialPopup";

const BettingPanel = (props) => {
  const { pool, poolAddress, onReload, setLoading, game } = props;
  const [selectedSide, setSelectedSide] = useState(BetSides.team1);
  const [amount, bindAmount, resetAmount] = useInput("0");
  const [approved, setApproved] = useState(false);
  const signer = getSigner();
  const Pool = getBettingPool(poolAddress, pool.version).connect(signer);
  const bets = pool.bets || [];
  const betAmounts = Object.values(BetSides).map((el) => {
    const amount = bets.reduce(
      (acc, cur) => (cur.side === el ? acc + cur.amount : acc),
      0
    );
    return amount;
  });

  let odds = pool.hasHandicap
    ? getOdds(swapBetAmounts(betAmounts)).replace(": 0 :", ":")
    : getOdds(swapBetAmounts(betAmounts));

  const betWithEth = () => {
    if (amount <= 0) {
      return toast.error("Amount is too small.");
    }
    if (amount < pool.minBet) {
      return toast.error(
        "Betting amount should be equal or higher than minimum bet"
      );
    }
    setLoading(true);
    let id = uuidv4();
    Pool &&
      Pool.betWithEth(selectedSide, id, { value: getWei(amount) })
        .then((tx) => {
          tx.wait().then(async () => {
            await createBetTxId({
              _id: id,
              txId: tx.hash,
            });
            onReload();
            setLoading(false);
            resetAmount();
            toast.success("Bet successfully!");
          });
        })
        .catch((err) => {
          setLoading(false);
          if (
            err.code == "UNPREDICTABLE_GAS_LIMIT" ||
            err.code == "INSUFFICIENT_FUNDS"
          ) {
            toast.error("Insufficient amount of tokens to approve");
          } else toast.error(err.message);
        });
  };

  const approveToken = () => {
    if (amount <= 0) {
      return toast.error("Amount is too small.");
    }
    if (amount < pool.minBet) {
      return toast.error(
        "Betting amount should be equal or higher than minimum bet"
      );
    }
    setLoading(true);
    const Erc20 = getErc20(pool.currency).connect(signer);
    Erc20 &&
      Erc20.approve(poolAddress, getWei(amount))
        .then((tx) => {
          tx.wait().then(() => {
            setLoading(false);
            setApproved(true);
            toast.success("Approved successfully! Can bet now.");
          });
        })
        .catch((err) => {
          setLoading(false);
          if (
            err.code == "UNPREDICTABLE_GAS_LIMIT" ||
            err.code == "INSUFFICIENT_FUNDS"
          ) {
            toast.error("Insufficient amount of tokens to approve");
          } else toast.error(err.message);
        });
  };

  const betWithTokens = () => {
    if (amount <= 0) {
      return toast.error("Amount is too small.");
    }
    if (amount < pool.minBet) {
      return toast.error(
        "Betting amount should be equal or higher than minimum bet"
      );
    }
    setLoading(true);
    let id = uuidv4();
    Pool &&
      Pool.betWithToken(selectedSide, getWei(amount), id)
        .then((tx) => {
          tx.wait().then(async () => {
            await createBetTxId({
              _id: id,
              txId: tx.hash,
            });
            onReload();
            setLoading(false);
            setApproved(false);
            resetAmount();
            toast.success("Bet successfully!");
          });
        })
        .catch((err) => {
          setLoading(false);
          if (
            err.code == "UNPREDICTABLE_GAS_LIMIT" ||
            err.code == "INSUFFICIENT_FUNDS"
          ) {
            toast.error("Insufficient amount of tokens to approve");
          } else toast.error(err.message);
        });
  };

  const getitems = () => {
    return (
      <>
        <React.Fragment key={0}>
          {" "}
          <p style={{ marginRight: 20 }}>
            <Radio value={1} /> {game.team1}
          </p>
        </React.Fragment>
        <React.Fragment key={1}>
          {" "}
          <p style={{ marginRight: 20 }}>
            <Radio value={2} /> {game.team2}
          </p>
        </React.Fragment>
        {!pool.hasHandicap && (
          <React.Fragment key={2}>
            {" "}
            <p style={{ marginRight: 20 }}>
              <Radio value={3} /> Draw
            </p>
          </React.Fragment>
        )}
      </>
    );
  };
  const items = getitems();
  const currency = SupportedCoins.find((item) => item.value == pool.currency);
  return (
    <>
      <h3 className="bold">Betting</h3>
      <div className="form-check form-check-inline mt-2 mr-5">
        {items && (
          <RadioGroup
            selectedValue={selectedSide}
            onChange={setSelectedSide}
            children={items}
          />
        )}
      </div>
      <div style={{ marginTop: 15 }}>
        Split:{" "}
        <span style={{ fontWeight: "bold", marginLeft: 20 }}>
          {odds}{" "}
          <TutorialPopup content="Team1 : Draw : Team2">
            <span className="yellow small-text mb-0">(?) </span>
          </TutorialPopup>
        </span>
      </div>
      <form className="grey mt-3">
        <span>
          {" "}
          Input {currency && currency.label} number. Minimum bet is{" "}
          {pool.minBet}{" "}
        </span>
        <br />
        <input className="text-input" type="number" {...bindAmount} />
      </form>
      {pool.currency == ZeroAddress ? (
        <button className="yellow-btn mr-3" onClick={betWithEth}>
          Play
        </button>
      ) : (
        <button
          className="yellow-btn mr-3"
          onClick={!approved ? approveToken : betWithTokens}
        >
          {!approved ? "Approve Token" : "Place Bet"}
        </button>
      )}
    </>
  );
};

export default connect(null)(BettingPanel);
