import { createStore, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers";
const initialState = {};
const middlewares = [thunk];
export const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(...middlewares),
    // window.REDUX_DEVTOOLS_EXTENSION && window.REDUX_DEVTOOLS_EXTENSION()
  )
);