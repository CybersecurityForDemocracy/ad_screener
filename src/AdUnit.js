import React, { useState } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Modal from "react-bootstrap/Modal";
import AdDetailsContent from "./AdDetailsContent.js";

import "./AdUnit.css";

const getAdDetailsURL = "/getaddetails";
const sendAdFeedbackURL = "/ad-feedback";
const errorImageSrc = 'https://storage.googleapis.com/facebook_ad_archive_screenshots/error.png';

const AdUnit = (params) => {
  const [show, setShow] = useState(false);
  const [ad_details, setAdDetails] = useState([]);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [adImageSrc, setAdImageSrc] = useState(params.ad.url);
  const handleAdImageError = () => setAdImageSrc(errorImageSrc);

  const getAdDetails = (ad_cluster_id) => {
    axios
      .get(getAdDetailsURL + '/' + ad_cluster_id)
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
            <div className="ad-summary-field">Cluster Size:</div>
          </div>
          <div className="ad-summary-tuple">
            <div className="ad-summary-data">{params.ad.start_date}</div>
            <div className="ad-summary-data">{params.ad.end_date}</div>
            <div className="ad-summary-data">{params.ad.cluster_size}</div>
          </div>
        </div>
        <div className="ad-summary-block-2">
          <div className="ad-summary-spend">
            <div className="ad-summary-field">Estimated Total Spend:</div>
            <div className="ad-summary-field">Estimated Total Impressions:</div>
            <div className="ad-summary-field">Number of pages:</div>
          </div>
          <div className="ad-summary-spend">
            <div className="ad-summary-data">{params.ad.total_spend}</div>
            <div className="ad-summary-data">{params.ad.total_impressions}</div>
            <div className="ad-summary-data">{params.ad.num_pages}</div>
          </div>
        </div>
      </div>
      <Button variant="primary" onClick={() => getAdDetails(params.ad.ad_cluster_id)}>
        Ad Details
      </Button>
      <AdFeedbackButton
        ad_cluster_id={params.ad.ad_cluster_id}
        handleShowNeedLoginModal={params.handleShowNeedLoginModal}
        user_feedback_label_name={params.ad.user_feedback_label_name}
      />
      <AdDetails
        show={show}
        handleClose={handleClose}
        details={ad_details}
        key={ad_details.ad_cluster_id}
        topics={params.topics}
      />
      <div className="ad-image-container">
        <img className="ad-image" alt={adImageSrc} src={adImageSrc} onError={handleAdImageError}/>
      </div>
    </div>
  );
};

const AdFeedbackButton = (params) => {
  const [buttonTitle, setButtonTitle] = useState(params.user_feedback_label_name === null ? "Is this ad problematic?" : params.user_feedback_label_name);
  const handleSelect = (label) => {
    axios.post(sendAdFeedbackURL + "/" + params.ad_cluster_id + "/set-label/" + label)
      .then((response) => {
        console.log(response.data);
        setButtonTitle(label);
      })
      .catch((error) => {
        console.log(error);
        if (error.response && error.response.status === 401) {
          params.handleShowNeedLoginModal();
        }
      })
      .finally(() => {});
  };
  const labels = ['(No Answer)', 'No', 'Misinformation', 'Scam', 'Other', 'Miscategorized'];
  return (
    <DropdownButton className="problematic-ad-button" id="dropdown-basic-button" title={buttonTitle}>
      {labels.map(
        (label) => (
          <Dropdown.Item href="#" key={params.ad_cluster_id + label} eventKey={label} onSelect={handleSelect}>{label}</Dropdown.Item>
        ),
      )}
    </DropdownButton>
  );
}

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
        <Modal.Title>Cluster ID: {params.details.ad_cluster_id}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <AdDetailsContent
          details={params.details}
          topics={params.topics}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button className="right"
          href={"/cluster?ad_id=" + params.details.canonical_archive_id}
          target="_blank"
        >
        Standalone view of this cluster
        </Button>{" "}
        <Button variant="secondary" onClick={params.handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AdUnit;
