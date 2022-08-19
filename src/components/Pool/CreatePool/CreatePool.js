import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useLayoutEffect,
} from "react";
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
  formatTimezone,
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
import { toHaveFormValues } from "@testing-library/jest-dom";

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
  const [charsLeft, setCharsLeft] = useState(200);

  const calcMaxPoolSize = () => {
    return roundNumber(getMaxPoolSize(calAmount) / price);
  };

  const calcCalAmount = () => {
    let maxPoolSizeLimit = Math.floor(
      roundNumber((LogisticConst.upperLimit - 1) / price)
    );
    let num = maxPoolSize > maxPoolSizeLimit ? maxPoolSizeLimit : maxPoolSize;
    return roundNumber(getCalAmount(num * price));
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

  const getAccounts = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const account = accounts[0];
    setWhitelist([account]);
  };

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
      setCalAmount(calcCalAmount() < 1 ? 1 : calcCalAmount());
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

  useEffect(() => {
    setCharsLeft(200 - description.length);
  }, [description]);

  useEffect(() => {
    getAccounts();
  }, []);

  const approveCal = async () => {
    if (calAmount < 1) {
      setLoading(false);
      toast.error("Pool creation fee cannot be lesser or equal then 1");
      return;
    }
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
      if (calAmount < 1) {
        setLoading(false);
        toast.error("Pool creation fee cannot be lesser or equal then 1");
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
        getWei(maxPoolSize),
      ];

      const isUnlimited =
        maxPoolSize >=
        Math.floor(roundNumber((LogisticConst.upperLimit - 1) / price));

      const bools = [hasHandicap, isUnlimited];

      const tx = await PoolManagerSigner.createBettingPool(
        title,
        description,
        selectMatch.gameId,
        selectMatch.game,
        endDate,
        coin,
        currencyDetails,
        isPrivate ? whitelist : [],
        bools,
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
        isUnlimited: isUnlimited,
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

  const fillSpace = (el) => {
    let longest = 0;

    for (let n = 0; n < filterMatches.length; n++) {
      if (
        filterMatches[n].team1.length + filterMatches[n].team2.length >
        longest
      ) {
        longest = filterMatches[n].team1.length + filterMatches[n].team2.length;
      }
    }
    let space = ``;
    if (longest - el.team1.length - el.team2.length > 0) {
      space = `\xa0`.repeat(longest - el.team1.length - el.team2.length);
    }

    // if (longest - el.team1.length - el.team2.length > 10) {
    //   let strSpace =
    //     el.team1.split(" ").length -
    //     1 +
    //     (el.team2.split(" ").length - 1) +
    //     (el.team1.split("-").length - 1) +
    //     (el.team2.split("-").length - 1);
    //   space += "\xa0".repeat(parseInt(strSpace));
    // }
    return space;
  };

  const matchOptions = filterMatches.map((el, id) => {
    const s = `\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0`;
    return (
      <option
        key={id}
        value={String(id)}
        //style={{ direction: "rtl", textAlign: "right" }}
        style={{ fontFamily: "Roboto Mono", fontSize: "15px" }}
      >
        {el.team1} - {el.team2}
        {s}
        {fillSpace(el)}
        {timestampToLocalDate(el.date, "DD MMM YYYY")}{" "}
        {timestampToLocalDate(el.date, "H:mm UTC").padStart(9, "0")}{" "}
        {formatTimezone(el.date)}
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
              {timestampToLocalDate(game.date, "D MMM YYYY")}{" "}
              {timestampToLocalDate(game.date, "H:mm UTC").padStart(9, "0")}{" "}
              {formatTimezone(game.date)}
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
                <select
                  className="select-input"
                  name="Game"
                  {...bindMatch}
                  style={{ textAlignLast: "left" }}
                >
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
                      <TutorialPopup content="Bets are refunded on a draw result.">
                        <span>Set Handicap to 0</span>
                      </TutorialPopup>
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
              <input
                className="text-input"
                maxLength="100"
                type="text"
                {...bindTitle}
              ></input>
              <br />
              <span>Description</span>
              <br />
              <textarea
                className="form-control description-box"
                rows="5"
                id="description"
                placeholder="Type something..."
                {...bindDescription}
                cols="200"
                maxlength="200"
              ></textarea>
              <div align="right">
                <p className="small-text mt-2">*{charsLeft} characters left</p>
              </div>
            </form>
          </div>
          <div className="col-md-6 col-12">
            <form className="grey">
              <TutorialPopup content="This is the cryptocurrency which players can play with.">
                <span>Please select the currency for the Pool</span>
              </TutorialPopup>
              <br />
              <select className="select-input" name="Crypto" {...bindCoin}>
                {supportedCoinOptions}
              </select>
              <br />
              <TutorialPopup content="The amount of CAL staked will determine the Max Pool Size. 50% of your CAL will be burnt and another 50% will be sent to stakers after the match has ended successfully.">
                <span>Pool Creation Fee in CAL</span>
              </TutorialPopup>
              <br />
              <input
                className="text-input"
                type="number"
                value={calAmount}
                id="calAmountInput"
                min="0"
                onChange={(e) => {
                  setCalAmount(e.target.value);
                }}
              />
              <br />
              <TutorialPopup content="This is the maximum amount of cryptocurrency from all players which the Pool can accept.">
                <span>Max Pool Size in {selectedCoin.label} </span>
              </TutorialPopup>
              <br />
              <div class="form-inline">
                {(maxPoolSize >=
                  Math.floor(
                    roundNumber((LogisticConst.upperLimit - 1) / price)
                  ) && <p>UNLIMITED</p>) || (
                  <>
                    {" "}
                    <input
                      className="text-input"
                      type="number"
                      value={maxPoolSize}
                      id="maxPoolSizeInput"
                      min="0"
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
                          Math.floor(
                            roundNumber((LogisticConst.upperLimit - 1) / price)
                          )
                        )
                      }
                      style={{
                        marginTop: "10px",
                        minWidth: "90px",
                        marginLeft: "10px",
                      }}
                    >
                      <small>UNLIMITED</small>
                    </button>
                  </>
                )}
              </div>
              <br />
              <div className="row">
                <input
                  type="range"
                  class="form-range ml-5"
                  style={{ width: "500px" }}
                  min={getMaxPoolSize(1) / price}
                  max={(LogisticConst.upperLimit - 1) / price}
                  step="0.005"
                  value={maxPoolSize}
                  onChange={(e) => {
                    setMaxPoolSize(e.target.value);
                  }}
                />
              </div>
              <br />
              <TutorialPopup content="All bets will be refunded if pool does not reach this size.">
                <span>Min pool size</span>
              </TutorialPopup>
              <br />
              <input
                className="text-input"
                type="number"
                min="0"
                {...bindMinPoolSize}
              />
              <br />
              <TutorialPopup content="This is the percentage of the Winning bets given to you as a reward for starting the pool. Please note that it is NOT based on total bets played in the pool.">
                <span>Pool Fee (%), max: 95%</span>
              </TutorialPopup>
              <br />
              <input
                className="text-input"
                type="number"
                min="0"
                {...bindFee}
                max="95"
              />
              <br />
              <TutorialPopup content="The minimum amount of cryptocurrencies a player can play with.">
                <span>Minimum Bet Size in {selectedCoin.label} per player</span>
              </TutorialPopup>
              <br />
              <input
                className="text-input"
                type="number"
                {...bindMinBet}
                min="0"
              />
              <br />

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  id="flexCheckDefault"
                ></input>
                <TutorialPopup content=" If enabled, this pool can only be played by addresses which you have whitelisted. Only whitelisted addresses can view and join this private pool.">
                  <label
                    className="form-check-label black"
                    htmlFor="flexCheckDefault"
                  >
                    Private Pool
                  </label>
                </TutorialPopup>
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
