import React from "react";
import { roundNumber, timestampToLocalDate } from "../../../utils/Utils";
import { BetSides } from "../../../const/Const";
import { Link } from "react-router-dom";
import { etherscan } from "../../../config";
import TutorialPopup from "../../Common/TutorialPopup";

const EndPool = (props) => {
  const { pool, address } = props;
  const game = pool.game || {};
  const gameResult = pool.result.side;
  const isJoined = pool.betUsers
    .map((el) => el.toLowerCase())
    .includes(address.toLowerCase());
  const containWin = pool.bets.some(
    (bet) =>
      bet.bettor.toLowerCase() === address.toLowerCase() &&
      bet.side == pool.result.side
  );
  const claimUser =
    pool.claimedUsers && pool.claimedUsers.some((el) => el.address == address);
  const claimedDepositAndFee = pool && pool.result.claimedDepositAndFee;
  return (
    <div
      className="row pool-list parent wow fadeInUp"
      data-wow-duration="1s"
      data-wow-delay="0.2s"
    >
      {isJoined && (
        <h4 className={"ribbon" + (!containWin ? "-lose" : "")}>
          {!containWin ? "LOSE" : "WIN"}
        </h4>
      )}
      <div className="col-md-4">
        <div className="row">
          <div className="col-md-5 col-5" align="center">
            <div className="team-circle" align="center">
              <img
                className="team-img"
                src={game.logo1}
                style={{ maxWidth: "47px" }}
              />
            </div>
            <p className="team-name mt-2">{game.team1}</p>
          </div>
          <div
            className="col-md-2 col-2 mt-3"
            style={{ padding: "0px" }}
            align="center"
          >
            <i style={{ color: "#374862", fontSize: "30px" }} className="bold">
              VS
            </i>
          </div>
          <div className="col-md-5 col-5" align="center">
            <div className="team-circle" align="center">
              <img
                className="team-img"
                src={game.logo2}
                style={{ maxWidth: "47px" }}
              />
            </div>
            <p className="team-name mt-2">{game.team2}</p>
          </div>
        </div>
      </div>
      <div className="col-md-8">
        <p className="white small-text text-wrap">
          {pool.title}{" "}
          <a href={`${etherscan}${pool._id}`} target="_blank">
            <img src="/images/link.png" style={{ width: "15px" }} />
          </a>
        </p>
        <small className="mr-2 yellow bold">Result:</small>
        <small className=" mr-4 yellow bold">
          {gameResult == BetSides.team1
            ? game.team1
            : gameResult == BetSides.team2
            ? game.team2
            : "Draw"}
        </small>
        {pool.bets.length > 0 &&
          pool.bets.some(
            (el) => el.bettor.toLowerCase() == address.toLowerCase()
          ) && (
            <p className="yellow small-text text-wrap">
              You have made a bet in this Pool!
            </p>
          )}
        {claimedDepositAndFee && (
          <p className="green small-text text-wrap">
            You have claimed Pool Fee.
          </p>
        )}
        <Link to={`/pools/${pool._id}`}>
          <button className="border-btn extra-small-text small-border-btn">
            <span className={claimUser && claimedDepositAndFee ? "green" : ""}>
              {" "}
              {claimUser
                ? claimedDepositAndFee
                  ? "Claimed"
                  : "Unstake CAL"
                : containWin
                ? "Claim"
                : "View"}
            </span>
          </button>
        </Link>

        <a href={`${etherscan}${pool._id}`} target="_blank">
          <p className="grey small-text text-wrap mt-1 mb-3">
            Address: {pool._id}
          </p>
        </a>
        <div className="row">
          <div className="col-md-3 col-6">
            <TutorialPopup content="Date and time of match in your local time">
              <p className="grey small-text mb-0">
                {timestampToLocalDate(game.date - 3600, "D MMM YYYY")}
              </p>
            </TutorialPopup>
            <p className="bold small-text yellow">
              {timestampToLocalDate(game.date - 3600, "H:mm Z")}
            </p>
          </div>
          <div className="col-md-3 col-6">
            <TutorialPopup content="Max cap - the maximum bet size which this pool can accept from all players">
              <p className="grey small-text mb-0">Max cap</p>
            </TutorialPopup>
            <p className="bold small-text yellow">
              {roundNumber(pool.maxCap || 0)} CAL
            </p>
          </div>
          <div className="col-md-3 col-6">
            <TutorialPopup content="Pool size - the total bets currently placed by all players">
              <p className="grey small-text mb-0">Pool size</p>
            </TutorialPopup>
            <p className="bold small-text yellow">
              {roundNumber(pool.total || 0)} CAL
            </p>
          </div>
          <div className="col-md-3 col-6">
            <TutorialPopup content="Pool fee - the percentage of winnings which will go to the Pool Creator">
              <p className="grey small-text mb-0">Pool fee</p>
            </TutorialPopup>
            <p className="bold small-text yellow">{pool.poolFee}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EndPool;
