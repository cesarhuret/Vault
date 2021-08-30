import { NFTStorage } from "nft.storage";
import React, {Component} from "react";
import { Button, Card } from 'react-bootstrap';
import BlockchainContext from "../context/BlockchainContext";

class VaultCreator extends Component {

    constructor(props) {
        super(props);
    
        this.state = {
          contract: 0,
          accounts: null,
          name: 'null',
          description: null,
          selectedFile: null,
        };

        this.changeName = this.changeName.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async componentDidMount() {
        this.setState({ contract: this.context.instance });
        this.setState({ accounts: await this.context.accountsPromise }); 
    }

    changeName(event) {
        this.setState({name: event.target.value})
    }

    createSafeVault = async () => {
        try {


            const apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDU0MDJDNmQ2NDg0ZTlDOThCZjgxNmUzNzJjNTNBQTM4RDc0ODJCNDAiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYzMDI4MDgyMTc1MiwibmFtZSI6IlNhZmUgVmF1bHQifQ.sZXUktgglztd4Kx1EaOAAFv8XP-CTWRYbLlDbh-pL10";
            const client = new NFTStorage({ token: apiKey })
        
            const metadata = await client.store({
              name: this.state.name,
              description: this.state.description, 
              image: this.state.selectedFile
            });
            console.log(metadata.url)
            
            await this.state.contract.methods.mintVault(metadata.url, this.state.name)
            .send({ from: this.state.accounts[0], value: 0.0001 * 10 ** 18, gas: 300000 })
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

    render() {
        return (
        <div className="App">
            <Card text='white' bg="dark" className='cardhover noselect' style={{padding: '30px'}}>
                <input className="form-control mb-3" type="text" onChange={this.changeName} placeholder='Vault Name'/>
                <input className="form-control mb-3" type="text" onChange={ (e) => {this.setState({ description: e.target.value })}} placeholder='Description'/>
                <input className="form-control mb-3" accept="image/png, image/jpeg" type="file" onChange={ (e) => { this.setState({ selectedFile: e.target.files[0] })}} style={{background: 'none', border: 'none', color: 'white'}} />
                <Button onClick={this.handleSubmit}>Submit</Button>
            </Card>
        </div>
        )
    }
}

VaultCreator.contextType = BlockchainContext;

export default VaultCreator;