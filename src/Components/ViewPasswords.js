import React, {useState} from 'react';
import Modal from "react-bootstrap/Modal";
import { Button, Card, Col, Row } from 'react-bootstrap';

function PasswordGrid (props) {

  const rows = [];
  rows.push(
    <Row key='title' style={{borderBottom: '2px solid rgba(100, 100, 100, 1)'}}>
      <Col xs={{span: 12, order: 1}}  md={{span: 4, order: 1}}>
        <p>Name</p>
      </Col>
      <Col xs={{span: 12, order: 2}}  md={{span: 4, order: 2}}>
        <p>Password</p>
      </Col>
    </Row>
  )

  rows.push(
    <CreatePassword addPassword={props.addPassword} vaultID={props.vaultID} key='create'/>
  )

  for (var i = 0; i < props.passwords.length; i++) {
    if(props.passwords[i].correlatedString !== '' || props.passwords[i].passwordString !== '') {
      rows.push(
        <ShowPassword key={i} passwordID={i} passwordName={props.passwords[i].passwordName} password={props.passwords[i].passwordString} deletePassword={props.deletePassword} vaultID={props.vaultID} />
      );
    }
  }

  return rows;
}

function CreatePassword (props) {
  var passwordName = '';
  var password = ''; 

  return (
    <Row style={{ paddingTop: 30}}>
      <Col xs={{span: 12, order: 1}}  md={{span: 4, order: 1}}>
        <input className="form-control mb-3" type="text" placeholder='Password Name' onChange={(e) => {passwordName = e.target.value}}/>
      </Col>
      <Col xs={{span: 12, order: 2}} md={{span: 4, order: 2}}>
      <input className="form-control mb-3" type="password" placeholder='Password' onChange={(e) => {password = e.target.value}}/>
      </Col>
      <Col xs={{span: 12, order: 4}} md={{span: 2, order: 4}}>
        <Button variant='success' onClick={() => { props.addPassword(props.vaultID, passwordName, password)}}>Create</Button>
      </Col>
    </Row>
  )
}

function ShowPassword (props) {
  const [showResults, setShowResults] = React.useState(false)
  return (
    <Row style={{ paddingTop: 30}}>
      <Col xs={{span: 12, order: 1}}  md={{span: 4, order: 1}}>
        <p>{props.passwordName}</p>
      </Col>
      <Col xs={{span: 12, order: 2}} md={{span: 4, order: 2}}>
        { showResults ? <Button variant='danger' onClick={ () => { setShowResults(false) }}>{props.password}</Button> : <Button variant='success' onClick={ () => { setShowResults(true) }}>View Password</Button> }
      </Col>
      <Col xs={{span: 12, order: 3}} md={{span: 2, order: 3}}>
        <Button variant='success' onClick={ () => { navigator.clipboard.writeText(props.password) }}>Copy Password</Button>
      </Col>
      <Col xs={{span: 12, order: 4}} md={{span: 2, order: 4}}>
        <Button variant='danger' onClick={ () => { props.deletePassword(props.vaultID, props.passwordID) }}>Delete</Button>
      </Col>
    </Row>
  )
}

export function PasswordModal(props) {
    const [show, setShow] = useState(false);
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
      <>
        <Col style={{paddingBottom: 30}}  onClick={handleShow}>
            <Card text='white' bg="dark" className='cardhover noselect' style={{padding: '10px'}}>
                <Card.Img variant="top" src="logo192.png" />
                    <Card.Body>
                        <Card.Title style={{color: "white"}}>{props.name}</Card.Title>
                    </Card.Body>
            </Card>
        </Col>
  
        <Modal show={show} onHide={handleClose} size="xl" aria-labelledby="contained-modal-title-vcenter" style={{color: 'white'}} centered>
          <Modal.Header style={{backgroundColor: 'rgba(52, 58, 64, 1)', borderColor: 'rgba(100, 100, 100, 1)'}} closeButton>
            <Modal.Title><strong>{props.name}</strong></Modal.Title>
          </Modal.Header>
          <Modal.Body id='passwords' style={{paddingLeft: 40, paddingRight: 40, backgroundColor: 'rgba(52, 58, 64, 1)'}}>
            <PasswordGrid passwords={props.passwords} deletePassword={props.deletePassword} addPassword={props.addPassword} vaultID={props.tokenID} />
          </Modal.Body>
        </Modal>
      </>
    );
  }