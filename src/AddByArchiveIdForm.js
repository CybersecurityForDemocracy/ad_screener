//Add to user cluster with archive ID
import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from "react-bootstrap/Button";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Toast from 'react-bootstrap/Toast';
import axios from "axios";

const AddByArchiveIdForm = (params) => {
	var archiveId = 0;
	// To display success/error message
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
			archiveId = [parseInt(form.archive_id.value)];
			console.log(archiveId);
			axios
			.post('/user_clusters/'+ params.ad_cluster_id + '/ads', {"archive_ids": archiveId})
			.then((response) => {
				console.log(response.data);
				setShow(true);
				if(response.data.error_archive_ids.length !== 0){
					setMessage("Archive ID does not exist in database");
					setStyle({color: 'red'});
				}
				else {
					setMessage("Ad added to cluster created successfully.");
					setStyle({color: 'green'});					
				}
			})
			.catch((error) => {
				console.log(error);
				setShow(true);
				setMessage("There was a problem in adding to the cluster.");
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
				<Row>
				<Col xs={12} md={8}>
					<Form.Control
					required
					type="number"
					id="archive_id"
					placeholder="Enter archive id"
					/>
				</Col>
			    <Col xs={6} md={4}><Button type="submit">Add</Button></Col>
			    </Row>
			</Form>
		</div>
	);
}

export default AddByArchiveIdForm