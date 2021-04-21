import React, { useState, useEffect } from "react";
import axios from "axios";
import { useQueryParam, NumberParam } from 'use-query-params';
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import "./Dashboard.css"
import UserClusterAdUnit from "./UserClusterAdUnit.js";
import AddByArchiveIdForm from "./AddByArchiveIdForm.js";

const getClusterDetailsURL = "/user_clusters/";
const checkClusterCreatorIdURL = "/owner";
const getClusterNameURL = "/name";

function UserClusterDetailsPage() {
	const [clusterIdParam, setClusterIdParam] = useQueryParam('cluster_id', NumberParam);
	const [clusterName, setClusterName] = useState("");
	const [adClusterData, setAdClusterData] = useState([]);
	const [isAdClusterDataLoaded, setIsAdClusterDataLoaded] = useState(false);
	const [isAdClusterDataEmpty, setIsAdClusterDataEmpty] = useState(false);
	const [isUserClusterCreator, setIsUserClusterCreator] = useState(false);
	const [showInsertModal, setShowInsertModal] = useState(false);
    const handleCloseInsertModal = () => {setShowInsertModal(false); refresh()};
    const handleShowInsertModal = () => setShowInsertModal(true);

	const getAdClusterData = () => {
		axios
		  .get(getClusterDetailsURL + clusterIdParam)
		  .then((response) => {
		    console.log(Object.values(response.data));
		    setAdClusterData(Object.values(response.data));
		    setIsAdClusterDataLoaded(true);
		    setIsAdClusterDataEmpty(Object.values(response.data).length === 0);
		  })
		  .catch((error) => {
		    console.log(error);
		    if (error.response.status && error.response.status === 404) {
		      setIsAdClusterDataEmpty(true);
		    }
		  })
		  .finally(() => {});
	};

	const checkClusterCreator = () => {
		axios
		  .get(getClusterDetailsURL + clusterIdParam + checkClusterCreatorIdURL )
		  .then((response) => {
		    console.log(response.data);
		    setIsUserClusterCreator(response.data.Ownership);
		  })
		  .catch((error) => {
		    console.log(error);
		  })
		  .finally(() => {});
	};
	
	const getClusterName = () => {
		axios
		  .get(getClusterDetailsURL + clusterIdParam + getClusterNameURL)
		  .then((response) => {
		    console.log(response.data);
		    setClusterName(response.data.ad_cluster_name);
		  })
		  .catch((error) => {
		    console.log(error);
		  })
		  .finally(() => {});
	};

	useEffect(() => {
		getAdClusterData();
		checkClusterCreator();
		getClusterName();
	}, []);
	
	const refresh = () => {
		getAdClusterData();
	}

	if (!isAdClusterDataLoaded) {
		return (<h1>Loading...</h1>);
	}

	return (
	  <div>
        <header className="App-header">
          <h1>Welcome to NYU's Misinformation Screener</h1>
        </header>
        <div className="dashboard-title">
          <h1>{clusterName}</h1>
          <h3>Cluster ID: {clusterIdParam}</h3>
        </div>
        {!isUserClusterCreator ? <div></div> :
          <div>
          <div className="center-align">
		    <Button onClick={handleShowInsertModal} className="pad-button"> 
		      Add by archive id 
		    </Button>
		    <Button className="pad-button" href="/search"> Add through search </Button>
		    <br /><br />
		    <Button href="/"> Back to dashboard </Button>
		  </div>
		  <Modal
            show={showInsertModal}
            onHide={handleCloseInsertModal}
            >
            <Modal.Header closeButton>
              <Modal.Title>Add archive id to cluster</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <AddByArchiveIdForm ad_cluster_id={clusterIdParam}/>
            </Modal.Body>
          </Modal> 
          </div>
        }
        {isAdClusterDataEmpty ? <div className="center-align">This cluster is currently empty</div> :
          <div className="App-ad-pane center-align">
            {adClusterData.map((ad) => (
              <UserClusterAdUnit 
                ad={JSON.parse(ad)} 
                key={ad.archive_id} 
                refresh={refresh} 
                canDelete={isUserClusterCreator}
                showAddToClusterButton={false}
                ad_cluster_id={clusterIdParam}
              />
            ))}
          </div>
        }
	  </div>
	);
}


export default UserClusterDetailsPage;