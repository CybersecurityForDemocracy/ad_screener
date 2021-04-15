import React, { useState } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import IndividualAdDetailsContent from "./IndividualAdDetailsContent.js";
import AddToUserClusterButton from "./AddToUserClusterButton.js"
import ActionBar from "./ActionBar.js"

const errorImageSrc = 'https://storage.googleapis.com/facebook_ad_archive_screenshots/error.png';

const UserClusterAdUnit = (params) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [adImageSrc, setAdImageSrc] = useState(params.ad.url);
  const handleAdImageError = () => setAdImageSrc(errorImageSrc);

  return (
    <div className="ad-unit">
      {params.canDelete ? 
        <ActionBar ad_cluster_id={params.ad_cluster_id} archive_id={params.ad.archive_id} refresh={params.refresh} mode="ad"/> : 
        <div></div>}
      <div className="ad-info-container">
        <Row>
          <Col className="ad-info small">Ad creation date: </Col>
          <Col className="ad-info small">Last active date: </Col>
        </Row>
        <Row>
          <Col className="ad-info">{params.ad.ad_creation_date}</Col>
          <Col className="ad-info">{params.ad.last_active_date}</Col>
        </Row>
        <Row>
          <Col className="ad-info small">Estimated Spend: </Col>
          <Col className="ad-info small">Estimated Impressions: </Col>
        </Row>
        <Row>
          <Col className="ad-info">${params.ad.min_spend} - ${params.ad.max_spend}</Col>
          <Col className="ad-info">{params.ad.min_impressions} - {params.ad.max_impressions}</Col>
        </Row>
      </div>
      <Button variant="primary" onClick={handleShow}>
        Ad Details
      </Button>
      <AdDetails
        show={show}
        handleClose={handleClose}
        details={params.ad}
        key={params.ad.archive_id}
      />
      {" "}
      { params.showAddToClusterButton ? 
        <AddToUserClusterButton
          archive_ids={[params.ad.archive_id]}
          handleShowNeedLoginModal={params.handleShowNeedLoginModal}
        /> : <div></div>
      }
      <img className="ad-image" alt={adImageSrc} src={adImageSrc} onError={handleAdImageError}/>
      <Button variant="secondary" href={"/similar_ads?archive_id="+params.ad.archive_id}>
        View similar ads >>
      </Button>
    </div>
  );
};

const AdDetails = (params) => {
  if (!(params.details && params.details.length !== 0)) {
    return(<div></div>);
  }
  var ad_url =
    "https://www.facebook.com/ads/library/?id=" + params.details.archive_id;

  return (
    <Modal
      show={params.show}
      onHide={params.handleClose}
      dialogClassName="modal-90w"
      size="xl"
    >
      <Modal.Header>
        <Modal.Title>Archive ID: {params.details.archive_id}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <IndividualAdDetailsContent
          details={params.details}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button className="right"
          href={"/cluster?ad_id=" + params.details.archive_id}
          target="_blank"
        >
          Standalone view of cluster containing identical ads
        </Button>{" "}
        <Button variant="secondary" onClick={params.handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserClusterAdUnit;
