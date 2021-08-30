import React, {Component} from "react";
import {Button, Card} from 'react-bootstrap';
import BlockchainContext from "../context/BlockchainContext";

class CreateVault extends Component {

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

        this.changeName = this.changeName.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.newPassword = this.newPassword.bind(this);
        this.addPassword = this.addPassword.bind(this);
        this.changeVault = this.changeVault.bind(this);
        this.selectVault = this.selectVault.bind(this);
        this.selectPasswordToDelete = this.selectPasswordToDelete.bind(this);
        this.deletePassword = this.deletePassword.bind(this);
        this.passwordName = this.passwordName.bind(this);
    }

    async componentDidMount() {
        this.setState({ contract: this.context.instance });
        this.setState({ accounts: await this.context.accountsPromise }); 
    }

    changeName(event) {
        this.setState({name: event.target.value})
    }

    newPassword(event) {
        this.setState({newPassword: event.target.value})
    }

    passwordName(event) {
        this.setState({passwordName: event.target.value})
    }

    changeVault(event) {
        this.setState({vaultID: parseInt(event.target.value)})
    }

    selectVault(event) {
        this.setState({selectedVault: parseInt(event.target.value)})
    }

    selectPasswordToDelete(event) {
        this.setState({passwordID: parseInt(event.target.value)})
    }

    createSafeVault = async () => {
        try {

            await this.state.contract.methods.mintVault(this.state.name)
            .send({ from: this.state.accounts[0], value: 0.0001 * 10 ** 18 })
            .then(res => {
                console.log('Success', res);
            })
            .catch(err => console.log(err));

        } catch(err) {
            console.log(err);
        }
    }

    handleSubmit(event) {
        console.log(`Name: ${this.state.name}`)
        this.createSafeVault();
        event.preventDefault();
    }

    async addPassword(event) {
        console.log(this.state.newPassword)
        console.log(this.state.vaultID)
        console.log(this.state.passwordName)
        try {

            await this.state.contract.methods.addPassword(this.state.vaultID, this.state.passwordName, this.state.newPassword)
            .send({ from: this.state.accounts[0]})
            .then(res => {
                console.log('Success', res);
            })
            .catch(err => console.log(err));

        } catch(err) {
            console.log(err);
        }
        event.preventDefault();
    }

    async deletePassword(vaultID, passwordID) {
        try {

            await this.state.contract.methods.deletePassword(vaultID, passwordID)
            .send({ from: this.state.accounts[0]})
            .then(res => {
                console.log('Success', res);
            })
            .catch(err => console.log(err));

        } catch(err) {
            console.log(err);
        }
    }

    render() {
        return ( 
        <div className="App">
            <Card className='center' style={{width: '40rem'}}>
                <Card.Body>
                    <Card.Title>Create your Vault</Card.Title>
                    <div className="mb-3">
                        <input className="form-control" type="text" onChange={this.changeName} placeholder='Vault Name'/>
                    </div>
                    <Button onClick={this.handleSubmit}>Submit</Button>
                </Card.Body>
            </Card>
            {/* <Card className='center' style={{width: '40rem'}}>
                <Card.Body>
                    <Card.Title>Add Password</Card.Title>
                    <div className="mb-3">
                        <input className="form-control" type="text" onChange={this.changeVault} placeholder='Vault ID'/>
                        <input className="form-control" type="text" onChange={this.passwordName} placeholder='Password Name'/>
                        <input className="form-control" type="text" onChange={this.newPassword} placeholder='New Password'/>
                    </div>
                    <Button onClick={this.addPassword}>Submit</Button>
                </Card.Body>
            </Card>
            <Card className='center' style={{width: '40rem'}}>
                <Card.Body>
                    <Card.Title>Delete Password</Card.Title>
                    <div className="mb-3">
                        <input className="form-control" type="text" onChange={this.selectVault} placeholder='Vault ID'/>
                        <input className="form-control" type="text" onChange={this.selectPasswordToDelete} placeholder='Password ID'/>
                    </div>
                    <Button onClick={this.deletePassword}>Submit</Button>
                </Card.Body>
            </Card> */}
        </div>
        )
    }
}

CreateVault.contextType = BlockchainContext;

export default CreateVault;