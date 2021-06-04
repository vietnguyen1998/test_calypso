import React, { useState, useEffect } from "react";
import Main from "../../Common/Main";
import Searchbar, { searchPool } from "../../Common/Searchbar";
import Sidebar, { TabItems } from "../../Common/Sidebar";
import SortPanel, { SortItems, sortPools } from "../../Common/SortPanel";
import { connect, useSelector } from "react-redux";
import { getPools } from "../../../redux/actions";
import Pool from "../Pools/Pool";
import EndPool from "./EndPool";

const MyPool = (props) => {
  const { getPools } = props;
  const [tab, setTab] = useState(TabItems.all);
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState(SortItems.date);
  const [created, setCreated] = useState(true);
  const pools = useSelector((state) => state.pools) || [];
  const address = useSelector((state) => state.address) || "";
  const filterPools = pools
    .filter((pool) => {
      if (!address.length) return false;
      if (created) {
        return pool.owner.toLowerCase() === address.toLowerCase();
      } else {
        return pool.betUsers
          .map((el) => el.toLowerCase())
          .includes(address.toLowerCase());
      }
    })
    .filter((el) => {
      return tab === TabItems.all ? true : tab === el.game.game;
    })
    .filter((el) => {
      return searchPool(el, searchText);
    })
    .sort((p1, p2) => sortPools(p1, p2, sort));
  const closePools = filterPools.filter((pool) => pool.result.updated);
  const openPools = filterPools.filter((pool) => !pool.result.updated);

  useEffect(() => {
    getPools();
  }, []);

  const openPoolItems = openPools.map((el, id) => {
    return <Pool key={id} pool={el} />;
  });
  const closePoolItems = closePools.map((el, id) => {
    return <EndPool key={id} pool={el} address={address} />;
  });
  return (
    <Main>
      <div style={{ backgroundColor: "#021025" }}>
        <div className="container body-section">
          <div className="row">
            {/* <!-- Side bar -->  */}

            <div className="col-lg-3 mb-4">
              <Sidebar value={tab} setValue={setTab} />
            </div>

            {/* Side bar content */}

            <div className="col-lg-9">
              <div
                className={`my-pool-tab${created ? "-active" : ""}`}
                onClick={() => setCreated(true)}
              >
                <span className={`${created ? "yellow" : "grey"} bold`}>
                  Created Pools
                </span>
              </div>
              <div
                className={`my-pool-tab${!created ? "-active" : ""}`}
                onClick={() => setCreated(false)}
              >
                <span className={`${!created ? "yellow" : "grey"} bold`}>
                  Joined Pools
                </span>
              </div>
              <hr className="tab-hr" />
              <div className="mt-4">
                <Searchbar value={searchText} setValue={setSearchText} />
              </div>
              <br />
              <br />
              <br />

              {/* Sort by */}

              <div className="mb-2">
                <div align="right">
                  <SortPanel value={sort} setValue={setSort} />
                </div>
              </div>

              {/* Pool list */}

              <h3 className="bold white mb-3">Ongoing</h3>
              <div className="col">{openPoolItems}</div>
              <br />
              <br />
              {/* Ended */}

              <h3 className="bold white mb-3">Ended</h3>
              <div className="col">{closePoolItems}</div>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- Footer section  --> */}

      <footer style={{ backgroundColor: "#021025" }}>
        <div className="container" align="center">
          <br />
          <br />
          <br />
          <br />
          <img width="250px" src="/images/logo.png" />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
        </div>
      </footer>
    </Main>
  );
};

export default connect(null, { getPools })(MyPool);
