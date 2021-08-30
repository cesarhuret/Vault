import React, { Component } from "react";
import { BrowserRouter as Router, } from "react-router-dom";

import SafeVault from "./contracts/SafeVault.json";
import BlockchainContext from "./context/BlockchainContext";
import Web3 from "web3";
import { Container, Nav, Row, Tab } from "react-bootstrap";
import VaultCreator from "./Components/CreateVault";
import MyVaults from "./Pages/MyVaults";

class App extends Component {
  constructor() {
    super();

    this.state = {
      accounts: null,
      contract: null,
      paytokenContract: null,
      balance: 0,
      web3: new Web3(window.ethereum),
      networkId: 0,
    };
  }

  async componentDidMount() {

    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const balance = this.state.web3.utils.fromWei(await this.state.web3.eth.getBalance(accounts[0]));
        this.state.web3.eth.net.getId().then((networkId) => {this.setState({networkId})})
        this.setState({ accounts, balance })
        const instance = new this.state.web3.eth.Contract(
          SafeVault.abi,
          "0x284fB84D42010F5B192D40CEBAB7421dBE0D2eb3"
        );
        this.setState({contract: instance})
      } catch (error) {
        if (error.code === 4001) { }
        console.log(error)
      }
    }
  }

  async fetchNFTBalance (instance, account) {
    try {
      const contractBalance = await instance.methods.balanceOf(account).call()
      this.setState({contractBalance})
    } catch (e) {
      console.log(e)
    }
  }

  render() {
    try {
      let accountsPromise;

      // Use web3 to get the user's accounts.
      accountsPromise = this.state.web3.eth.getAccounts();

      const web3 = this.state.web3 

      if (this.state.accounts !== null && this.state.contract !== null && this.state.networkId === 4) {
        const instance = this.state.contract
        // console.log(instance)
        this.fetchNFTBalance(instance, this.state.accounts[0])
        return (
          <div className='App'>
            <Router>
              <BlockchainContext.Provider
                value={{ instance, accountsPromise, web3}}
              >
                <Container>
                  <Tab.Container defaultActiveKey="first">
                    <Row>
                        <Nav variant="pills" className='mx-auto' style={{padding: '10px'}}>
                          <Nav.Item>
                            <Nav.Link eventKey="first">Create Vaults</Nav.Link>
                          </Nav.Item>
                          <Nav.Item>
                            <Nav.Link eventKey="second">My Vaults</Nav.Link>
                          </Nav.Item>
                        </Nav>
                    </Row>
                    <Row>
                      <Container>
                        <Tab.Content>
                          <Tab.Pane eventKey="first">
                            <VaultCreator />
                          </Tab.Pane>
                          <Tab.Pane eventKey="second">
                            <MyVaults />
                          </Tab.Pane>
                        </Tab.Content>
                      </Container>
                    </Row>
                  </Tab.Container>
                </Container>
              </BlockchainContext.Provider>
            </Router>
          </div>
        );
      } else {
        throw new Error();
      }
    } catch (error) {
      return <div style={{position: 'absolute', top: '25%', margin: 'auto', left: '20%', right: '20%', textAlign: "center", fontSize: 50}}>Please connect to the Rinkeby network on MetaMask</div>;
    }
  }
}
export default App;
