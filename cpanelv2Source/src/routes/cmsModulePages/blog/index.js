import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';



const Blog = ({ match }) => (
    <div className="dashboard-wrapper">
        <Switch>
            {/* <Redirect exact from={`${match.url}/`} to={`${match.url}/data-list`} />
            <Route path={`${match.url}/data-list`} component={dataList} />            
            <Route path={`${match.url}/thumb-list`} component={thumbList} />            
            <Route path={`${match.url}/image-list`} component={imageList} />            
            <Route path={`${match.url}/details`} component={details} />            
            <Route path={`${match.url}/search`} component={search} />  
            <Route path={`${match.url}/invoice`} component={invoice} />  
            <Route path={`${match.url}/mailing`} component={mailing} />  
            <Redirect to="/error" /> */}
          
        </Switch>
    </div>
);

export default Blog;