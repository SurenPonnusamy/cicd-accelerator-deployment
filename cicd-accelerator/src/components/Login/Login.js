import React, { Component } from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const login = {
	background: "white",
	boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
	width: "-webkit-fill-available",
	padding: "12px 	20px",
	margin: "8px 0",
	border: "1px solid #ccc",
	borderRadius: "4px",
    boxSizing: "border-box"
}

export default class Login extends Component {
	
	constructor() {
		super()
		
		this.state = {
			username: '',
			password: ''
		}
	}
	
	changeHandler = (event) => {
		this.setState(
			{
				username: event.target.value,
				password: event.target.value
			}
		)
	}
	
	componentDidMount() {
		sessionStorage.clear()
	}
	
	submit = () => {
		console.log(this.state)
		if(this.state.username === 'admin' && this.state.password === 'admin') {
			this.props.history.push('/home', {username: this.state.username})
			console.log(this.props.history.location.state.username)
			sessionStorage.setItem('name', this.state.username);
			
		}
		else {
			console.log('Login failed')
		}
	}
	
	render() {
		
		return(
			<Container>
			  <Row xl>
				<Col xl></Col>
				<Col xl>
					<div style={login}>
						<Form>
							<center>
								<Form.Label>Sign In</Form.Label>
								<Form.Group controlId="formBasicEmail">
							<Form.Label>Enter username</Form.Label>
							<Form.Control type="input" placeholder="Enter username" onChange={this.changeHandler}/>
							</Form.Group>
					  <Form.Group controlId="formBasicPassword">
						<Form.Label>Enter password</Form.Label>
						<Form.Control type="password" placeholder="Password" onChange={this.changeHandler}/>
					  </Form.Group>
					  </center>
					</Form>
					<center>
					<ButtonGroup size="lg" className="mb-3">
						<Button onClick={this.submit}>Submit</Button>
					</ButtonGroup>
					</center>
					</div>				
				</Col>
				<Col xl></Col>
			  </Row>
			</Container>
		)
	}
}