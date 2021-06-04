import React from 'react';
import './App.css';
import Faucet from './components/Faucet/Faucet';
import Home from './components/Home/Home';
import Staking from './components/Staking/Staking';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import 'react-toastify/dist/ReactToastify.css';

import Swap from './components/Swap/Swap';
import Pools from './components/Pool/Pools/Pools';
import PoolDetail from './components/Pool/PoolDetail';
import CreatePool from './components/Pool/CreatePool/CreatePool';
import Affiliate from './components/Affiliate/Affiliate';
import Tutorial from './components/Tutorials/Tutorial';
import About from './components/About/About';
import MyPool from './components/Pool/MyPool/MyPool';

function App() {
  console.log('test');
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/tutorials">
            <Tutorial />
          </Route>

          <>
            <Route exact path="/swap">
              <Swap />
            </Route>
            <Route exact path="/pools">
              <Pools />
            </Route>
            <Route exact path="/create-pool">
              <CreatePool />
            </Route>
            <Route exact path="/pools/:poolAddress">
              <PoolDetail />
            </Route>
            <Route exact path="/faucet">
              <Faucet />
            </Route>
            <Route exact path="/staking">
              <Staking />
            </Route>
            <Route exact path="/affiliate">
              <Affiliate />
            </Route>
            <Route exact path="/about">
              <About />
            </Route>
            <Route exact path="/my-pool">
              <MyPool />
            </Route>
          </>
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
