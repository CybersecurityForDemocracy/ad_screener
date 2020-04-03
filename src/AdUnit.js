import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Tab from "react-bootstrap/Tab";
import Table from "react-bootstrap/Table";
import Tabs from "react-bootstrap/Tabs";

import "./AdUnit.css";

const AdUnit = (params) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
      <Button variant="primary" onClick={handleShow}>
        Ad Details
      </Button>
      <AdDetails
        show={show}
        handleClose={handleClose}
        ad={params.ad}
        key={params.ad.archive_id}
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
  var female_data = params.ad.demo_impression_results.filter(
    filterfn("gender", "female")
  );
  female_data.sort((a, b) => (a.age_group > b.age_group ? 1 : -1));
  var male_data = params.ad.demo_impression_results.filter(
    filterfn("gender", "male")
  );
  male_data.sort((a, b) => (a.age_group > b.age_group ? 1 : -1));
  var unknown_data = params.ad.demo_impression_results.filter(
    filterfn("gender", "unknown")
  );
  unknown_data.sort((a, b) => (a.age_group > b.age_group ? 1 : -1));
  var ad_url =
    "https://www.facebook.com/ads/library/?id=" + params.ad.archive_id;
  var region_data = params.ad.region_impression_results;
  region_data.sort((a, b) => (a.region > b.region ? 1 : -1));
  return (
    <Modal
      show={params.show}
      onHide={params.handleClose}
      dialogClassName="modal-90w"
      size="xl"
    >
      <Modal.Header>
        <Modal.Title>Archive Id: {params.ad.archive_id} </Modal.Title>
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
            {params.ad.alternative_ads.map((ad) => {
              return (
                <div className="ad-image-container" key={ad.archive_id}>
                  <img alt={ad.archive_id} src={ad.url} />
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
                  <div className="ad-summary-data">{params.ad.type}</div>
                  <div className="ad-summary-data">{params.ad.entities}</div>
                </div>
              </div>
            </div>
          </Tab>
          <Tab
            eventKey="advertizer_info"
            title="Advertizer Metadata"
            mountOnEnter={true}
          >
            <div className="ad-summary">
              <div className="ad-summary-block-1">
                <div className="ad-summary-tuple">
                  <div className="ad-summary-field">Advertizer Type:</div>
                  <div className="ad-summary-field">Advertizer Party:</div>
                  <div className="ad-summary-field">FEC ID:</div>
                  <div className="ad-summary-field">Advertizer website:</div>
                  <div className="ad-summary-field">Risk Score:</div>
                </div>
                <div className="ad-summary-tuple">
                  <div className="ad-summary-data">
                    {params.ad.advertizer_type}
                  </div>
                  <div className="ad-summary-data">
                    {params.ad.advertizer_party}
                  </div>
                  <div className="ad-summary-data">
                    {params.ad.advertizer_fec_id}
                  </div>
                  <div className="ad-summary-data">
                    {params.ad.advertizer_webiste}
                  </div>
                  <div className="ad-summary-data">
                    {params.ad.advertizer_risk_score}
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
