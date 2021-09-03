import React, { useState, useEffect, useMemo } from "react";
import Main from "../Common/Main";
import { useParams } from "react-router-dom";
import { connect, useSelector } from "react-redux";
import { getPool } from "../../redux/actions";
import { getBettingPool, getSigner } from "../../utils/Contracts";
import BettingPanel from "./BettingPanel";
import BetList from "./BetList";
import { BetSides, SupportedCoins } from "../../const/Const";
import {
  roundNumber,
  timestampToLocalDate,
  formatTimezone,
  swapBetAmounts,
  getOdds,
} from "../../utils/Utils";
import ClaimReward from "./ClaimReward";
import WithdrawDeposit from "./WithdrawDeposit";
import MaxCapPanel from "./MaxCapPanel";
import { etherscan } from "../../config";
import { TabName } from "../Common/Sidebar";
import TutorialPopup from "../Common/TutorialPopup";

const PoolDetail = (props) => {
  const { getPool } = props;
  const { poolAddress } = useParams();
  const pool = useSelector((state) => state.pool) || {};
  const isActive = pool.total >= pool.minPoolSize || pool.minPoolSize == 0;
  const address = useSelector((state) => state.address);
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(false);
  const Pool = useMemo(
    () => (pool && getBettingPool(poolAddress, pool.version)) || null,
    [pool]
  );
  const poolSigner = Pool && Pool.connect(getSigner());

  const game = (pool && pool.game) || {};
  const isOwner =
    pool &&
    pool.owner &&
    address &&
    pool.owner.toLowerCase() == address.toLowerCase();
  const timestamp = Math.round(Date.now() / 1000);
  const isEnded = pool && timestamp > pool.endDate;
  const result = (pool && pool.result) || {};
  const hasResult = (result && result.updated) || false;
  const total = (pool && pool.total) || 0;
  const winOutcome = result.winOutcome || 0;
  const winTotal = result.winTotal || 0;
  const refund = result.refund || 0;
  const selectedCurrency = pool && pool.currency;
  const currency = SupportedCoins.find(
    (item) => item.value == selectedCurrency
  );
  const currencyName = currency && currency.label;
  const isPrivate = pool && pool.isPrivate;
  const _whitelist = pool && pool.whitelist;
  const validAddress = isPrivate
    ? _whitelist
        .map((el) => el.toLowerCase())
        .includes(address.toLowerCase()) || pool.owner == address
    : true;
  const claimUser =
    pool.claimedUsers && pool.claimedUsers.find((el) => el.address == address);
  const bets = pool.bets || [];
  // result for cases with Half Win/Loose
  const halfResult = result.side > 3 ? (result.side == 4 ? 1 : 2) : result.side;
  const halfBets =
    (result.side > 3 && result && bets.filter((el) => el.side == halfResult)) ||
    [];
  const winBets = (result && bets.filter((el) => el.side == result.side)) || [];
  const hasRefund =
    result.side > 3 &&
    result.refund &&
    result.refund > 0 &&
    bets.some(
      (el) =>
        el.bettor.toLowerCase() == address.toLowerCase() &&
        el.side == (result.side == 4 ? 2 : 1)
    );

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
  const expiredTimeWithoutResult = timestamp - pool.endDate > 5 * 60 * 60; // after 5 hours users can withdraw all their funds
  const side = hasResult && result.side;
  const winner =
    side == BetSides.team1
      ? { image: game.logo1, name: game.team1 }
      : side === BetSides.team2
      ? { image: game.logo2, name: game.team2 }
      : {
          image:
            result.side > 3 ? (result.side == 4 ? game.logo1 : game.logo2) : "",
          name:
            result.side > 3
              ? result.side == 4
                ? `${game.team1} (${pool.handicap > 0 ? "+" : ""} ${
                    pool.handicap
                  })`
                : `${game.team2} (${pool.handicap > 0 ? "+" : ""} ${
                    pool.handicap
                  })`
              : "Draw",
        };

  useEffect(() => {
    updatePool();
  }, [address, reload]);

  const updatePool = () => {
    address && getPool(poolAddress, address);
  };

  const canClaim =
    winBets.some((x) => x.bettor.toLowerCase() == address.toLowerCase()) ||
    halfBets.some((x) => x.bettor.toLowerCase() == address.toLowerCase());

  const canClaimNoResult = bets.some(
    (x) => x.bettor.toLowerCase() == address.toLowerCase()
  );

  const totalBetNoResult = () => {
    let total = 0;
    bets.forEach((el) => {
      if (el.bettor.toLowerCase() == address.toLowerCase()) {
        total += el.amount;
      }
    });
    return total;
  };
  const userRefund = () => {
    let total = 0;
    if (!hasRefund) {
      return total;
    }
    bets.forEach((el) => {
      if (
        el.bettor.toLowerCase() == address.toLowerCase() &&
        el.side == (result.side == 4 ? 2 : 1)
      ) {
        total += el.amount;
      }
    });
    return total / 2;
  };

  const betUsersList =
    pool.betUsers &&
    pool.betUsers.map((el, id) => {
      return (
        <>
          <div
            className="px-3 py-3 mt-3"
            style={{ backgroundColor: "#F7F7F8", maxWidth: "445px" }}
          >
            <a href={`${etherscan}${el}`} target="_blank" key={id}>
              <span className="black">{el}</span>
            </a>
          </div>
        </>
      );
    });

  return (
    <Main reload={reload} loading={loading} setLoading={setLoading}>
      <div className="container body-section">
        <div className="row mb-3">
          <a
            className="yellow-btn btn-sm mr-3"
            href={document.location.origin + "/pools"}
          >
            Go Back
          </a>
        </div>
        <div className="row">
          <div className="col-md-7" style={{ maxWidth: "600px" }}>
            {/* Pool Details */}

            <h3 className="bold">Pool details</h3>
            {!isActive && (
              <p
                style={{ color: "red" }}
              >{`The pool is not active yet. To activate it user must reach the min pool size. (${total}/${pool.minPoolSize})`}</p>
            )}

            <div
              className="px-3 py-3 mt-4"
              style={{ backgroundColor: "#F7F7F8" }}
            >
              <div className="row text-center ">
                <div className="col">
                  {game && (
                    <h5>
                      {TabName[game.game == "dota 2" ? "dota" : game.game]}
                    </h5>
                  )}
                </div>
              </div>
              <div className="row text-center ">
                <div className="col">
                  <img
                    className="team-img"
                    src={game.logo1}
                    style={{ maxWidth: "100px", maxHeight: "60px" }}
                  />
                </div>
                <div className="col-md-auto d-flex align-items-center">
                  <span variant="success" className=" font-weight-bold ">
                    {result && result.g1} - {result && result.g2}
                  </span>
                </div>
                <div className="col">
                  <img
                    className="team-img"
                    src={game.logo2}
                    style={{ maxWidth: "100px", maxHeight: "60px" }}
                  />
                </div>
              </div>
              <div className="row text-center">
                <div className="col">{game.team1}</div>
                <div className="col-md-auto">
                  <span variant="success" className="mx-3 font-weight-bold">
                    VS
                  </span>
                </div>
                <div className="col">{game.team2}</div>
              </div>
              {
                /* Win team result */
                hasResult && (
                  <div className="win-team-box mt-3">
                    <span className="bold black">
                      <span className="grey mr-3">Winner: </span>
                      {winner.name}
                    </span>
                    <img
                      style={{ height: "22px" }}
                      className="team-img ml-2"
                      src={winner.image}
                    />
                  </div>
                )
              }
              {
                /* Win team result */
                isEnded && !hasResult && (
                  <div className="win-team-box mt-3">
                    <span className="bold black">
                      <span className="grey mr-3">Waiting for result</span>
                    </span>
                  </div>
                )
              }
              {isEnded && (
                <div className="win-team-box mt-3">
                  <span className="bold black">
                    <span className="grey mr-3">
                      <a href={game.link} target="_blank">
                        {!hasResult ? "Watch Game" : "Watch Replay"}
                      </a>
                    </span>
                  </span>
                </div>
              )}

              <br />
              <br />
              <span className="grey">Title: </span>
              <span className="black text-wrap">{pool.title}</span>
              <br></br>
              <span className="grey">Address: </span>
              <a href={`${etherscan}${poolAddress}`} target="_blank">
                <span className="black">{poolAddress}</span>
              </a>
              <br></br>
              <span className="grey">Description: </span>
              <span className="black text-wrap">{pool.description}</span>
              <br></br>
              <br></br>
              <div className="row">
                <div className="col-md-4 col-4">
                  <p className="grey mb-1">
                    {timestampToLocalDate(game.date - 3600, "D MMM YYYY")}
                  </p>
                  <p className="bold">
                    {timestampToLocalDate(game.date - 3600, "H:mm UTC")}{" "}
                    {formatTimezone(game.date)}
                  </p>
                </div>
                <div className="col-md-4 col-4">
                  <p className="grey mb-1">Max cap</p>
                  <p className="bold">
                    {roundNumber(pool.maxCap)} {currencyName}
                  </p>
                </div>
                <div className="col-md-4 col-4">
                  <p className="grey mb-1">Pool size</p>
                  <p className="bold">
                    {roundNumber(pool.total || 0)} {currencyName}
                  </p>
                </div>
              </div>
              <div className="row">
                <div className="col-md-4 col-4">
                  <p className="grey mb-1">Play currency</p>
                  <p className="bold">{currencyName}</p>
                </div>
                <div className="col-md-4 col-4">
                  <p className="grey mb-1">Pool fee</p>
                  <p className="bold">{roundNumber(pool.poolFee)}%</p>
                </div>
                <div className="col-md-4 col-4">
                  <p className="grey mb-1">Number of Players</p>
                  <p className="bold">
                    {(pool.betUsers && pool.betUsers.length) || 0}
                  </p>
                </div>
                <div className="col-md-4 col-4">
                  <p className="grey mb-1">Minimum bet size</p>
                  <p className="bold">{pool.minBet}</p>
                </div>
                <br />
              </div>
              {pool.hasHandicap && (
                <div classname="row">
                  <span className="bold">Handicap: </span>
                  {game.team1}: {pool.handicap > 0 ? "+" : ""}
                  {pool.handicap}
                </div>
              )}
            </div>

            <br />
            {/* Add MaxCap */}
            {!isEnded && isOwner && (
              <MaxCapPanel
                address={address}
                poolAddress={poolAddress}
                onReload={() => setReload(!reload)}
                setLoading={setLoading}
                bettingPool={poolSigner}
                coin={selectedCurrency}
                coinName={currencyName}
                depositedCal={(pool && pool.depositedCal) || 0}
              />
            )}

            <br />
            {pool.betUsers && pool.betUsers.length > 0 && (
              <h3 className="bold">Addresses of players in the pool:</h3>
            )}
            {betUsersList}
            <br />
          </div>

          {/* Betting section */}

          <div className="col-md-5">
            {(!isEnded && validAddress && (
              <BettingPanel
                pool={pool}
                poolAddress={poolAddress}
                game={game}
                currency={selectedCurrency}
                onReload={() => setReload(!reload)}
                setLoading={setLoading}
              />
            )) || (
              <div style={{ marginTop: 15 }}>
                Split:{" "}
                <TutorialPopup
                  content={
                    pool.hasHandicap ? "Team1 : Team2" : "Team1 : Draw : Team2"
                  }
                >
                  <span style={{ fontWeight: "bold", marginLeft: 20 }}>
                    {odds}{" "}
                  </span>
                </TutorialPopup>
              </div>
            )}
            {/* Bet Result */}
            {hasResult && canClaim && (
              <>
                <h3 className="bold mb-3">Result</h3>
                <p className="mb-1">
                  <span className="grey mr-2">Total pool: </span> {total}{" "}
                  {currencyName}
                </p>
                <p className="mb-1">
                  <span className="grey mr-2">Win outcome: </span> {winOutcome}{" "}
                  {currencyName}
                </p>
              </>
            )}
            {/*If we get the result of the match*/}
            {hasResult &&
              isActive &&
              validAddress &&
              (canClaim || hasRefund) &&
              (winBets.length > 0 || halfBets.length > 0) && (
                <ClaimReward
                  PoolSc={poolSigner}
                  onReload={() => setReload(!reload)}
                  setLoading={setLoading}
                  currencyName={currencyName}
                  winOutcome={winOutcome}
                  winTotal={winTotal}
                  winBets={winBets.concat(halfBets)}
                  claimed={claimUser}
                  hasResult={hasResult}
                  userAddress={address}
                  isActive={isActive}
                  userRefund={userRefund()}
                />
              )}

            {/*If we do not get the result of the match and 5 hours passed 
            or the pool is inactive
            or any other case a user can claim back*/}
            {((!hasResult &&
              expiredTimeWithoutResult &&
              validAddress &&
              canClaimNoResult &&
              bets.length > 0 &&
              !claimUser) ||
              (!isActive && hasResult) ||
              (pool.hasHandicap && pool.result.side == 3)) && (
              <ClaimReward
                PoolSc={poolSigner}
                onReload={() => setReload(!reload)}
                setLoading={setLoading}
                currencyName={currencyName}
                winOutcome={totalBetNoResult()}
                winTotal={winTotal}
                winBets={winBets}
                claimed={claimUser}
                hasResult={hasResult}
                userAddress={address}
                isActive={isActive}
                isHandicapRefund={pool.hasHandicap && pool.result.side == 3}
              />
            )}

            {(hasResult || expiredTimeWithoutResult) && isOwner && (
              <WithdrawDeposit
                pool={pool}
                coin={currencyName}
                PoolSc={poolSigner}
                onReload={() => setReload(!reload)}
                setLoading={setLoading}
              />
            )}
            {/* My bets */}
            {validAddress && (
              <BetList
                address={address}
                coin={currency && currency.label}
                pool={pool}
              />
            )}
          </div>
        </div>
        <br />
        <br />
      </div>
    </Main>
  );
};

export default connect(null, { getPool })(PoolDetail);
