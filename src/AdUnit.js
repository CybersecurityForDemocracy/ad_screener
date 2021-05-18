// For displaying each ad in ad search results
import React, { useEffect, useState } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Modal from "react-bootstrap/Modal";
import IndividualAdDetailsContent from "./IndividualAdDetailsContent.js";
import AddToUserClusterButton from "./AddToUserClusterButton.js"

import "./AdUnit.css";

const getAdDetailsURL = "/ads/";
const errorImageSrc = 'https://storage.googleapis.com/facebook_ad_archive_screenshots/error.png';

const AdUnit = (params) => {
  const [show, setShow] = useState(false);
  const [ad_details, setAdDetails] = useState([]);
  const [userClusters, setUserClusters] = useState([]);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [adImageSrc, setAdImageSrc] = useState(params.ad.url);
  const handleAdImageError = () => setAdImageSrc(errorImageSrc);

  const getAdDetails = (archive_id) => {
    axios
      .get(getAdDetailsURL + '/' + archive_id)
      .then((response) => {
        console.log(response.data);
        setAdDetails(response.data);
        handleShow();
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {});
  }

  return (
    <div className="ad-container">
      <div className="ad-summary">
        <div className="ad-summary-block-1">
          <div className="ad-summary-tuple">
            <div className="ad-summary-field">First seen:</div>
            <div className="ad-summary-field">Last seen:</div>
          </div>
          <div className="ad-summary-tuple">
            <div className="ad-summary-data">{params.ad.start_date}</div>
            <div className="ad-summary-data">{params.ad.end_date}</div>
          </div>
        </div>
        <div className="ad-summary-block-2">
          <div className="ad-summary-spend">
            <div className="ad-summary-field">Estimated Total Spend:</div>
            <div className="ad-summary-field">Estimated Total Impressions:</div>
          </div>
          <div className="ad-summary-spend">
            <div className="ad-summary-data">{params.ad.total_spend}</div>
            <div className="ad-summary-data">{params.ad.total_impressions}</div>
          </div>
        </div>
      </div>
      <Button variant="primary" onClick={() => getAdDetails(params.ad.archive_id)}>
        Ad Details
      </Button>
      <AddToUserClusterButton
        archive_ids={[params.ad.archive_id]}
        handleShowNeedLoginModal={params.handleShowNeedLoginModal}
      />
      <AdDetails
        show={show}
        handleClose={handleClose}
        details={ad_details}
        key={ad_details.archive_id}
        topics={params.topics}
      />
      <div className="ad-image-container">
        <img className="ad-image" alt={adImageSrc} src={adImageSrc} onError={handleAdImageError}/>
      </div>
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
    "https://www.facebook.com/ads/library/?id=" + params.details.canonical_archive_id;

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
          topics={params.topics}
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

export default AdUnit;