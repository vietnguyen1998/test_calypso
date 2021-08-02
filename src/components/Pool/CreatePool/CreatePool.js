import React, { useState, useEffect, useMemo } from "react";
import Main from "../../Common/Main";
import "./CreatePool.css";
import { connect, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import useInput from "../../hook/useInput";
import { getMatches, createPool } from "../../../redux/actions";
import {
  getMaxPoolSize,
  roundNumber,
  timestampToLocalDate,
  getCalAmount,
} from "../../../utils/Utils";
import WhiteListPanel from "./WhiteListPanel/WhiteListPanel";
import { SupportedCoins, ZeroAddress } from "../../../const/Const";
import {
  getPoolManager,
  getCal,
  getOracle,
  getSigner,
} from "../../../utils/Contracts";
import { getWei } from "../../../utils/Web3Utils";
import { toast } from "react-toastify";
import Addresses from "../../../const/Address";
import TutorialPopup from "../../Common/TutorialPopup";
import { LogisticConst } from "../../../const/Const";

const CreatePool = (props) => {
  const { getMatches, createPool } = props;

  const [gameType, bindGameType] = useInput("epl");
  const [match, bindMatch, resetMatch] = useInput("0");
  const [isPrivate, setIsPrivate] = useState(false);
  const [hasHandicap, setHasHandicap] = useState(false);
  const [whitelist, setWhitelist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [coin, bindCoin] = useInput(ZeroAddress);
  const [price, setPrice] = useState(1);
  const [title, bindTitle] = useInput("");
  const [description, bindDescription] = useInput("Starting your Gaming Pool");
  const [fee, bindFee] = useInput("10");
  const [minPoolSize, bindMinPoolSize] = useInput("0");
  const [minBet, bindMinBet] = useInput("0");
  const [approved, setApproved] = useState(false);
  const history = useHistory();
  const [isGameTypeDisabled, setisGameTypeDisabled] = useState(false);
  const [handicapSide, bindHandicapSide] = useInput("-1");
  const [handicapWholeValue, setHandicapWholeValue] = useState(0);
  const [handicapFractionalValue, setHandicapFractionalValue] = useState(0);
  const [isZeroHandicap, setIsZeroHandicap] = useState(false);
  const [handicapType, bindHandicapType] = useInput("0");

  const calcMaxPoolSize = () => {
    return roundNumber(getMaxPoolSize(calAmount) / price);
  };

  const calcCalAmount = () => {
    const maxSize = maxPoolSize * price;
    return roundNumber(getCalAmount(maxPoolSize * price));
  };

  const [calAmount, setCalAmount] = useState("50");
  const [maxPoolSize, setMaxPoolSize] = useState(calcMaxPoolSize());

  const PoolManagerSigner =
    getPoolManager() && getPoolManager().connect(getSigner());
  const CalSigner = getCal() && getCal().connect(getSigner());
  const Oracle = getOracle();

  const matches = useSelector((state) => state.matches) || [];
  const gameTypes = useSelector((state) => state.gameTypes) || [];
  const address = useSelector((state) => state.address) || "";

  const filterMatches = useMemo(
    () => matches.filter((el) => el.game === gameType),
    [matches, gameType]
  );
  const game = useMemo(() => {
    const matchNum = Number(match);
    if (filterMatches.length && filterMatches.length > matchNum) {
      return filterMatches[matchNum];
    }
    return {};
  }, [filterMatches, match]);

  const selectedCoin = useMemo(
    () => SupportedCoins.find((el) => el.value === coin) || SupportedCoins[0],
    [coin]
  );

  useEffect(() => {
    if (coin === ZeroAddress) {
      Oracle && Oracle.getEthPrice().then((val) => setPrice(val / 1e8));
    } else {
      setPrice(1);
    }
  }, [coin]);

  useEffect(() => {
    if (document.activeElement.id == "calAmountInput") {
      setMaxPoolSize(calcMaxPoolSize());
    }
  }, [calAmount]);

  useEffect(() => {
    if (document.activeElement.id != "calAmountInput") {
      setCalAmount(calcCalAmount());
    }
  }, [maxPoolSize]);

  useEffect(() => {
    setMaxPoolSize(calcMaxPoolSize());
  }, [price]);

  useEffect(() => {
    getMatches();
  }, []);

  useEffect(() => {
    resetMatch();
  }, [gameType]);

  const approveCal = async () => {
    setLoading(true);
    CalSigner &&
      CalSigner.approve(Addresses.poolManager, getWei(calAmount.toString()))
        .then((tx) => {
          tx.wait().then(() => {
            setLoading(false);
            setApproved(true);
            setisGameTypeDisabled(true);
            toast.success(
              <div>
                Approved Successfully!
                <br />
                Please click the Create Pool button
              </div>
            );
          });
        })
        .catch((err) => {
          setLoading(false);
          toast.error(err.message);
        });
  };

  const clickCreatePool = async () => {
    try {
      setLoading(true);
      const selectMatch = filterMatches[Number(match)];
      const endDate = selectMatch.date - 60 * 60;
      const poolFee = Math.round(fee * 100);
      if (poolFee > 9500) {
        setLoading(false);
        toast.error("Pool Fee should not be bigger then 95%");
        return;
      }
      if (minPoolSize > maxPoolSize) {
        setLoading(false);
        toast.error("Min pool size cannot be bigger than max pool size");
        return;
      }
      const handicap = [
        handicapWholeValue * parseInt(handicapSide) * 100,
        handicapFractionalValue * parseInt(handicapSide) * 100,
      ];

      const currencyDetails = [
        poolFee,
        getWei(calAmount.toString()),
        getWei(minBet),
        getWei(minPoolSize),
      ];
      const tx = await PoolManagerSigner.createBettingPool(
        title,
        description,
        selectMatch.gameId,
        selectMatch.game,
        endDate,
        coin,
        currencyDetails,
        isPrivate ? whitelist : [],
        hasHandicap,
        handicap
      );
      await tx.wait();

      const poolAddress = await getPoolManager().getLastOwnPool(0, {
        from: address,
      });

      await createPool({
        _id: poolAddress,
        owner: address,
        title,
        description,
        depositedCal: calAmount,
        maxCap: maxPoolSize,
        poolFee: fee,
        endDate,
        isPrivate,
        whitelist: isPrivate ? whitelist : [],
        currency: coin,
        game: {
          ...selectMatch,
        },
        minBet,
        hasHandicap,
        handicap:
          (handicapWholeValue + handicapFractionalValue) *
          parseInt(handicapSide),
        minPoolSize,
      });
      setLoading(false);
      toast.success("Pool was created!");
      history.push("/pools");
    } catch (err) {
      setLoading(false);
      toast.error(err.message);
    }
  };

  const gameTypeOptions = gameTypes.map((el, id) => {
    return (
      <option key={id} value={el.type}>
        {el.name}
      </option>
    );
  });

  const matchOptions = filterMatches.map((el, id) => {
    return (
      <option key={id} value={String(id)}>
        {el.team1} - {el.team2}
      </option>
    );
  });

  const supportedCoinOptions = SupportedCoins.map((el) => {
    return (
      <option key={el.value} value={el.value}>
        {el.label}
      </option>
    );
  });

  const canApproveCreate = !isPrivate || (isPrivate && whitelist.length > 0);
  return (
    <Main loading={loading} setLoading={setLoading}>
      <div className="container body-section create-pool">
        <h3 className="bold">Starting your Gaming Pool</h3>
        {(game.date != undefined && (
          <>
            <div className="mt-4" style={{ height: "60px" }}>
              <img className="team-img mr-3" src={game.logo1} />
              {game.team1} - {game.team2}
              <img className="team-img ml-3" src={game.logo2} />
            </div>

            <div style={{ paddingLeft: 85 }}>
              {timestampToLocalDate(game.date - 3600)}
            </div>
          </>
        )) || (
          <div style={{ paddingLeft: 85 }}>
            Please begin by selecting the type of games from the drop down box
            below
          </div>
        )}

        <br />
        <div className="row">
          <div className="col-md-6 col-12">
            <form className="grey">
              <span>Please select types of games</span>
              <br />
              <select
                disabled={isGameTypeDisabled}
                className="select-input"
                name="Type of games"
                {...bindGameType}
              >
                {gameTypeOptions}
              </select>
              <br />
              <span>Please select which game to create Pool for</span>
              {(matchOptions.length > 0 && (
                <select className="select-input" name="Game" {...bindMatch}>
                  {matchOptions}
                </select>
              )) || (
                <>
                  <br />
                  <h6 style={{ color: "red" }}>
                    No matches found at the moment.
                  </h6>
                </>
              )}
              <br />
              <div className="row">
                <div className="col form-check">
                  <input
                    disabled={matchOptions.length == 0}
                    className="form-check-input"
                    type="checkbox"
                    value={hasHandicap}
                    onChange={(e) => {
                      setHasHandicap(e.target.checked);
                    }}
                  ></input>
                  <label className="form-check-label black">
                    Enable Handicap
                  </label>
                </div>

                {hasHandicap && (
                  <div className="col form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={isZeroHandicap}
                      onChange={(e) => {
                        setIsZeroHandicap(e.target.checked);
                        setHandicapWholeValue(0);
                        setHandicapFractionalValue(0);
                      }}
                    ></input>
                    <label className="form-check-label black">
                      <span>
                        Set Handicap to 0{" "}
                        <TutorialPopup content="Bets are refunded on a draw result.">
                          <span className="yellow small-text mb-0">(?) </span>
                        </TutorialPopup>
                      </span>
                    </label>
                  </div>
                )}
              </div>
              {hasHandicap && (
                <>
                  <div>
                    <input
                      className="text-input"
                      type="text"
                      disabled
                      value={filterMatches[Number(match)].team1}
                    ></input>
                  </div>
                  <div>
                    <select className="select-input" {...bindHandicapType}>
                      <option key="0" value="0">
                        Asian Handicap
                      </option>
                      <option key="1" value="1">
                        Point Spread
                      </option>
                    </select>
                  </div>
                  <div className="row">
                    <div className="col">
                      <select
                        className="select-input"
                        disabled={isZeroHandicap}
                        {...bindHandicapSide}
                      >
                        <option key="1" value="-1">
                          -
                        </option>
                        <option key="2" value="1">
                          +
                        </option>
                      </select>
                    </div>
                    <div className="col">
                      <select
                        className="select-input"
                        disabled={isZeroHandicap}
                        value={handicapWholeValue}
                        onChange={(e) => {
                          setHandicapWholeValue(parseInt(e.target.value));
                        }}
                      >
                        <option key="0" value="0">
                          0
                        </option>
                        <option key="1" value="1">
                          1
                        </option>
                        <option key="2" value="2">
                          2
                        </option>
                        <option key="3" value="3">
                          3
                        </option>
                        <option key="4" value="4">
                          4
                        </option>
                        <option key="5" value="5">
                          5
                        </option>
                        <option key="6" value="6">
                          6
                        </option>
                        <option key="7" value="7">
                          7
                        </option>
                        <option key="8" value="8">
                          8
                        </option>
                        <option key="9" value="9">
                          9
                        </option>
                        <option key="10" value="10">
                          10
                        </option>
                      </select>
                    </div>
                    <div className="col">
                      <select
                        className="select-input"
                        disabled={isZeroHandicap}
                        value={handicapFractionalValue}
                        onChange={(e) => {
                          setHandicapFractionalValue(
                            parseFloat(e.target.value)
                          );
                        }}
                      >
                        <option key="0" value="0">
                          0
                        </option>
                        {handicapType == "0" && (
                          <option key="0.25" value="0.25">
                            0.25
                          </option>
                        )}

                        <option key="0.5" value="0.5">
                          0.5
                        </option>

                        {handicapType == "0" && (
                          <option key="0.75" value="0.75">
                            0.75
                          </option>
                        )}
                      </select>
                    </div>
                  </div>
                </>
              )}
              <br />
              <span>Title</span>
              <br />
              <input className="text-input" type="text" {...bindTitle}></input>
              <br />
              <span>Description</span>
              <br />
              <textarea
                className="form-control description-box"
                rows="5"
                id="description"
                placeholder="Type something..."
                {...bindDescription}
              ></textarea>
              <div align="right">
                <p className="small-text mt-2">*150 characters left</p>
              </div>
            </form>
          </div>
          <div className="col-md-6 col-12">
            <form className="grey">
              <span>
                Please select the currency for the Pool{" "}
                <TutorialPopup content="This is the cryptocurrency which players can play with.">
                  <span className="yellow small-text mb-0">(?) </span>
                </TutorialPopup>
              </span>
              <br />
              <select className="select-input" name="Crypto" {...bindCoin}>
                {supportedCoinOptions}
              </select>
              <br />
              <span>
                Amount of CAL to stake{" "}
                <TutorialPopup content="The amount of CAL staked will determine the Max Pool Size. You will get back your CAL after the match has ended successfully.">
                  <span className="yellow small-text mb-0">(?) </span>
                </TutorialPopup>
              </span>
              <br />
              <input
                className="text-input"
                type="number"
                value={calAmount}
                id="calAmountInput"
                onChange={(e) => {
                  setCalAmount(e.target.value);
                }}
              />
              <br />
              <span>
                Max Pool Size in {selectedCoin.label}{" "}
                <TutorialPopup content="This is the maximum amount of cryptocurrency from all players which the Pool can accept. You cannot change this value.">
                  <span className="yellow small-text mb-0">(?) </span>
                </TutorialPopup>
              </span>
              <br />
              <div class="form-inline">
                <input
                  className="text-input"
                  type="number"
                  value={maxPoolSize}
                  id="maxPoolSizeInput"
                  onChange={(e) => {
                    setMaxPoolSize(e.target.value);
                  }}
                  style={{ maxWidth: "300px" }}
                />
                <button
                  class="btn btn-warning"
                  type="button"
                  onClick={() =>
                    setMaxPoolSize(
                      roundNumber(LogisticConst.upperLimit / price)
                    )
                  }
                  style={{
                    marginTop: "10px",
                    minWidth: "70px",
                    marginLeft: "10px",
                  }}
                >
                  Max
                </button>
              </div>
              <br />
              <span>Min pool size</span>
              <br />
              <input
                className="text-input"
                type="number"
                {...bindMinPoolSize}
              />
              <br />

              <span>
                Pool Fee (%), max: 95%{" "}
                <TutorialPopup content="This is the percentage of the Winning bets given to you as a reward for starting the pool. Please note that it is NOT based on total bets played in the pool.">
                  <span className="yellow small-text mb-0">(?) </span>
                </TutorialPopup>
              </span>
              <br />
              <input
                className="text-input"
                type="number"
                {...bindFee}
                max="95"
              />
              <br />

              <span>
                Minimum Bet Size in {selectedCoin.label} per player{" "}
                <TutorialPopup content="The minimum amount of cryptocurrencies a player can play with.">
                  <span className="yellow small-text mb-0">(?) </span>
                </TutorialPopup>
              </span>
              <br />
              <input className="text-input" type="number" {...bindMinBet} />
              <br />

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  id="flexCheckDefault"
                ></input>
                <label
                  className="form-check-label black"
                  htmlFor="flexCheckDefault"
                >
                  Private Pool{" "}
                  <TutorialPopup content=" If enabled, this pool can only be played by addresses which you have whitelisted. Only whitelisted addresses can view and join this private pool.">
                    <span className="yellow small-text mb-0">(?) </span>
                  </TutorialPopup>
                </label>
              </div>
              {isPrivate && (
                <WhiteListPanel
                  whitelist={whitelist}
                  updateWhitelist={setWhitelist}
                />
              )}
            </form>
          </div>
        </div>
        <div align="right">
          <button
            disabled={canApproveCreate ? false : true}
            className={`${canApproveCreate ? "yellow" : "grey"}-btn mt-3 mr-3`}
            onClick={approved ? clickCreatePool : approveCal}
          >
            {approved ? "Create Pool" : "Approve CAL"}
          </button>
        </div>
      </div>
      <br />
      <br />
      <br />
      <br />
    </Main>
  );
};

export default connect(null, { getMatches, createPool })(CreatePool);
