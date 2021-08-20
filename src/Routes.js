import React from 'react';
import { Route, Switch } from 'react-router-dom';
import CreateVault from './Pages/CreateVault';
import MyVaults from './Pages/MyVaults';
// import Minter from "./Pages/Minter";

function Routes() {
    return (
        <Switch>
            <Route exact path="/">                
                <CreateVault/>
            </Route>
            <Route path="/vaults">                
                <MyVaults/>
            </Route>
        </Switch>
    );
}

export default Routes;