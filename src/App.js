import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import { addDays } from "date-fns";

import "./App.css";
import AdUnit from "./AdUnit.js";
import TimePeriodPicker from "./TimePeriodPicker.js";
import FilterSelector from "./FilterSelector.js";

const getAdsURL = "/getads";
const getFilterSelectorDataURL = "/filter-options";

const disableOptions = false;

function App() {
  const [isFilterSelectorDataLoaded, setIsFilterSelectorDataLoaded] = useState(false);
  const [filterSelectorData, setFilterSelectorData] = useState({});
  const getFilterSelectorData = () => {
      axios
        .get(getFilterSelectorDataURL)
        .then((response) => {
          console.log(response.data);
          setFilterSelectorData(response.data);
          setIsFilterSelectorDataLoaded(true);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {});
  };

  useEffect(() => {
    getFilterSelectorData();
  }, []);

  if (!isFilterSelectorDataLoaded) {
    return (<h1>Loading...</h1>);
  }

  const topics = filterSelectorData.topics;
  const regions = filterSelectorData.regions;
  const genders = filterSelectorData.genders;
  const ageRanges = filterSelectorData.ageRanges;
  const riskScores = filterSelectorData.riskScores;
  const orderByOptions = filterSelectorData.orderByOptions;
  const orderDirections = filterSelectorData.orderDirections;

  return (
    <AdScreener
      topics={topics}
      regions={regions}
      genders={genders}
      ageRanges={ageRanges}
      riskScores={riskScores}
      orderByOptions={orderByOptions}
      orderDirections={orderDirections}
    />
  );
};

const AdScreener = (params) => {
  const [startDate, setStartDate] = useState(addDays(new Date(), -7));
  const [endDate, setEndDate] = useState(new Date());
  const [topic, setTopic] = useState({ selectedOption: params.topics[0] });
  const [region, setRegion] = useState({ selectedOption: params.regions[0] });
  const [gender, setGender] = useState({ selectedOption: params.genders[0] });
  const [ageRange, setAgeRange] = useState({ selectedOption: params.ageRanges[0 ]});
  const [riskScore, setRiskScore] = useState({ selectedOption: params.riskScores[0] });
  const [orderBy, setOrderBy] = useState({ selectedOption: params.orderByOptions[0] });
  const [orderDirection, setOrderDirection] = useState({ selectedOption: params.orderDirections[0] });
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);
  const [showNeedLoginModal, setShowNeedLoginModal] = useState(false);
  const handleShowNeedLoginModal = () => setShowNeedLoginModal(true);
  const handleCloseNeedLoginModal = () => setShowNeedLoginModal(false);
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
          options={params.topics}
        />
        <FilterSelector
          setState={setRegion}
          option={region}
          title="Region"
          options={params.regions}
          disabled={disableOptions}
        />
        <FilterSelector
          setState={setGender}
          option={gender}
          title="Gender"
          options={params.genders}
          disabled={disableOptions}
        />
        <FilterSelector
          setState={setAgeRange}
          option={ageRange}
          title="Age Range"
          options={params.ageRanges}
          disabled={disableOptions}
        />
        <FilterSelector
          setState={setRiskScore}
          option={riskScore}
          title="Risk Score"
          options={params.riskScores}
          disabled={disableOptions}
        />
        <FilterSelector
          setState={setOrderBy}
          option={orderBy}
          title="Sort By Field"
          options={params.orderByOptions}
          disabled={disableOptions}
        />
        <FilterSelector
          setState={setOrderDirection}
          option={orderDirection}
          title="Sort Order"
          options={params.orderDirections}
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
          <AdUnit ad={ad} key={ad.ad_cluster_id} handleShowNeedLoginModal={handleShowNeedLoginModal}/>
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

export default App;
