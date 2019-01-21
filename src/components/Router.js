import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import App from '../App';
import Profile from './Profile';

const Router = () => (
  <BrowserRouter>
    <div className="wiztagram">
      <h2 className="title">Wiztagram</h2>
      <Switch>
        <Route path="/profile/:profileId" component={Profile} />
        <Route exact path="/app" component={App} />
      </Switch>
    </div>
  </BrowserRouter>
);

export default Router;
