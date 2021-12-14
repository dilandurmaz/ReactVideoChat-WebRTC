import React from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import CreateRoom from "./routes/CreateRoom";
import Nav from "./routes/Nav"
import Room from "./routes/Room";
import "./App.css"

function App() {
  return (
    <>
    <Nav/>
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={CreateRoom} />
        <Route path="/room/:roomID" component={Room} />
      </Switch>
    </BrowserRouter>
    </>
  );
}

export default App;
