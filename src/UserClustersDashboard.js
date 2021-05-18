// User dashboard displaying the user's clusters
import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

import "./Dashboard.css"

import CreateClusterForm from "./CreateClusterForm.js";
import ActionBar from "./ActionBar.js";
import { auth } from "./firebase";
import withAuthorization from "./withAuthorization";
import Cookies from 'js-cookie';

const getClusterURL = "/user_clusters";
const id_token_cookie_name = 'id_token';

function UserClustersDashboard() {

	const [userClustersData, setUserClustersData] = useState([]);
	const [isUserClustersDataLoaded, setIsUserClustersDataLoaded] = useState(false);
	const [isUserClustersDataEmpty, setIsUserClustersDataEmpty] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const handleCloseCreateModal = () => {setShowCreateModal(false); refresh()};
  const handleShowCreateModal = () => setShowCreateModal(true);
  const [showNeedLoginModal, setShowNeedLoginModal] = useState(false);
  const handleShowNeedLoginModal = () => setShowNeedLoginModal(true);
  const handleCloseNeedLoginModal = () => setShowNeedLoginModal(false);
	
  const getAdClusterData = () => {
		axios
		  .get(getClusterURL)
		  .then((response) => {
		    console.log(response.data);
		    setUserClustersData(response.data);
		    setIsUserClustersDataLoaded(true);
		    setIsUserClustersDataEmpty(response.data.length === 0)
		  })
		  .catch((error) => {
		    console.log(error);
        if (error.response && error.response.status === 401) {
          handleShowNeedLoginModal();
          console.log(showNeedLoginModal);
        }
		  })
		  .finally(() => {});
	};

  const handleSignOut = function () {
    Cookies.remove(id_token_cookie_name);
    auth.signOut();
  };

	useEffect(() => {
		getAdClusterData();
	}, []);

	const refresh = () => {
		getAdClusterData();
	}

	if (!isUserClustersDataLoaded && !showNeedLoginModal) {
		return (<h1>Loading...</h1>);
	}

  const formatDate = (date) => {
    var dateObj = new Date(date)
    var dateString = dateObj.toUTCString();
    return dateString;
  }

	return (
      <div>
        <header className="App-header">
          <h1>Welcome to NYU's Misinformation Screener</h1>
          <Button onClick={handleSignOut}>Sign Out</Button>
        </header>
        <h1 className="dashboard-title">Your clusters</h1>
        {isUserClustersDataEmpty ? <div className="center-align">You have not created any clusters yet</div> :
        <div className="App-ad-pane">
        {userClustersData.map((cluster) => (
          <div key={cluster.ad_cluster_id} className="cluster-container">
            <div className="container-contents">
              <ActionBar ad_cluster_id={cluster.ad_cluster_id} refresh={refresh} mode="cluster"/>
              <h3>{cluster.ad_cluster_name}</h3>
              <h5>Cluster ID: {cluster.ad_cluster_id}</h5>
              <h6> Last modified on: {formatDate(cluster.last_modified)}</h6>
              <div className="bottom">
                <Button variant="primary" 
                  className="view" 
                  href={"/usercluster?cluster_id=" + cluster.ad_cluster_id}
                  target="_self">
                    View cluster &raquo;
                </Button>
              </div>
            </div>
          </div>
        ))}
        </div>}
        <div className="center-align">
  	      <Button className="pad-button" onClick={handleShowCreateModal}> Create new cluster </Button>
          <Button className="pad-button" href="/search"> Search ads </Button>
        </div>
        <Modal
          show={showCreateModal}
          onHide={handleCloseCreateModal}
          >
          <Modal.Header closeButton>
            <Modal.Title>Create new cluster</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <CreateClusterForm/>
          </Modal.Body>
        </Modal>
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

// Display only for logged in users
const authCondition = authUser => !!authUser;
export default withAuthorization(authCondition)(UserClustersDashboard);