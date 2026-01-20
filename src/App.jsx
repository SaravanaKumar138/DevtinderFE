import { useState } from "react";

import "./index.css";
import Navbar from "./Components/Navbar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Body from "./Components/Body";
import Login from "./Components/Login";
import Profile from "./Components/Profile";
import appStore from "./utils/appStore";
import {lazy, Suspense} from "react";
import { Provider } from "react-redux";
import Feed from "./Components/Feed";
import Connections from "./Components/Connections";
import Requests from "./Components/Requests";
import Chat from "./Components/Chat";
import Home from "./Components/Home";
import SmartMatches from "./Components/SmartMatches";
import Loading from "./Components/Loading";

const Premium = lazy(() => import("./Components/Premium"));

function App() {
  return (
    <>
      <Provider store={appStore}>
        <BrowserRouter>
          <Routes>
            {/* Public Home */}
            <Route path="/" element={<Home />} />

            {/* Authenticated Layout */}
            <Route element={<Body />}>
              <Route path="/feed" element={<Feed />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/connections" element={<Connections />} />
              <Route path="/requests" element={<Requests />} />
              <Route path="/matches" element={<SmartMatches />} />,
              <Route path="/chat/:targetUserId" element={<Chat />} />
              <Route path="/premium" element={<Suspense fallback={<Loading />}><Premium /></Suspense>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;
