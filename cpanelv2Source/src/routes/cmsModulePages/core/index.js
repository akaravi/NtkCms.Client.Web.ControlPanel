import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import CoreSiteActlist from "./CoreSiteActlist";
const Core = ({ match }) => (
    <div className="dashboard-wrapper">
        <Switch>
            <Redirect exact from={`${match.url}/`} to={`${match.url}/CoreSiteActlist`} />
            <Route path={`${match.url}/CoreSiteActlist`} component={CoreSiteActlist} />            
            {/* <Route path={`${match.url}/thumb-list`} component={thumbList} />            
            <Route path={`${match.url}/image-list`} component={imageList} />            
            <Route path={`${match.url}/details`} component={details} />            
            <Route path={`${match.url}/search`} component={search} />  
            <Route path={`${match.url}/invoice`} component={invoice} />  
            <Route path={`${match.url}/mailing`} component={mailing} />   */}
            <Redirect to="/error" /> 
          
        </Switch>
    </div>
);

export default Core;