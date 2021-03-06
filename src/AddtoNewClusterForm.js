// Form for creating a new cluster and adding an ad to it (In add to user cluster button)
import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from "react-bootstrap/Button";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Toast from 'react-bootstrap/Toast';
import axios from "axios";

const AddtoNewClusterForm = (params) => {
	var clusterName = "";
	const [validated, setValidated] = useState(false);
	const [show, setShow] = useState(false);
	const [message, setMessage] = useState("");
	const [style, setStyle] = useState({});

	const insertToCluster = (cluster_id) => {
    	let confirmation = false;
    	// Check if adding individual ad or ad cluster 
    	if (params.archive_ids.length !== 1) {
      		confirmation = window.confirm("Are you sure you want to add all the archive ids in this cluster to your cluster? To add select archive ids, go to the alternate creatives tab in Ad Details.") 
    	}
	    else {
	      confirmation = true;
	    }
    	if (confirmation){
	        axios
	          .post('/user_clusters/'+ cluster_id + '/ads', {"archive_ids": params.archive_ids})
	          .then((response) => {
	            console.log(response.data);
	            // API endpoint returns non-existent archive_ids
	            if(response.data.error_archive_ids.length !== 0) {
	              alert("Ad(s) with archive IDs: " + response.data.error_archive_ids.toString() + "were not added " +
	            	"as they were not found in the database")
	            }
	            else{
	              alert("Ad(s) successfully added to cluster")
	            }
	          })
	          .catch((error) => {
	            console.log(error);
	            alert("There was a problem in adding to cluster")
	          })
	          .finally(() => {}); 
	    }
	};

	const handleSubmit = (event) => {
		const form = event.currentTarget;
		event.preventDefault();

		if (form.checkValidity() === false) {
			event.stopPropagation();
		}

		else{
			clusterName = form.cluster_name.value;
			console.log(clusterName);
			axios
			.post('/user_clusters/'+clusterName)
			.then((response) => {
				console.log(response.data);
				setShow(true);
				setMessage("Cluster created successfully.");
				setStyle({color: 'green'});
				insertToCluster(response.data.ad_cluster_id);
			})
			.catch((error) => {
				console.log(error);
				setShow(true);
				setMessage("There was a problem in creating the cluster.");
				setStyle({color: 'red'});
			})
			.finally(() => {});
		}
		setValidated(true);
	};

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
				<Row>
				<Col xs={12} md={8}>
					<Form.Control
					required
					type="text"
					id="cluster_name"
					placeholder="Enter cluster name"
					/>
					<Form.Control.Feedback type="invalid" className="mb-2 mr-sm-2">
					Please enter a cluster name.
					</Form.Control.Feedback>
				</Col>
			    <Col xs={6} md={4}><Button type="submit">Create</Button></Col>
			    </Row>
			</Form>
		</div>
	);
}

export default AddtoNewClusterForm