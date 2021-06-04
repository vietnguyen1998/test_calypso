import React from "react";
import NavBar from "./Navbar";
import Loading from "../Common/Loading";
import { ToastContainer } from "react-toastify";

const Main = (props) => {
  return (
    <div>
      <NavBar reload={props.reload} />
      {props.children}

      <Loading show={props.loading} onHide={props.setLoading} />
      <ToastContainer position="bottom-right" autoClose={false} />
    </div>
  );
};

export default Main;
