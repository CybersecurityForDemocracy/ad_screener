import React, { useState } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Modal from "react-bootstrap/Modal";
import Tab from "react-bootstrap/Tab";
import Table from "react-bootstrap/Table";
import Tabs from "react-bootstrap/Tabs";

import "./AdUnit.css";

const getAdDetailsURL = "http://ccs3usr.engineering.nyu.edu:8010/getaddetails";

const AdUnit = (params) => {
  const [show, setShow] = useState(false);
  const [ad_details, setAdDetails] = useState([]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
      <Button variant="primary" onClick={() => getAdDetails(params.ad.ad_cluster_id)}>
        Ad Details
      </Button>
      <DropdownButton id="dropdown-basic-button" title="Is this ad problematic?">
        <Dropdown.Item href="#/No">No</Dropdown.Item>
        <Dropdown.Item href="#/Misinformation">Misinformation</Dropdown.Item>
        <Dropdown.Item href="#/Other">Other</Dropdown.Item>
      </DropdownButton>
      <AdDetails
        show={show}
        handleClose={handleClose}
        details={ad_details}
        key={ad_details.ad_cluster_id}
      />
      <div className="ad-image-container">
        <img className="ad-image" alt={params.ad.url} src={params.ad.url} />
      </div>
    </div>
  );
};

const filterfn = (key, val) => {
  return (obj) => obj[key] === val;
};

const AdDetails = (params) => {
  if (!(params.details && params.details.length !== 0)) {
    return(<div></div>);
  }

  var female_data = params.details.demo_impression_results.filter(
    filterfn("gender", "female")
  );
  female_data.sort((a, b) => (a.age_group > b.age_group ? 1 : -1));
  var male_data = params.details.demo_impression_results.filter(
    filterfn("gender", "male")
  );
  male_data.sort((a, b) => (a.age_group > b.age_group ? 1 : -1));
  var unknown_data = params.details.demo_impression_results.filter(
    filterfn("gender", "unknown")
  );
  unknown_data.sort((a, b) => (a.age_group > b.age_group ? 1 : -1));
  var ad_url =
    "https://www.facebook.com/ads/library/?id=" + params.details.canonical_archive_id;
  var region_data = params.details.region_impression_results;
  region_data.sort((a, b) => (a.region > b.region ? 1 : -1));
  return (
    <Modal
      show={params.show}
      onHide={params.handleClose}
      dialogClassName="modal-90w"
      size="xl"
    >
      <Modal.Header>
        <Modal.Title>Cluster ID: {params.details.ad_cluster_id} Canonical Archive ID: {params.details.canonical_archive_id} </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Tabs defaultActiveKey="demos">
          <Tab
            eventKey="demos"
            title="Total Demographic Spend"
            mountOnEnter={true}
          >
            <h3>Female</h3>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Age Group</th>
                  <th>Max Spend</th>
                  <th>Max Impressions</th>
                </tr>
              </thead>
              <tbody>
                {female_data.map((demo_result) => (
                  <tr key={demo_result.age_group}>
                    <td>{demo_result.age_group}</td>
                    <td>{demo_result.max_spend}</td>
                    <td>{demo_result.max_impressions}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <h3>Male</h3>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Age Group</th>
                  <th>Max Spend</th>
                  <th>Max Impressions</th>
                </tr>
              </thead>
              <tbody>
                {male_data.map((demo_result) => (
                  <tr key={demo_result.age_group}>
                    <td>{demo_result.age_group}</td>
                    <td>{demo_result.max_spend}</td>
                    <td>{demo_result.max_impressions}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <h3>Unknown</h3>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Age Group</th>
                  <th>Max Spend</th>
                  <th>Max Impressions</th>
                </tr>
              </thead>
              <tbody>
                {unknown_data.map((demo_result) => (
                  <tr key={demo_result.age_group}>
                    <td>{demo_result.age_group}</td>
                    <td>{demo_result.max_spend}</td>
                    <td>{demo_result.max_impressions}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Tab>
          <Tab
            eventKey="regional"
            title="Total Regional Spend"
            mountOnEnter={true}
          >
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Region</th>
                  <th>Max Spend</th>
                  <th>Max Impressions</th>
                </tr>
              </thead>
              <tbody>
                {region_data.map((region_result) => (
                  <tr key={region_result.region}>
                    <td>{region_result.region}</td>
                    <td>{region_result.max_spend}</td>
                    <td>{region_result.max_impressions}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Tab>
          <Tab
            eventKey="alternates"
            title="Alternate Creatives"
            mountOnEnter={true}
          >
            {params.details.alternative_ads.map((ad) => {
              return (
                <div className="ad-image-container" key={ad.archive_id}>
                  <img alt={ad.canonical_archive_id} src={ad.url} />
                </div>
              );
            })}
          </Tab>
          <Tab eventKey="metadata" title="NYU Metadata" mountOnEnter={true}>
            <div className="ad-summary">
              <div className="ad-summary-block-1">
                <div className="ad-summary-tuple">
                  <div className="ad-summary-field">Ad Type:</div>
                  <div className="ad-summary-field">Entities:</div>
                </div>
                <div className="ad-summary-tuple">
                  <div className="ad-summary-data">{params.details.type}</div>
                  <div className="ad-summary-data">{params.details.entities}</div>
                </div>
              </div>
            </div>
          </Tab>
          <Tab
            eventKey="advertiser_info"
            title="Advertiser Metadata"
            mountOnEnter={true}
          >
            <div className="ad-summary">
              <div className="ad-summary-block-1">
                <div className="ad-summary-tuple">
                  <div className="ad-summary-field">Advertiser Type:</div>
                  <div className="ad-summary-field">Advertiser Party:</div>
                  <div className="ad-summary-field">FEC ID:</div>
                  <div className="ad-summary-field">Advertiser website:</div>
                  <div className="ad-summary-field">Risk Score:</div>
                </div>
                <div className="ad-summary-tuple">
                  <div className="ad-summary-data">
                    {params.details.advertiser_type}
                  </div>
                  <div className="ad-summary-data">
                    {params.details.advertiser_party}
                  </div>
                  <div className="ad-summary-data">
                    {params.details.advertiser_fec_id}
                  </div>
                  <div className="ad-summary-data">
                    {params.details.advertiser_webiste}
                  </div>
                  <div className="ad-summary-data">
                    {params.details.advertiser_risk_score}
                  </div>
                </div>
              </div>
            </div>
          </Tab>
        </Tabs>
      </Modal.Body>
      <Modal.Footer>
        <Button
          className="right"
          href={ad_url}
          target="_blank"
          rel="noopener noreferrer"
        >
          See in Facebook Ad Library
        </Button>{" "}
        <Button variant="secondary" onClick={params.handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AdUnit;
