import React, { useEffect } from "react";
import Main from "../Common/Main";
import { getUserAddress, getPools } from "../../redux/actions";
import { connect, useSelector } from "react-redux";
import Pool from "../Pool/Pools/Pool";
import { useParams } from "react-router-dom";

const UserPools = (props) => {
  const { getUserAddress, getPools } = props;
  const address = useSelector((state) => state.useraddress);
  const pools = useSelector((state) => state.pools) || [];
  const { userName } = useParams();

  useEffect(() => {
    userName && getUserAddress(userName);
  }, [userName]);

  useEffect(() => {
    getPools();
  }, []);

  const userPools = pools
    .filter((el) => el.owner.toLowerCase() == address)
    .map((pool) => <Pool key={pool.id} pool={pool} address={address} />);

  return (
    <Main>
      <div className="container body-section">
        {(userPools.length > 0 && (
          <>
            <h3 className="bold">Pools of {userName}!</h3>
            {userPools}
          </>
        )) || <h3 className="bold">This user has not created any pool yet.</h3>}
      </div>
    </Main>
  );
};

export default connect(null, { getUserAddress, getPools })(UserPools);
