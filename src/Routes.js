import React from 'react';
import { Route, Switch } from 'react-router-dom';
import MainContainer from './Pages/MainContainer';
import MyVaults from './Pages/MyVaults';
// import Minter from "./Pages/Minter";

function Routes() {
    return (
        <Switch>
            <Route exact path="/">                
                <MainContainer/>
            </Route>
            <Route path="/vaults">                
                <MyVaults/>
            </Route>
        </Switch>
    );
}

export default Routes;