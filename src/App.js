import React from 'react';
import {Switch, Route} from 'react-router-dom';

import UserClustersDashboard from './UserClustersDashboard.js';
import UserClusterDetailsPage from './UserClusterDetailsPage.js';
import AdDetailsPage from './AdDetailsPage.js';
import LoginForm from './Login.js';
import SearchTool from './SearchTool.js';
import SimilarAdsPage from './SimilarAdsPage.js';

import "./App.css";

function App() {
  return (
    <Switch> {/* The Switch decides which component to show based on the current URL.*/}
      <Route exact path='/login' component={LoginForm}></Route>
      <Route exact path='/' component={AdScreenerTool}></Route>
      <Route path='/usercluster' component={UserClusterDetailsPage}></Route>
      <Route path='/similar_ads' component={SimilarAdsPage}></Route>
      <Route exact path='/' component={UserClustersDashboard}></Route>
      <Route exact path='/search' component={SearchTool}></Route>
      <Route path='/cluster' component={AdDetailsPage}></Route>
    </Switch>
  );
};

export default App;
