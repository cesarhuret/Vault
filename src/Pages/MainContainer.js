import React, {Component} from "react";
import { Card, Container, Tab, Tabs} from 'react-bootstrap';
import VaultCreator from "../Components/CreateVault";
import MyVaults from "./MyVaults";
import './style.css'

class MainContainer extends Component {

    constructor(props) {
        super(props);
    
        this.state = {
          contract: 0,
          accounts: null,
          name: 'null',
          newPassword: '',
          vaultID: 0,
          selectedVault: 0,
          passwordID: 0,
          passwordName: ''
        };

    }

    render() {
        return ( 
        <div className="App">
            <Container>
                <Card bg='dark' className='justify-content-center my-5' style={{padding: '30px'}}>
                    <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                        <Tab eventKey="create" title="Create Vault">
                            <VaultCreator/>
                        </Tab>
                        <Tab eventKey="vaults" title="My Vaults">
                            <MyVaults/>
                        </Tab>
                    </Tab.Container>
                </Card>
            </Container>
        </div>
        )
    }
}

export default MainContainer;