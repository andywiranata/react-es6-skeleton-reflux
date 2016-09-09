'use strict';

import React                                    from 'react';
import {hashHistory, Router, Route, IndexRoute} from 'react-router';
import App                                      from './pages/app.jsx';
import Home                                     from './pages/home.jsx';

const routes = (
    <Router onUpdate={() => window.scrollTo(0, 0)}  history={hashHistory}>
        <Route path='/' component={ App }>
            <IndexRoute component={ Home } />
            <Route path='home' component={ Home }/>
        </Route>
    </Router>
);

export default routes;
