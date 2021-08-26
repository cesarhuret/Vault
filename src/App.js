import React, { Component } from "react";
import { BrowserRouter as Router, } from "react-router-dom";

import SafeVault from "./contracts/SafeVault.json";
import BlockchainContext from "./context/BlockchainContext";
import Routes from "./Routes";
import Web3 from "web3";
import { Nav, Navbar } from "react-bootstrap";

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
          "0x4A8c3DdA7ef307FAe6821E0468cEaa70B31533b7"
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
        this.fetchNFTBalance(instance, this.state.accounts[0])
        return (
          <div className='App'>
            <Router>
              <BlockchainContext.Provider
                value={{ instance, accountsPromise, web3}}
              >
                <Navbar bg='none' variant="light" expand="lg" fixed='top' style={{ position: "sticky", top: 0}}>
                  <Navbar.Brand href='#home'>Planeth</Navbar.Brand>
                    <Nav.Link>
                      {" "}
                      Signed in as: {this.state.accounts[0]}
                    </Nav.Link>

                  <Navbar.Collapse className='justify-content-end'>
                    <Nav className='mr-auto'>
                      <Nav.Link href="/">Home</Nav.Link>
                      <Nav.Link href="/vaults">My Vaults</Nav.Link>
                      <Nav.Link href="/mint">Create a Vault</Nav.Link>
                    </Nav>
                    <Navbar.Text>Balance: {this.state.contractBalance} Vaults</Navbar.Text>
                  </Navbar.Collapse>
                </Navbar>
                <Routes/>
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
