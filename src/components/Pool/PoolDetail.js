import React, { useState, useEffect, useMemo } from "react";
import Main from "../Common/Main";
import { useParams } from "react-router-dom";
import { connect, useSelector } from "react-redux";
import { getPool } from "../../redux/actions";
import { getBettingPool, getSigner } from "../../utils/Contracts";
import BettingPanel from "./BettingPanel";
import BetList from "./BetList";
import { BetSides, SupportedCoins } from "../../const/Const";
import { roundNumber, timestampToLocalDate } from "../../utils/Utils";
import ClaimReward from "./ClaimReward";
import WithdrawDeposit from "./WithdrawDeposit";
import MaxCapPanel from "./MaxCapPanel";
import { etherscan } from "../../config";

const PoolDetail = (props) => {
  const { getPool } = props;
  const { poolAddress } = useParams();
  const pool = useSelector((state) => state.pool) || {};
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
  const selectedCurrency = pool && pool.currency;
  const currency = SupportedCoins.find(
    (item) => item.value == selectedCurrency
  );
  const currencyName = currency && currency.label;
  const isPrivate = pool && pool.isPrivate;
  const _whitelist = pool && pool.whitelist;
  const validAddress = isPrivate
    ? _whitelist.map((el) => el.toLowerCase()).includes(address.toLowerCase())
    : true;
  const claimUser =
    pool.claimedUsers && pool.claimedUsers.find((el) => el.address == address);
  const bets = pool.bets || [];
  const winBets = (result && bets.filter((el) => el.side == result.side)) || [];
  const expiredTimeWithoutResult =
    hasResult && timestamp - pool.endDate > 5 * 60 * 60; // after 5 hours users can withdraw all their funds
  const side = hasResult && result.side;
  const winner =
    side == BetSides.team1
      ? { image: game.logo1, name: game.team1 }
      : side === BetSides.team2
      ? { image: game.logo2, name: game.team2 }
      : { image: "", name: "Draw" };
  useEffect(() => {
    updatePool();
  }, [address, reload]);

  const updatePool = () => {
    address && getPool(poolAddress, address);
  };

  return (
    <Main reload={reload} loading={loading} setLoading={setLoading}>
      <div className="container body-section">
        <div className="row">
          <div className="col-md-6">
            {/* Pool Details */}

            <h3 className="bold">Pool details</h3>

            <div
              className="px-3 py-3 mt-4"
              style={{ backgroundColor: "#F7F7F8" }}
            >
              <div className="mt-3 mb-2" style={{ height: "60px" }}>
                <img className="team-img mr-3" src={game.logo1} />
                {game.team1}{" "}
                <span variant="success" className="mx-3 font-weight-bold">
                  {result && result.g1} - {result && result.g2}
                </span>{" "}
                {game.team2}
                <img className="team-img ml-3" src={game.logo2} />
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
                      style={{ height: "25px" }}
                      className="team-img ml-2"
                      src={winner.image}
                    />
                  </div>
                )
              }
              {
                /* Win team result */
                isEnded && !hasResult && (
                  <>
                    <div className="win-team-box mt-3">
                      <span className="bold black">
                        <span className="grey mr-3">Waiting for result</span>
                      </span>
                    </div>
                    <div className="win-team-box mt-3">
                      <span className="bold black">
                        <span className="grey mr-3">
                          <a href={game.link} target="_blank">
                            Watch Game
                          </a>
                        </span>
                      </span>
                    </div>
                  </>
                )
              }

              <br />
              <br />
              <span className="grey">Title: </span>
              <span className="black">{pool.title}</span>
              <br></br>
              <span className="grey">Address: </span>
              <a href={`${etherscan}${poolAddress}`} target="_blank">
                <span className="black">{poolAddress}</span>
              </a>
              <br></br>
              <span className="grey">Description: </span>
              <span className="black">{pool.description}</span>
              <br></br>
              <br></br>
              <div className="row">
                <div className="col-md-4 col-4">
                  <p className="grey mb-1">
                    {timestampToLocalDate(game.date - 3600, "D MMM YYYY")}
                  </p>
                  <p className="bold">
                    {timestampToLocalDate(game.date - 3600, "H:mm Z")}
                  </p>
                </div>
                <div className="col-md-4 col-4">
                  <p className="grey mb-1">Max cap</p>
                  <p className="bold">
                    {roundNumber(pool.maxCap)} {currencyName}
                  </p>
                </div>
                <div className="col-md-4 col-4">
                  <p className="grey mb-1">Play size</p>
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
                <br />
              </div>
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
          </div>

          {/* Betting section */}

          <div className="col-md-6">
            {!isEnded && validAddress && (
              <BettingPanel
                pool={pool}
                poolAddress={poolAddress}
                game={game}
                currency={selectedCurrency}
                onReload={() => setReload(!reload)}
                setLoading={setLoading}
              />
            )}
            {/* Bet Result */}
            {hasResult && (
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
            {(hasResult || expiredTimeWithoutResult) &&
              validAddress &&
              winBets.length > 0 && (
                <ClaimReward
                  PoolSc={poolSigner}
                  onReload={() => setReload(!reload)}
                  setLoading={setLoading}
                  currencyName={currencyName}
                  winOutcome={winOutcome}
                  winTotal={winTotal}
                  winBets={winBets}
                  claimed={claimUser}
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
