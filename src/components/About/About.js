import React from "react";
import Main from "../Common/Main";

const About = () => {
  return (
    <Main>
      <div className="container body-section">
        <h3 className="black bold">What Is Calypso</h3>
        <p className="grey mt-4">
          Calypso is a Gaming-as-a-DeFi (GAAD) platform. We are not operators
          nor do we hold any database of players. Decentralization is the main
          theme in Calypso. All pools are started by individuals who are keen to
          setup their own game. Calypso GaaD platform gives freedom for anyone
          to operate their own gaming community.
          <br />
          <br />
          Use Calypso at your own risk. Only play with what you can afford to
          lose.
        </p>
        <a href="/Whitepaper.txt" download>
          [Download Whitepaper]
        </a>
      </div>
    </Main>
  );
};

export default About;
