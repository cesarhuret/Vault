import React, {Component} from "react";
import {Button, Card, Col, Container, OverlayTrigger, Popover, Row} from 'react-bootstrap';
import ReactDOM from 'react-dom';
import Passwords from "../Components/ViewPasswords";
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

    }

    async componentDidMount() {
        console.log(this.context)
        this.setState({ contract: this.context.instance });
        this.setState({ accounts: await this.context.accountsPromise });
        this.getMyVaults()
    }

    closeLoader = () => {
        this.setState({
            showPasswords: false
        });
      }

    openLoader = (i, selectedVaultName) => {
        this.setState({
            selectedVault: i,
            selectedVaultName,
            showPasswords: true
        });
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
                        await this.state.contract.methods.getPasswords(i).call({from: this.state.accounts[0]})
                        .then(res => {
                            vaultList.push(
                                <div key={i}>
                                    <Col style={{paddingBottom: 30}}>
                                        <Card text='white' bg="dark" className='cardhover' style={{border: 'none'}}>
                                            {/* <Card.Img variant="top" src="logo192.png" /> */}
                                            <Card.Body>
                                                <Card.Title style={{color: "white"}}>{res.name}</Card.Title>
                                                <OverlayTrigger trigger="click" placement="right" overlay={
                                                <Popover id="popover-basic">
                                                    <Passwords
                                                        tokenID={this.state.selectedVault}
                                                        vaultName={this.state.selectedVaultName}
                                                    />
                                                </Popover>}>
                                                <Button>View Passwords</Button>
                                                </OverlayTrigger>
                                            </Card.Body>
                                        </Card>
                                    </Col>

                                </div>
                            )
                        })
                    })
                }
                // vaultList.push(
                //     <Col style={{paddingBottom: 30}} key={this.state.totalVaultsLength + 1}>
                //         <Card text='white' bg="dark" className='cardhover' style={{border: 'none'}}>
                //             {/* <Card.Img variant="top" src="logo192.png" /> */}
                //             <Card.Body>
                //                 <Button>Create New Vault</Button>
                //             </Card.Body>
                //         </Card>
                //     </Col>
                // )
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
                    <Row className='justify-content-center' id='library'>
                    </Row>
                </Container>
            </div>
        </div>
        )
    }
}

MyVaults.contextType = BlockchainContext;

export default MyVaults;