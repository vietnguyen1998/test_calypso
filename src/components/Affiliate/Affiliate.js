import React, { useState, useEffect } from "react";
import { connect, useSelector } from "react-redux";
import Main from "../Common/Main";
import WhitelistAddress from "./WhitelistAddress";
import useInput from "../hook/useInput";
import { getAffiliateStatus } from "../../redux/actions";
import { toast } from "react-toastify";
import { getWei, getEther } from "../../utils/Web3Utils";
import { getSigner } from "../../utils/Contracts";
import { getAffiliate, getCal } from "../../utils/Contracts";
import { addresses } from "../../config";
import { isAddress } from "../../utils/Utils";
import { SupportedCoins } from "../../const/Const";
import { Form } from "react-bootstrap";
import OldAddress from "./OldAddress";

const numberOptions = ["10", "50", "100"];

const Affiliate = (props) => {
  const { getAffiliateStatus } = props;
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [approved, setApproved] = useState(false);
  const [tempAddr, bindTempAddr, resetTempAddr] = useInput("");
  const [tempAddrList, setTempAddrList] = useState([]);
  const [tempRemoveList, setTempRemoveList] = useState([]);
  const [calNumber, bindCalNumber] = useInput(
    numberOptions[numberOptions.length - 1]
  );
  const address = useSelector((state) => state.address);
  const signer = getSigner();
  const affiliateSc = getAffiliate() && getAffiliate().connect(signer);
  const calSc = getCal() && getCal().connect(signer);
  const affiliate = useSelector((state) => state.affiliate);
  const maxNumber = affiliate && affiliate._maxNumber;
  const referrals = affiliate && affiliate._referrals;
  const awards = affiliate && affiliate._awards;
  console.log("temp", tempAddrList, tempRemoveList);
  useEffect(() => {
    updateAffiliate();
  }, [address]);

  const approveCal = () => {
    setLoading(true);
    calSc &&
      calSc
        .approve(addresses.affiliate, getWei(calNumber))
        .then((tx) => {
          tx.wait().then(() => {
            setLoading(false);
            setApproved(true);
            toast.info(
              "Approved successfully. Can submit to become an affiliate."
            );
          });
        })
        .catch((err) => {
          setLoading(false);
          toast.error(err.message);
        });
  };

  const becomeAffiliate = () => {
    setLoading(true);
    affiliateSc &&
      affiliateSc
        .increaseNumberAddress(Number(calNumber))
        .then((tx) => {
          tx.wait().then(() => {
            setLoading(false);
            toast.info(
              "You are an affiliate now. Can add referrals to earn passive income."
            );
            updateAffiliate();
          });
        })
        .catch((err) => {
          setLoading(false);
          toast.error(err.message);
        });
  };

  const updateAffiliate = () => {
    address && getAffiliateStatus(address);
  };

  const calNumberOptions = numberOptions.map((item, id) => {
    return (
      <option key={id} value={item}>
        {item}
      </option>
    );
  });

  const addToTempList = () => {
    if (!address || !tempAddr) return;
    if (address.toLowerCase() == tempAddr.toLowerCase()) {
      return toast.error("Can not add your own address.");
    }
    if (!isAddress(tempAddr)) {
      return toast.error("Please input correct ERC20 address.");
    }
    if (!tempAddrList.includes(tempAddr)) {
      setTempAddrList([...tempAddrList, tempAddr]);
      resetTempAddr();
    } else {
      toast.error("This address is already added.");
    }
  };

  const saveList = async () => {
    setLoading(true);
    try {
      const tx = await affiliateSc.saveMultiAddrs(tempAddrList, tempRemoveList);
      await tx.wait();
      setLoading(false);
      setTempRemoveList([]);
      setTempAddrList([]);
      updateAffiliate();
    } catch (err) {
      setLoading(false);
      toast.error(err.message);
    }
  };

  const claimReward = () => {
    setLoading(true);
    affiliateSc
      .unStake()
      .then((tx) => {
        tx.wait().then(() => {
          setLoading(false);
          setReload(!reload);
          updateAffiliate();
        });
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.message);
      });
  };

  const addedItems = tempAddrList.map((item, id) => {
    const removeFromList = () => {
      setTempAddrList(tempAddrList.filter((el) => el != item));
    };
    return (
      <WhitelistAddress onRemove={removeFromList} key={id} address={item} />
    );
  });

  const oldItems =
    referrals &&
    referrals.map((item, id) => {
      const toggleChecked = (checked) => {
        if (checked) {
          setTempRemoveList([...tempRemoveList, item]);
        } else {
          setTempRemoveList(tempRemoveList.filter((el) => el !== item));
        }
      };
      return (
        <OldAddress
          key={id}
          address={item}
          isChecked={tempRemoveList.includes(item)}
          toggleCheck={toggleChecked}
        />
      );
    });

  const awardItems =
    awards &&
    SupportedCoins.map((item, id) => {
      return (
        <li key={id}>
          {getEther(awards[id])} {item.label}
        </li>
      );
    });
  return (
    <Main reload={reload} loading={loading} setLoading={setLoading}>
      <div className="container body-section">
        <h3 className="black bold">Affiliates</h3>
        <p className="grey mt-4">
          Affiliates are simply addresses which are whitelisted by the Pool
          Creator. A Pool Creator can create a Pool which only whitelisted
          addresses can participate in. The list of whitelisted addresses will
          be tagged to the Metamask Wallet address used to add the wallet
          addresses
        </p>
        {(maxNumber == 0 || !maxNumber) && (
          <div className="row mt-5">
            <div className="col-md-7">
              <Form.Group>
                <p className="black bold">
                  Become an affiliate. Deposit CAL to add referrals (1 CAL = 1
                  Referral):
                </p>
                <Form.Control as="select" {...bindCalNumber}>
                  {calNumberOptions}
                </Form.Control>
                <div className="mt-3" align="right">
                  <button
                    onClick={approved ? becomeAffiliate : approveCal}
                    className={`mr-3 yellow-btn`}
                  >
                    {approved ? "Submit" : "Approve"}
                  </button>
                </div>
              </Form.Group>
            </div>
          </div>
        )}
        {maxNumber > 0 && (
          <>
            <div className="row mt-3">
              <div className="col-md-7">
                <p className="black bold">
                  Please input ERC20 addresses to be whitelisted (
                  {maxNumber - ((referrals && referrals.length) || 0)} left)
                </p>
                <form className="grey">
                  <input
                    className="text-input mb-2"
                    type="text"
                    placeholder="Enter whitelist address"
                    {...bindTempAddr}
                  ></input>
                </form>
                <div align="center">
                  <button className="add-whitelist-btn" onClick={addToTempList}>
                    +
                  </button>
                </div>
                <div className="col mt-2">{addedItems}</div>
                {(tempAddrList.length > 0 || tempRemoveList.length > 0) &&
                  maxNumber > 0 && (
                    <div align="right">
                      <button
                        className="yellow-btn mt-4"
                        align="right"
                        onClick={saveList}
                      >
                        Save Change
                      </button>
                    </div>
                  )}
                <br />
                <hr />
                <p className="black bold mt-4">
                  Your current whitelisted addresses
                </p>
                <div className="col">{oldItems}</div>
                <br />
                <br />
              </div>
              <div className="col-md-5" style={{ paddingLeft: "100px" }}>
                <p className="black bold">Awards</p>
                <ul>{awardItems}</ul>
                {awards && awards.some((el) => getEther(el) != 0) && (
                  <button className="yellow-btn" onClick={claimReward}>
                    Unstake
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </Main>
  );
};

export default connect(null, { getAffiliateStatus })(Affiliate);
