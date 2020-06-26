import React from 'react';
import {Switch, Route} from 'react-router-dom';

import AdScreenerTool from './AdScreenerTool.js';
import AdDetailsPage from './AdDetailsPage.js';
import "./App.css";

function App() {
  return (
    <Switch> {/* The Switch decides which component to show based on the current URL.*/}
      <Route exact path='/' component={AdScreenerTool}></Route>
      <Route path='/cluster' component={AdDetailsPage}></Route>
    </Switch>
  );
};

export default App;
 