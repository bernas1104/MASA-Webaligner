import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Main from './pages/main';
import Alignment from './pages/alignment/';

const Routes = () => (
    <BrowserRouter>
        <Switch>
            <Route exact path="/" component={Main}/>
            <Route path="/alignments/new" component={Alignment}></Route>
        </Switch>
    </BrowserRouter>
);

export default Routes;