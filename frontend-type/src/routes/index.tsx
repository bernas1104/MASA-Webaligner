import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from '../pages/Home';
import Alignment from '../pages/Alignment';
import Results from '../pages/Results';

const Routes: React.FC = () => (
  <Switch>
    <Route path="/" exact component={Home} />
    <Route path="/alignments" component={Alignment} />
    <Route path="/results/:id" component={Results} />
  </Switch>
);

export default Routes;
