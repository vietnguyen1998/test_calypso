import React, { useEffect, useState } from "react";
import Main from "../../Common/Main";
import { getPools } from "../../../redux/actions";
import { connect, useSelector } from "react-redux";
import Pool from "./Pool";
import Sidebar, { TabItems } from "../../Common/Sidebar";
import Searchbar, { searchPool } from "../../Common/Searchbar";
import SortPanel, { SortItems, sortPools } from "../../Common/SortPanel";

const Pools = (props) => {
  const { getPools } = props;
  const pools = useSelector((state) => state.pools) || [];
  const [tab, setTab] = useState(TabItems.all);
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState(SortItems.date);
  const address = useSelector((state) => state.address);

  const filterPools = pools
    .filter((el) => {
      if (!address || !el.isPrivate || address == el.owner) return true;
      const whitelist =
        el.whitelist && el.whitelist.map((it) => it.toLowerCase());
      if (!whitelist) return true;
      return whitelist.includes(address.toLowerCase());
    })
    .filter((el) => {
      return tab === TabItems.all ? true : el.game.game === tab;
    })
    .filter((el) => {
      return searchPool(el, searchText);
    })
    .sort((pool1, pool2) => {
      return sortPools(pool1, pool2, sort);
    });

  useEffect(() => {
    getPools();
  }, []);

  const poolItems = filterPools.map((el, id) => {
    return <Pool key={id} pool={el} address={address} />;
  });

  return (
    <Main>
      <div style={{ backgroundColor: "#021025" }}>
        <div className="container body-section">
          <div className="row">
            <div className="col-lg-3 mb-4">
              <Sidebar value={tab} setValue={setTab} />
            </div>
            <div className="col-lg-9">
              <div>
                <Searchbar value={searchText} setValue={setSearchText} />
              </div>

              {/* Sort by */}
              <div className="mb-3">
                <br />
                <br />
                <br />
                <div align="right">
                  <SortPanel value={sort} setValue={setSort} />
                </div>
              </div>

              {/* Pool list */}
              <div className="mx-3">{poolItems}</div>
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

export default connect(null, { getPools })(Pools);
