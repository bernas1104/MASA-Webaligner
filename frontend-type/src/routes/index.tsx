import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from '../pages/Home';
import Alignment from '../pages/Alignment';

const Routes: React.FC = () => (
  <Switch>
    <Route path="/" exact component={Home} />
    <Route path="/alignments" component={Alignment} />
  </Switch>
);

export default Routes;
