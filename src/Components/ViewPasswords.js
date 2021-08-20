import React, {Component} from 'react';
import Modal from "react-bootstrap/Modal";
import BlockchainContext from "../context/BlockchainContext";
import { Col, Row } from 'react-bootstrap';
import ReactDOM from 'react-dom';

class Passwords extends Component {

    constructor(props) {
        super(props);

        this.state = {
            contract: 0,
            accounts: null,
        }
    }

    async componentDidMount () {
        this.setState({ contract: this.context.instance });
        this.setState({ accounts: await this.context.accountsPromise });
        // this.getPasswords();
    }

    async getPasswords () {
        var passwordList = [];

        await this.state.contract.methods.getPasswords(this.props.tokenID).call({from: this.state.accounts[0]})
        .then(res => {
            for (let i = 0; i < res.passwords.length; i++) {
                passwordList.push(
                    <Row key={i}>
                        <Col>
                            <p>Password Name: <b>{res.passwords[i].correlatedString}</b> <br/> Password: <b>{res.passwords[i].passwordString}</b></p>
                            <hr />
                        </Col>


                    </Row>
                )
            }
            ReactDOM.render(passwordList, document.getElementById('passwords'))
        })
    }


    render() {
        return (
            <Col>
                <Modal.Header>
                    <Modal.Title>{this.props.vaultName}</Modal.Title>
                </Modal.Header>
                <div id='passwords' style={{padding: 10, overflowY: 'scroll'}}>
                            {/* <Button variant="primary" style={{ margin: "10px" }} onClick={this.handleSubmission}>Submit</Button> */}
                </div>
            </Col>

        );
    }
}

Passwords.contextType = BlockchainContext;

export default Passwords;
