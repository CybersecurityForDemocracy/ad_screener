import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from "react-bootstrap/Button";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Toast from 'react-bootstrap/Toast';
import axios from "axios";

const NewTopicSuggestionForAdClusterForm = params => {
	var labelName = "";
	const [validated, setValidated] = useState(false);
	const [show, setShow] = useState(false);
	const [message, setMessage] = useState("Test message");
	const [style, setStyle] = useState({});
	var topic_list = [];
	for(var i=0; i < params.topics.length; i++){
		topic_list.push(params.topics[i].label);
	}

	const handleSubmit = (event) => {
		const form = event.currentTarget;
		event.preventDefault();

		var topicName = form.topic_name.value;
		var comments = form.comments.value != "" ? form.comments.value : "None"
		var topics = form.topic_options;
		var selected_topics = [];
		for (var i = 0; i < topics.length; i++) {
		    if (topics.options[i].selected) selected_topics.push(topics.options[i].value);
		}
		if(topicName != ""){
			selected_topics.push(topicName);
		}
		console.log(comments);
		console.log(selected_topics);
		
		if(selected_topics.length == 0) {
			setShow(true);
			setMessage("Please select or enter a topic name!");
			setStyle({color: 'red'});
		}

		else{
			axios({
				method: 'post',
				url: '/ad-topic-suggestion/' + params.ad_id + '/set-topic-and-comments',
				data: {
					topics: selected_topics,
					comment: comments
				}
			})
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
		<Form onSubmit={handleSubmit}>
		  <Form.Row>
	  	      <Form.Control as="select" multiple id="topic_options">
	  	        {topic_list.map((topic) => (
          			<option>{topic}</option>
        		))}
		      </Form.Control>
			  <Form.Group as={Col} md="4">
			  	<Form.Label>Or suggest a new topic: </Form.Label>
				<Form.Control
				  type="text"
				  id="topic_name"
				  placeholder="Enter topic name"
				/>
			  </Form.Group>
		  </Form.Row>
		  <Form.Row>
		    <Form.Group as={Col} md="4">
			<Form.Label>Additional Comments</Form.Label>
			<Form.Control as="textarea" rows="4" id="comments"/>
				</Form.Group>
		  </Form.Row>
		  <Button type="submit">
		    Submit
		  </Button>
		</Form>
	</div>
	);	
}

export default NewTopicSuggestionForAdClusterForm