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
	    if (params.archive_ids.length !== 1) {
	      if (window.confirm("Are you sure you want to add all the archive ids in this cluster to your cluster? To add select archive ids, go to the alternate creatives tab in Ad Details.")) {
	        axios
	          .post('/user_clusters/'+ cluster_id + '/ads', {"archive_ids": params.archive_ids})
	          .then((response) => {
	            console.log(response.data);
	            if(response.data.archive_ids.length != params.archive_ids.length) {
	              alert("Only the ads with archive IDs: " + response.data.toString() + "were added. " +
	            	"Other ad(s) not found in the database")
	            }
	            else{
	              alert("Ad successfully added to cluster")
	            }
	          })
	          .catch((error) => {
	            console.log(error);
	            alert("There was a problem in adding to cluster")
	          })
	          .finally(() => {}); 
	      }
	    }
	    else {
	      axios
	        .post('/user_clusters/'+ cluster_id + '/ads', {"archive_ids": params.archive_ids})
	        .then((response) => {
	          console.log(response.data);
	          if(response.data.archive_ids.length != params.archive_ids.length) {
	            alert("Only the ads with archive IDs: " + response.data.toString() + "were added. " +
	              "Other ad(s) not found in the database")
	            }
	          else{
	            alert("Ad successfully added to cluster")
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