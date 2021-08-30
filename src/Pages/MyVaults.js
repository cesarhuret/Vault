import React, {Component} from "react";
import { Container, Row} from 'react-bootstrap';
import ReactDOM from 'react-dom';
import { PasswordModal } from "../Components/ViewPasswords";
import BlockchainContext from "../context/BlockchainContext";

class MyVaults extends Component {

    constructor(props) {
        super(props);
    
        this.state = {
          contract: 0,
          accounts: null,
          name: 'null',
          totalVaultsLength: 0,
          showPasswords: false,
          selectedVault: 0,
          selectedVaultName: 'null',
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.deletePassword = this.deletePassword.bind(this);
        this.addPassword = this.addPassword.bind(this);
    }

    async componentDidMount() {
        this.setState({ contract: this.context.instance });
        this.setState({ accounts: await this.context.accountsPromise });
        this.getMyVaults()
    }

    async deletePassword(vaultID, passwordID) {
        try {

            await this.state.contract.methods.deletePassword(vaultID, passwordID)
            .send({ from: this.state.accounts[0], gas: 71000})
            .then(res => {
                console.log('Success', res);
            })
            .catch(err => console.log(err));

        } catch(err) {
            console.log(err);
        }
    }

    async addPassword(vaultID, passwordName, password) {
        try {

            await this.state.contract.methods.addPassword(vaultID, passwordName, password)
            .send({ from: this.state.accounts[0], gas: 150000})
            .then(res => {
                console.log('Success', res);
            })
            .catch(err => console.log(err));

        } catch(err) {
            console.log(err);
        }
    }

    getMyVaults = async () => {
        try {

            var vaultList = [];

            await this.state.contract.methods.totalVaults().call()
            .then(res => {
                this.setState({ totalVaultsLength: res})
            })
            .then(async () => {
                for (let i = 0; i < this.state.totalVaultsLength; i++) {
                    await this.state.contract.methods.ownerOf(i).call()
                    .then(async res => {
                        if(res === this.state.accounts[0])
                        await this.state.contract.methods.getVaultMetadata(i).call({from: this.state.accounts[0]})
                        .then(res => {
                            vaultList.push(
                                <div key={i}>
                                    <PasswordModal name={res.name} passwords={res.passwords} deletePassword={this.deletePassword} addPassword={this.addPassword} tokenID={i}></PasswordModal>
                                </div>
                            )
                        })
                    })
                }
            })
            .catch(err => console.log(err));
            ReactDOM.render(vaultList, document.getElementById('library'))
        } catch(err) {
            console.log(err);
        }
    } 

    handleSubmit(event) {
        this.getMyVaults();
        event.preventDefault();
    }

    render() {

        return ( 
        <div className="App">
            <div>
                <Container style={{textAlign: "left"}}>
                    <Row id='library'></Row>
                </Container>
            </div>
        </div>
        )
    }
}

MyVaults.contextType = BlockchainContext;

export default MyVaults;