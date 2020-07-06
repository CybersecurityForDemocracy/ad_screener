import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from "react-bootstrap/Button";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Toast from 'react-bootstrap/Toast';
import axios from "axios";

function LabelEntryForm() {
	var labelName = "";
	const [validated, setValidated] = useState(false);
	const [show, setShow] = useState(false);
	const [message, setMessage] = useState("");
	const [style, setStyle] = useState({});

	const handleSubmit = (event) => {
		const form = event.currentTarget;
		event.preventDefault();

		if (form.checkValidity() === false) {
			event.stopPropagation();
		}

		else{
			labelName = form.topic_name.value;
			console.log(labelName);
			axios
			.post('/insert-user-suggested-topic-name/'+labelName)
			.then((response) => {
				console.log(response.data);
				setShow(true);
				setMessage("Topic suggestion submitted successfully.");
				setStyle({color: 'green'});
			})
			.catch((error) => {
				console.log(error);
				setShow(true);
				setMessage("There was a problem in submitting your suggestion.");
				setStyle({color: 'red'});
			})
			.finally(() => {});
		}
		setValidated(true);
	}

	return (
		<div>
			<Row>
				<Col xs={3}></Col>
				<Col xs={6}>
					<Toast 
					  onClose={() => setShow(false)} 
					  show={show} 
					  delay={2000} 
					  autohide
					  style={style}
					>
					  <Toast.Body>{message}</Toast.Body>
					</Toast>
				</Col>
				<Col xs={3}></Col>
			</Row>
			<Form noValidate validated={validated} onSubmit={handleSubmit}>
			  <Form.Row>
				  <Form.Group as={Col} md="4">
				  	<Form.Label>Suggest Topic</Form.Label>
					<Form.Control
					required
					type="text"
					id="topic_name"
					placeholder="Enter topic name"
					/>
					<Form.Control.Feedback type="invalid" className="mb-2 mr-sm-2">
					Please enter a topic name.
					</Form.Control.Feedback>
				  </Form.Group>
			  </Form.Row>
			  <Button type="submit">
			    Submit
			  </Button>
			</Form>
		</div>
	);
}

export default LabelEntryForm