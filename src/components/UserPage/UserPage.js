import React, { useEffect, useState } from "react";
import Main from "../Common/Main";
import { createUserName, getUserName, getPools } from "../../redux/actions";
import useInput from "../hook/useInput";
import { connect, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useHistory } from "react-router";

const UserPage = (props) => {
  const { getUserName, getPools } = props;
  const [newName, bindName] = useInput("");
  const address = useSelector((state) => state.address);
  const userName = useSelector((state) => state.username);
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const hasName = userName == "";

  useEffect(() => {
    address && getUserName(address);
  }, [address]);

  useEffect(() => {
    getPools();
  }, []);

  const createName = () => {
    if (newName.includes(" ") || newName == "") {
      toast.error("Name cannot contain space");
    } else {
      try {
        setLoading(true);
        createUserName(newName, address).then(() => history.go(0));
      } catch (err) {
        toast.error("This name already exists");
      }
    }
  };
  return (
    <Main loading={loading} setLoading={setLoading}>
      <div className="container body-section">
        <div>
          <h2>Create or change your User Name:</h2>
          <input
            className="text-input"
            type="text"
            {...bindName}
            style={{ maxWidth: "500px" }}
          ></input>
          <button className={`yellow-btn mt-3 mr-3`} onClick={createName}>
            {hasName ? "Create" : "Change"}
          </button>
        </div>
        {!hasName && (
          <div>
            <button
              className={`yellow-btn mt-3 mr-3`}
              onClick={() => history.push("/my-page/" + userName)}
            >
              {" "}
              Your pools list
            </button>
          </div>
        )}
      </div>
    </Main>
  );
};

export default connect(null, { getUserName, getPools })(UserPage);
