import React from "react";
import Tab from "react-bootstrap/Tab";
import Table from "react-bootstrap/Table";
import Tabs from "react-bootstrap/Tabs";

const filterfn = (key, val) => {
  return (obj) => obj[key] === val;
};

const AdDetailsContent = (params) => {
  var advertisers_info = params.details.advertiser_info
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
  var region_data = params.details.region_impression_results;
  region_data.sort((a, b) => (a.region > b.region ? 1 : -1));

  return(
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
      {params.details.alternative_ads.map((ad_id) => {
        return (
          <div className="ad-image-container" key={ad_id}>
            <img alt={ad_id} src={"https://storage.googleapis.com/facebook_ad_archive_screenshots/" + ad_id + ".png"} />
          </div>
        );
      })}
    </Tab>
    <Tab eventKey="metadata" title="NYU Metadata" mountOnEnter={true}>
      <Table striped bordered hover>
        <tbody>
          <tr><td>Ad Type:</td><td>{params.details.type}</td></tr>
          <tr><td>Entities:</td><td>{params.details.entities}</td></tr>
          <tr><td>Cluster Topics:</td><td>{params.details.topics}</td></tr>
          <tr><td>Number of ads in cluster:</td><td>{params.details.cluster_size}</td></tr>
          <tr><td>Canonical ad archive ID:</td><td>{params.details.canonical_archive_id}</td></tr>
        </tbody>
      </Table>
    </Tab>
    <Tab
      eventKey="advertiser_info"
      title="Advertiser Metadata"
      mountOnEnter={true}
    >
      {advertisers_info.map((advertiser_info) => (
        <Table striped bordered hover>
          <tbody className="equal-width-columns">
            <tr>
            <td>Advertiser Type:</td><td>{advertiser_info.advertiser_type}</td></tr>
            <tr><td>Advertiser Party:</td><td>{advertiser_info.advertiser_party}</td></tr>
            <tr><td>FEC ID:</td><td>{advertiser_info.advertiser_fec_id}</td></tr>
            <tr><td>Advertiser website:</td><td>{advertiser_info.advertiser_webiste}</td></tr>
            <tr><td>Risk Score:</td><td>{advertiser_info.advertiser_risk_score}</td></tr>
          </tbody>
        </Table>
      ))}
    </Tab>
    </Tabs>
  );
}

export default AdDetailsContent

