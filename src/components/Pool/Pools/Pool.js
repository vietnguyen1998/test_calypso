import React from "react";
import { useHistory } from "react-router";
import { etherscan } from "../../../config";
import { SupportedCoins } from "../../../const/Const";
import {
  roundNumber,
  timestampToLocalDate,
  getOdds,
  formatTimezone,
  swapBetAmounts,
} from "../../../utils/Utils";
import TutorialPopup from "../../Common/TutorialPopup";
import { TabName } from "../../Common/Sidebar";

const Pool = (props) => {
  const { pool, delay, address } = props;
  const game = pool.game || {};
  const history = useHistory();
  const currency = SupportedCoins.find((el) => el.value == pool.currency) || {};
  const isActive = pool.total >= pool.minPoolSize || pool.minPoolSize == 0;

  const odds = () => {
    let betAmounts = [];
    if (pool && pool.bets.length != 0) {
      for (let index = 0; index < 3; index++) {
        betAmounts.push(
          pool.bets.reduce(
            (acc, cur) =>
              cur.side == index + 1 ? acc + Number(cur.amount) : acc,
            0
          )
        );
      }
      return (
        <TutorialPopup
          content={pool.hasHandicap ? "Team1 : Team2" : "Team1 : Draw : Team2"}
        >
          <p className="white small-text text-wrap">
            {`Split ${
              pool.hasHandicap
                ? getOdds(swapBetAmounts(betAmounts)).replace(": 0 :", ":")
                : getOdds(swapBetAmounts(betAmounts))
            }`}
          </p>
        </TutorialPopup>
      );
    }
  };

  return (
    <div
      className="row pool-list wow fadeInUp"
      data-wow-duration="1s"
      data-wow-delay={`${delay || 0.1}s`}
    >
      <div className="col-md-4">
        <div className="row px-2 text-center">
          <div className="col">
            <h5 style={{ color: "white" }}>
              {TabName[pool.game.game == "dota 2" ? "dota" : pool.game.game]}
            </h5>
          </div>
        </div>
        <div className="row px-2">
          <div className="col-md-5 col-5" align="center">
            <div className="team-circle" align="center">
              <img
                className="team-img"
                src={game.logo1}
                style={{ maxWidth: "47px" }}
              />
            </div>
            <p className="team-name mt-2">{game.team1}</p>
            {pool.hasHandicap && (
              <TutorialPopup content="Team 1 handicap">
                <p className="bold small-text yellow">
                  {pool.handicap > 0 ? "+" : ""}
                  {pool.handicap}
                </p>
              </TutorialPopup>
            )}
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
        {pool.result.side != 0 && (
          <div className="row px-2">
            <div className="col-md-12 col-12" align="center">
              <h3 className="white text">
                {pool.result.g1} - {pool.result.g2}
              </h3>
            </div>
          </div>
        )}
      </div>
      <div className="col-md-8">
        <div className="row">
          <div className="col-md-8">
            <p className="white small-text text-wrap">
              {pool.title}{" "}
              <a href={`${etherscan}${pool._id}`} target="_blank">
                <img src="/images/link.png" style={{ width: "15px" }} />
              </a>
            </p>
            <p className="grey small-text text-wrap">{pool.description}</p>
            {pool.isPrivate &&
              pool.whitelist.some(
                (el) => el.toLowerCase() == address.toLowerCase()
              ) && (
                <p className="green small-text text-wrap">
                  You have access to this Private Pool.
                </p>
              )}
            {pool.bets.length > 0 &&
              pool.bets.some(
                (el) => el.bettor.toLowerCase() == address.toLowerCase()
              ) && (
                <p className="yellow small-text text-wrap">
                  You have made a bet in this Pool!
                </p>
              )}{" "}
            {odds()}
          </div>
          <div className="col-md-4">
            <button
              className="border-btn extra-small-text small-border-btn mb-3"
              onClick={() => history.push("/pools/" + pool._id)}
            >
              <span>
                {" "}
                {Math.floor(Date.now() / 1000) - pool.endDate > 0
                  ? "View"
                  : "Join Pool"}
              </span>
            </button>
            <TutorialPopup
              content={
                isActive
                  ? "This pool is active!"
                  : "This pools has not hit minimum pool size"
              }
            >
              <button
                className="team-circle ml-3 btn"
                style={{
                  backgroundColor: isActive ? "green" : "orange",
                  width: "15px",
                  height: "15px",
                }}
              ></button>
            </TutorialPopup>
          </div>
        </div>

        <div className="row">
          <div className="col-md-3 col-6">
            <TutorialPopup content="Date and time of match in your local time">
              <small className="grey">
                {timestampToLocalDate(game.date - 3600, "D MMM YYYY")}
              </small>
            </TutorialPopup>
            <p className="bold small-text yellow">
              {timestampToLocalDate(game.date - 3600, "H:mm UTC")}{" "}
              {formatTimezone(game.date)}
            </p>
          </div>
          <div className="col-md-3 col-6">
            <TutorialPopup content="Pool size - the total bets currently placed by all players">
              <small className="grey">Pool size</small>
            </TutorialPopup>
            <p className="bold small-text yellow">
              {roundNumber(pool.total || 0)} {currency.label}
            </p>
          </div>
          <div className="col-md-3 col-6">
            <TutorialPopup content="Max cap - the maximum bet size which this pool can accept from all players">
              <small className="grey">Max pool size</small>
            </TutorialPopup>
            <p className="bold small-text yellow">
              {roundNumber(pool.maxCap)} {currency.label}
            </p>
          </div>
          <div className="col-md-3 col-6">
            <TutorialPopup content="Pool fee - the percentage of winnings which will go to the Pool Creator">
              <small className="grey">Pool fee</small>
            </TutorialPopup>
            <p className="bold small-text yellow">
              {roundNumber(pool.poolFee)}%
            </p>
          </div>
          <div className="col-md-3 col-6">
            <TutorialPopup content="All bets will be refunded if pool does not reach this size">
              <small className="grey">Min bet size</small>
            </TutorialPopup>
            <p className="bold small-text yellow">
              {pool.minBet} {currency.label}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pool;
