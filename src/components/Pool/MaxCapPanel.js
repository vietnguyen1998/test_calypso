import React, { useState, useEffect, useMemo } from "react";
import useInput from "../hook/useInput";
import { getCal, getSigner, getOracle } from "../../utils/Contracts";
import { getWei } from "../../utils/Web3Utils";
import { getMaxPoolSize, roundNumber } from "../../utils/Utils";
import { toast } from "react-toastify";
import { ZeroAddress } from "../../const/Const";

const MaxCapPanel = (props) => {
  const {
    address,
    poolAddress,
    onReload,
    setLoading,
    bettingPool,
    coin,
    coinName,
    depositedCal,
  } = props;
  const [amount, bindAmount, resetAmount] = useInput("0");
  const [approved, setApproved] = useState(false);
  const calSC = getCal() && getCal().connect(getSigner());
  const [price, setPrice] = useState(1);
  const Oracle = getOracle();
  useEffect(() => {
    if (coin === ZeroAddress) {
      Oracle && Oracle.getEthPrice().then((val) => setPrice(val / 1e8));
    } else {
      setPrice(1);
    }
  }, []);

  const poolSize = useMemo(
    () =>
      roundNumber(getMaxPoolSize(Number(amount) + depositedCal) / price) || 0,
    [amount, price]
  );

  const approveToken = () => {
    setLoading(true);
    calSC &&
      address &&
      calSC
        .approve(poolAddress, getWei(amount))
        .then((tx) => {
          tx.wait().then(() => {
            setLoading(false);
            setApproved(true);
            toast.success(
              "Approved successfully. Please click the Add Max Cap button now."
            );
          });
        })
        .catch((err) => {
          setLoading(false);
          toast.error(err.message);
        });
  };

  const addMaxCap = () => {
    setLoading(true);
    bettingPool &&
      address &&
      bettingPool
        .addMaxCap(getWei(amount))
        .then((tx) => {
          tx.wait().then(() => {
            setLoading(false);
            setApproved(false);
            onReload();
            resetAmount();
            toast.info("Increased Maxcap successfully!");
          });
        })
        .catch((err) => {
          setLoading(false);
          toast.error(err.message);
        });
  };

  return (
    <>
      <h3 className="bold">Add MaxCap</h3>
      <form className="grey mt-3">
        <span> Amount of CAL to increase ({depositedCal} CAL deposited)</span>
        <br />
        <input className="text-input" type="number" {...bindAmount} />
        <span>
          Pool MaxCap will be {poolSize} {coinName}
        </span>
      </form>
      <br />
      <button
        className="yellow-btn mr-3"
        onClick={approved ? addMaxCap : approveToken}
      >
        {" "}
        {!approved ? "Approve CAL" : "Add MaxCap"}
      </button>
      <br />
      <br />
    </>
  );
};

export default MaxCapPanel;
