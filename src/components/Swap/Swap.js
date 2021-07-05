import React, { useState, useEffect } from "react";
import Main from "../Common/Main";
import Address from "../../const/Address";
import { toNumber } from "../../utils/Utils";
import {
  getCalSwap,
  getUsdt,
  getOracle,
  getSigner,
} from "../../utils/Contracts";
import { connect, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getWei } from "../../utils/Web3Utils";
import useInput from "../hook/useInput";

const Swap = () => {
  const [coin, bindCoin] = useInput("ETH");
  const [available, setAvailable] = useState(0);
  const [coinAmount, setCoinAmount] = useState("0");
  const [calAmount, setCalAmount] = useState("0");
  const [price, setPrice] = useState(1);
  const [swapTokenEnabled, setSwapTokenEnabled] = useState(false);
  const [approveTokenEnabled, setApproveTokenEnabled] = useState(false);
  const [swapEthEnabled, setSwapEthEnabled] = useState(false);

  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(false);

  const signer = getSigner();
  const CalSwap = getCalSwap() && getCalSwap().connect(signer);
  const USDT = getUsdt() && getUsdt().connect(signer);
  const Oracle = getOracle();
  const address = useSelector((state) => state.address);
  const ethBalance = useSelector((state) => state.ethBalance);
  const usdtBalance = useSelector((state) => state.usdtBalance);

  useEffect(() => {
    if (coin == "ETH") {
      setAvailable(ethBalance);
      Oracle && Oracle.getEthPrice().then((val) => setPrice(val / 1e8));
    } else {
      setAvailable(usdtBalance);
      setPrice(1);
      setSwapEthEnabled(false);
    }
  }, [coin, CalSwap]);

  useEffect(() => {
    setCalAmount(String(toNumber(coinAmount) * price));
    setApproveTokenEnabled(coinAmount > 0 && coinAmount <= available);
    setSwapEthEnabled(coinAmount > 0 && coinAmount <= available);
  }, [coinAmount, price]);

  useEffect(() => {
    setCoinAmount(String(toNumber(calAmount) / price));
  }, [calAmount]);

  useEffect(() => {
    setAvailable(coin == "ETH" ? ethBalance : usdtBalance);
  }, [ethBalance, usdtBalance]);

  const approveUsdt = () => {
    setLoading(true);
    USDT.approve(Address.calSwap, getWei(coinAmount))
      .then((tx) => {
        tx.wait().then(() => {
          setApproveTokenEnabled(false);
          setSwapTokenEnabled(true);
          toast.success("Approved successfully!");
          setReload(!reload);
          setLoading(false);
        });
      })
      .catch((error) => {
        toast.error(error.message);
        setLoading(false);
      });
  };

  const swap = () => {
    setLoading(true);
    CalSwap.swap(getWei(coinAmount))
      .then((tx) => {
        tx.wait().then(() => {
          toast.success("Swap successfully!");
          setReload(!reload);
          setLoading(false);
          setApproveTokenEnabled(true);
          setSwapTokenEnabled(false);
          setCoinAmount("0");
        });
      })
      .catch((error) => {
        toast.error(error.message);
        setLoading(false);
      });
  };

  const swapEth = () => {
    setLoading(true);
    signer
      .sendTransaction({
        to: Address.calSwap,
        value: getWei(coinAmount),
      })
      .then((tx) => {
        tx.wait().then(() => {
          toast.success("Swap successfully!");
          setReload(!reload);
          setLoading(false);
          setCoinAmount("0");
        });
      })
      .catch((error) => {
        toast.error(error.message);
        setLoading(false);
      });
  };

  const clickMax = () => {
    setCoinAmount(String(available));
  };
  return (
    <Main reload={reload} loading={loading} setLoading={setLoading}>
      <div style={{ display: "table", marginLeft: "20px" }}>
        <div style={{ display: "table-row" }}>
          <div
            className="container body-section"
            style={{ display: "table-cell", width: "75%" }}
          >
            <h3 className="black bold">Buy CAL tokens</h3>
            <div className="row">
              <div className="col-md-6 col-12">
                <div className="grey mt-3">
                  <span>Swap</span>
                  <br />
                  <input
                    style={{ width: "77%" }}
                    className="text-input mr-2"
                    placeholder="Enter number"
                    type="number"
                    value={coinAmount}
                    onChange={(e) => setCoinAmount(e.target.value)}
                  ></input>
                  <select
                    style={{ width: "20%", minWidth: "87px" }}
                    class="select-input"
                    name="Game"
                    {...bindCoin}
                  >
                    <option value="ETH">ETH</option>
                    <option value="USDT">USDT</option>
                  </select>
                  <br />
                  <p className="black">
                    1 {coin} = {price} CAL
                  </p>
                  <span>To</span>
                  <br />
                  <input
                    style={{ width: "77%" }}
                    className="text-input mr-2"
                    placeholder="Enter number"
                    type="number"
                    value={calAmount}
                    onChange={(e) => setCalAmount(e.target.value)}
                  ></input>
                  <span className="black">CAL</span>
                  <br />
                  {coin === "ETH" && (
                    <button
                      className={`${
                        swapEthEnabled ? "yellow" : "grey"
                      }-btn mt-3 mr-3`}
                      disabled={!swapEthEnabled}
                      onClick={swapEth}
                    >
                      Confirm Swap
                    </button>
                  )}
                  {coin === "USDT" && (
                    <div>
                      <button
                        className={`${
                          approveTokenEnabled || swapTokenEnabled
                            ? "yellow"
                            : "grey"
                        }-btn mt-3 mr-3`}
                        onClick={approveTokenEnabled ? approveUsdt : swap}
                      >
                        {!swapTokenEnabled ? "Approve USDT" : "Confirm Swap"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div style={{ display: "table-cell" }}>
            <p>Maximum Total Supply: 1 Billion CAL tokens</p>
            <p>
              CAL Token Contract:{" "}
              <a href="https://rinkeby.etherscan.io/token/0xc1ea3959b49b903fb47ebbd30b236c09a7e02ade?a=0xf448ff5248bf9c10602ff5ac30052c7a7011966a">
                Link
              </a>
            </p>
            <p>Launch Price of CAL: 1 USDT per CAL token</p>
            <a href="/Whitepaper.txt" download>
              [Download Whitepaper]
            </a>
          </div>
        </div>
      </div>
    </Main>
  );
};

export default connect(null)(Swap);
