import React, { useState, useEffect } from "react";
import axios from "axios";
import { useQueryParam, StringParam } from 'use-query-params';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

import AdDetailsContent from "./AdDetailsContent.js";
import AddToUserClusterButton from "./AddToUserClusterButton.js"
import { auth } from "./firebase";
import withAuthorization from "./withAuthorization";
import Cookies from 'js-cookie';

const id_token_cookie_name = 'id_token';
const getClusterURL = "/archive-id";
const getUserClusterURL = "/get_user_clusters";

function AdDetailsPage() {
	const [adIdParam, setAdIdParam] = useQueryParam('ad_id', StringParam);
	const [adClusterData, setAdClusterData] = useState([]);
	const [isAdClusterDataLoaded, setIsAdClusterDataLoaded] = useState(false);
	const [isAdClusterDataEmpty, setIsAdClusterDataEmpty] = useState(false);
	const [userClusters, setUserClusters] = useState([]);
    const [showNeedLoginModal, setShowNeedLoginModal] = useState(false);
    const handleShowNeedLoginModal = () => setShowNeedLoginModal(true);
    const handleCloseNeedLoginModal = () => setShowNeedLoginModal(false);
	
	const getAdClusterData = () => {
		axios
		  .get(getClusterURL + '/' + adIdParam + '/cluster')
		  .then((response) => {
		    console.log(response.data);
		    setAdClusterData(response.data);
		    setIsAdClusterDataLoaded(true);
		  })
		  .catch((error) => {
		    console.log(error);
		    if (error.response.status === 404) {
		      setIsAdClusterDataEmpty(true);
		    }
		  })
		  .finally(() => {});
	};
	
    const getUserClusterData = () => {
      axios
        .get(getUserClusterURL)
        .then((response) => {
          console.log(response.data);
          setUserClusters(response.data);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {});
    };

	const handleSignOut = function () {
		Cookies.remove(id_token_cookie_name);
		auth.signOut();
	};

	useEffect(() => {
		getAdClusterData();
		getUserClusterData();
	}, []);

	if (isAdClusterDataEmpty) {
		return (<div><br /><br /><br /><h3 align="center">No results found</h3></div>);
	}

	if (!isAdClusterDataLoaded) {
		return (<h1>Loading...</h1>);
	}

	return (
		<div className="App-ad-cluster-data">
			<Button onClick={handleSignOut}>Sign Out</Button>
			<h2>Cluster ID: {adClusterData.ad_cluster_id} </h2>
	        <AddToUserClusterButton
	          archive_ids={adClusterData.archive_ids}
	          user_clusters={userClusters}
	          handleShowNeedLoginModal={handleShowNeedLoginModal}
	        />
			<hr />
			<AdDetailsContent
			  details={adClusterData}
			  userClusters={userClusters}
			/>
			<Modal
			  show={showNeedLoginModal}
			  onHide={handleCloseNeedLoginModal}
			  dialogClassName="modal-90w"
			  size="lg"
			>
			  <Modal.Header>
			    <Modal.Title>Please Login To Use This Tool</Modal.Title>
			  </Modal.Header>
			  <Modal.Body>
			    <h2>Please login</h2>
			    <p>Either you have not logged in yet, or your session has expired.</p>
			    <a href="/login">Click here to login or register</a>
			  </Modal.Body>
			</Modal>
		</div>
	);
}

const authCondition = authUser => !!authUser;
export default withAuthorization(authCondition)(AdDetailsPage);