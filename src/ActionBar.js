import React, { useState } from "react";
import axios from "axios";
import { TrashFill, ShareFill, Clipboard } from 'react-bootstrap-icons';
import Row from 'react-bootstrap/Row';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import InputGroup from "react-bootstrap/InputGroup";
import copy from "copy-to-clipboard";
import { useLocation } from 'react-router-dom'

const ActionBar = (params) => {
	const mode = params.mode;
	const [modalMessage, setModalMessage] = useState("Are you sure you want to delete the " + mode + "?");
	const [buttonText, setButtonText] = useState("Yes");
	const [showDeleteModal, setShowDeleteModal] = useState(false);
    const handleCloseDeleteModal = () => {
    	setShowDeleteModal(false); 
    	setModalMessage("Are you sure you want to delete the " + mode + "?");
    	setButtonText("Yes"); 
    	params.refresh();
    };
    const handleShowDeleteModal = () => {setShowDeleteModal(true)}

	const sharingLink = window.location.href + "usercluster?cluster_id=" + params.ad_cluster_id;
	const deleteEndpoint = (mode === "cluster" ? '/user_clusters/' + params.ad_cluster_id 
		: '/user_clusters/' + params.ad_cluster_id + '/ads/' + params.archive_id);
	
	const deleteClusterOrAd = () => {
		axios
		  .delete(deleteEndpoint)
		  .then((response) => {
		  	console.log(response.data);
		  	handleCloseDeleteModal();
		  })
		  .catch((error) => {
		  	console.log(error);
        	if (error.response && error.response.status === 401) {
		  		setModalMessage(error.response.message);
		  		setButtonText("Try again");
        	}
        	else {
		  		setModalMessage("There was an error in deleting the " + mode + ".");
		  		setButtonText("Try again");
		  	}
		  })
		  .finally(() => {});

	}

	const popover = (
		<Popover id="share-popover">
		  <Popover.Title as="h3">Share link</Popover.Title>
		  <Popover.Content>
		    <InputGroup>
		      <input value={sharingLink} />
		      <InputGroup.Append>
		        <button className="copy-button"><Clipboard onClick={() => copy(sharingLink)}/></button>
		      </InputGroup.Append>
		    </InputGroup>
		  </Popover.Content>
		</Popover>
	);

	return(
	  <div>
		<Row className="action-bar">
          <TrashFill onClick={handleShowDeleteModal}/>
          {mode === "ad" ? <div></div> :  
            <OverlayTrigger trigger="click" placement="bottom" overlay={popover} rootClose>
              <ShareFill />
            </OverlayTrigger>

          }
        </Row>
        <Modal
          show={showDeleteModal}
          onHide={handleCloseDeleteModal}
          >
          <Modal.Header closeButton>
            <Modal.Title>Delete {mode}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {modalMessage}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="Secondary" onClick={handleCloseDeleteModal}>Cancel</Button>
            <Button onClick={deleteClusterOrAd}>{buttonText}</Button>
          </Modal.Footer>
        </Modal>
      </div>
	)          
}

export default ActionBar;