import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import FormPage from "./components/form-page";
import MapPage from "./components/map-page";
import { Route } from "react-router-dom";

function App() {
  return (
    <div>
      <Route exact path="/" render={() => <FormPage />} />
      <Route path="/map-page" render={() => <MapPage />} />
    </div>
  );
}

export default App;
