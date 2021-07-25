import React, { useEffect } from "react";
import { shortenAddress } from "../../utils/Utils";
import { Link } from "react-router-dom";
import { connect, useSelector } from "react-redux";
import {
  updateCalBalance,
  updateAddress,
  updateChainId,
  updateEthBalance,
  updateUsdtBalance,
} from "../../redux/actions";
import { toast } from "react-toastify";
import "./Navbar.css";
import { getWeb3 } from "../../utils/Contracts";
import { uiDev, CHAIN_ID } from "../../config";

const NavBar = (props) => {
  const {
    updateCalBalance,
    updateAddress,
    updateChainId,
    updateEthBalance,
    updateUsdtBalance,
    reload,
  } = props;
  const calBalance = useSelector((state) => state.calBalance);
  const usdtBalance = useSelector((state) => state.usdtBalance);
  const ethBalance = useSelector((state) => state.ethBalance);
  const address = useSelector((state) => state.address);
  const chainId = useSelector((state) => state.chainId);
  const ethereum = window.ethereum;

  const connectMetamask = () => {
    ethereum &&
      ethereum
        .request({ method: "eth_requestAccounts" })
        .then(handleAccountChange);
  };

  useEffect(() => {
    if (chainId && Number(chainId) != CHAIN_ID) {
      toast.error("We currently only support Rinkeby Network");
    } else if (ethereum) {
      updateCalBalance(address);
      updateUsdtBalance(address);
      updateEthBalance(address);
    }
  }, [address, chainId, reload]);

  useEffect(() => {
    ethereum &&
      ethereum.request({ method: "eth_chainId" }).then((chainId) => {
        updateChainId(Number(chainId));
      });
    ethereum &&
      ethereum.on("chainChanged", (chainId) => {
        window.location.reload();
      });
  }, []);

  const handleAccountChange = (accounts) => {
    if (accounts.length) {
      updateAddress(accounts[0]);
      getWeb3();
    }
  };

  useEffect(() => {
    ethereum &&
      ethereum.request({ method: "eth_accounts" }).then(handleAccountChange);

    ethereum && ethereum.on("accountsChanged", handleAccountChange);
    return () =>
      ethereum &&
      ethereum.removeListener("accountsChanged", handleAccountChange);
  }, []);

  if (!ethereum) {
    toast.error("Please install Metamask extension");
  }

  return (
    <div className="header">
      {/*  header */}
      <div style={{ backgroundColor: "#021025" }}>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-4 logo my-1">
              <a href="/">
                <img style={{ width: "190px" }} src="/images/logo.png" />
              </a>
            </div>
            <div className="col-md-2 my-auto">
              <div className="balance-box">
                <span>{address ? usdtBalance.toFixed(8) : "0.00"} USDT</span>
              </div>
            </div>
            <div className="col-md-2 my-auto">
              <div className="balance-box">
                <span>{address ? calBalance.toFixed(8) : "0.00"} CAL</span>
              </div>
            </div>
            <div className="col-md-2 my-auto">
              <div className="balance-box">
                <span>{address ? ethBalance.toFixed(8) : "0.00"} ETH</span>
              </div>
            </div>
            {address ? (
              <div
                className="col-md-2 col-12 metamask-btn my-auto"
                align="right"
              >
                <span className="address-head small-text">
                  {shortenAddress(address)}
                </span>
              </div>
            ) : (
              <div
                className="col-md-2 col-12 metamask-btn my-auto"
                align="right"
              >
                <button className="yellow-btn" onClick={connectMetamask}>
                  <span>Connect Metamask</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="navbar-box">
        <div className="container">
          <nav className="navbar navbar-expand-lg navbar-light">
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon" />
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav navbar-right mx-auto">
                <li className="nav-item">
                  <div className="nav-link-box">
                    <Link to="/pools" className="nav-link">
                      Join Pool
                    </Link>
                  </div>
                </li>
                <li className="nav-item">
                  <div className="nav-link-box">
                    <Link to="/create-pool" className="nav-link">
                      Start Pool
                    </Link>
                  </div>
                </li>
                <li className="nav-item">
                  <div className="nav-link-box">
                    <Link to="/tutorials" className="nav-link">
                      Tutorials
                    </Link>
                  </div>
                </li>
                <li className="nav-item">
                  <div className="nav-link-box">
                    <Link to="/staking" className="nav-link">
                      Earn Rewards
                    </Link>
                  </div>
                </li>
                <li className="nav-item">
                  <div className="nav-link-box">
                    <Link to="/swap" className="nav-link">
                      Buy CAL
                    </Link>
                  </div>
                </li>
                <li className="nav-item">
                  <div className="nav-link-box">
                    <Link to="/affiliate" className="nav-link">
                      Affiliates
                    </Link>
                  </div>
                </li>
                <li className="nav-item">
                  <div className="nav-link-box">
                    <Link to="/about" className="nav-link">
                      About Us
                    </Link>
                  </div>
                </li>
                <li className="nav-item">
                  <div className="nav-link-box">
                    <Link to="/my-pool" className="nav-link">
                      My Pools
                    </Link>
                  </div>
                </li>
                <li className="nav-item">
                  <div className="nav-link-box">
                    <Link to="/my-page" className="nav-link">
                      My Page
                    </Link>
                  </div>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </div>
    </div>
    // <Row className='px-4 py-3 bg-secondary text-white justify-content-between'>
    //     <Col xs={4}>
    //         <Row>
    //             <Col xs={2}>
    //                 <Link to='/swap' className='text-white'>Swap</Link>
    //             </Col>
    //             <Col xs={2}>
    //                 <Link to='/pools' className='text-white'>Pools</Link>
    //             </Col>
    //             <Col xs={3}>
    //                 <Link to='/staking' className='text-white'>Staking</Link>
    //             </Col>
    //             <Col xs={3}>
    //                 <Link to='/affiliate' className='text-white'>Affiliate</Link>
    //             </Col>
    //             <Col xs={2}>
    //                 <Link to='/faucet' className='text-white'>Faucet</Link>
    //             </Col>

    //         </Row>
    //     </Col>
    //     <Col xs={8}>
    //         <Row>
    //             <Col xs={1}><Badge variant='info'>{getNetworkName(chainId)}</Badge></Col>
    //             <Col xs={2} className='justify-content-center'><Badge variant='info'>{usdtBalance.toFixed(1)} USDT</Badge></Col>
    //             <Col xs={2}><Badge variant='info'>{calBalance.toFixed(1)} CAL</Badge></Col>
    //             <Col xs={2}><Badge variant='info'>{ethBalance.toFixed(4)} ETH</Badge></Col>
    //             <Col xs={5} className='text-wrap'>
    //                 {   address ?
    //                     <Badge variant='info'>{address}</Badge> :
    //                     <Button variant='danger' onClick={connectMetamask}>Connect Metamask</Button>
    //                 }
    //             </Col>
    //         </Row>
    //     </Col>
    // </Row>
  );
};

export default connect(null, {
  updateCalBalance,
  updateAddress,
  updateChainId,
  updateEthBalance,
  updateUsdtBalance,
})(NavBar);
