import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import { addDays } from "date-fns";

import "./App.css";
import AdUnit from "./AdUnit.js";
import TimePeriodPicker from "./TimePeriodPicker.js";
import FilterSelector from "./FilterSelector.js";

import regions from "./data/regions.json";
import topics from "./data/topics.json";
import genders from "./data/genders.json";
import ageRanges from "./data/ageRanges.json";
import riskScores from "./data/riskScores.json";
import orderByOptions from "./data/orderBy.json";
import orderDirections from "./data/orderDirections.json";

const getAdsURL = "/getads";

const disableOptions = false;


function App() {
  const [startDate, setStartDate] = useState(addDays(new Date(), -7));
  const [endDate, setEndDate] = useState(new Date());
  const [topic, setTopic] = useState({ selectedOption: topics[5] });
  const [region, setRegion] = useState({ selectedOption: regions[0] });
  const [gender, setGender] = useState({ selectedOption: genders[0] });
  const [ageRange, setAgeRange] = useState({ selectedOption: ageRanges[0] });
  const [riskScore, setRiskScore] = useState({ selectedOption: riskScores[0] });
  const [orderBy, setOrderBy] = useState({ selectedOption: orderByOptions[0] });
  const [orderDirection, setOrderDirection] = useState({ selectedOption: orderDirections[0] });
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);
  const [ads, setAds] = useState([
    // {  // This is  dummy ad, helpful for testing without loading images
    //   funding_entity: "Funding Entity",
    //   spend: "0-99 USD",
    //   url: "",
    //   impressions: "1000-5000",
    //   archive_id: "Invalid archive_id",
    //   demo_impression_results: [],
    //   region_impression_results: [],
    //   alternative_archive_ids: []
    // }
  ]);

  const getAds = () => {
    axios
      .get(getAdsURL, {
        params: {
          startDate: startDate,
          endDate: endDate,
          topic: topic.selectedOption.value,
          // Using label for region is intentional. The db stores full strings, not 2 char codes
          region: region.selectedOption.label,
          gender: gender.selectedOption.value,
          ageRange: ageRange.selectedOption.value,
          riskScore: riskScore.selectedOption.value,
          orderBy: orderBy.selectedOption.value,
          orderDirection: orderDirection.selectedOption.value
        },
      })
      .then((response) => {
        console.log(response.data);
        setAds(response.data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {});
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to NYU's Ad Screening System</h1>
      </header>
      <p>
        Please select filters below and click 'Get Ads' to load content.{" "}
        {/* eslint-disable-next-line */}
        <a href="#" onClick={handleShow}>
          Click here for more information.
        </a>
      </p>

      <div className="App-filter-selector">
        <FilterSelector
          setState={setTopic}
          option={topic}
          title="Topic"
          options={topics}
        />
        <FilterSelector
          setState={setRegion}
          option={region}
          title="Region"
          options={regions}
          disabled={disableOptions}
        />
        <FilterSelector
          setState={setGender}
          option={gender}
          title="Gender"
          options={genders}
          disabled={disableOptions}
        />
        <FilterSelector
          setState={setAgeRange}
          option={ageRange}
          title="Age Range"
          options={ageRanges}
          disabled={disableOptions}
        />
        <FilterSelector
          setState={setRiskScore}
          option={riskScore}
          title="Risk Score"
          options={riskScores}
          disabled={disableOptions}
        />
        <FilterSelector
          setState={setOrderBy}
          option={orderBy}
          title="Sort By Field"
          options={orderByOptions}
          disabled={disableOptions}
        />
        <FilterSelector
          setState={setOrderDirection}
          option={orderDirection}
          title="Sort Order"
          options={orderDirections}
          disabled={disableOptions}
        />
        <TimePeriodPicker
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
        />
        <Button variant="primary" onClick={getAds}>Get Ads</Button>
      </div>
      <div className="App-ad-pane">
        {ads.map((ad) => (
          <AdUnit ad={ad} key={ad.ad_cluster_id} />
        ))}
      </div>
      <Modal
        show={showModal}
        onHide={handleClose}
        dialogClassName="modal-90w"
        size="lg"
      >
        <Modal.Header>
          <Modal.Title>How To Use This Tool</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h2>Filtering Ads</h2>
          <p>To view ads, select a topic, and a region and/or demographic group of interest. Select a date range, and click 'Get Ads'. If you are interested in a topic that is not available, please contact us so it can be added.</p>
          <h2>Viewing Results</h2>
          <p>To see in-depth data about each ad, click 'Ad Details'.</p>
          <p>Results are for the entire cluster of ads; to see other ad creatives in the cluster, click on the 'Alternate Creatives' tab. Ad type classifications and entities detected are for all ads in the cluster. If you see metadata that you believe to be in error, please let us know!</p>
          <h2>Limitations</h2>
          <p>Data is delayed approximately 48 hours. All metadata development and risk scores are EXPERIMENTAL.</p>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default App;
