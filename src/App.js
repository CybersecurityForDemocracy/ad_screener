import React, { useState, useEffect, useRef } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import { addDays } from "date-fns";
import { useQueryParam, NumberParam, StringParam } from 'use-query-params';

import "./App.css";
import AdUnit from "./AdUnit.js";
import TimePeriodPicker from "./TimePeriodPicker.js";
import FilterSelector from "./FilterSelector.js";

const getAdsURL = "/getads";
const getFilterSelectorDataURL = "/filter-options";

const disableOptions = false;

function getIndex(array,key){
  return array.findIndex(element => element.value === key);
}

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

const PageNavigation = (params) => {
  const showNext = params.showNext > 0;
  const showPrevious = showNext && params.showPrevious;
  if (!showNext) {
    return null;
  }
  if (showPrevious) {
    return (
      <div><Button onClick={params.onClickPrevious}>Previous</Button>
      <Button onClick={params.onClickNext}>Next</Button></div>
    );
  } else {
    return (
      <div><Button onClick={params.onClickNext}>Next</Button></div>
    );
  }
};

const AdScreener = (params) => {

  const [startDate_param, setStartDateParam] = useQueryParam('Start Date', StringParam);
  const [endDate_param, setEndDateParam] = useQueryParam('End Date', StringParam);
  const [topic_param, setTopicParam] = useQueryParam('Topic', NumberParam);
  const [region_param, setRegionParam] = useQueryParam('Region', StringParam);
  const [gender_param, setGenderParam] = useQueryParam('Gender', StringParam);
  const [ageRange_param, setAgeRangeParam] = useQueryParam('Age Range', StringParam);
  const [riskScore_param, setRiskScoreParam] = useQueryParam('Risk Score', StringParam);
  const [orderByParam, setOrderByParam] = useQueryParam('Sort By Field', StringParam);
  const [orderDirectionParam, setOrderDirectionParam] = useQueryParam('Sort Order', StringParam);

  const [startDate, setStartDate] = useState((startDate_param===undefined) ? addDays(new Date(), -7) : new Date(startDate_param));
  const [endDate, setEndDate] = useState((endDate_param===undefined) ? new Date() : new Date(endDate_param));
  const [topic, setTopic] = useState({ selectedOption: (topic_param===undefined) ? params.topics[0] : params.topics[getIndex(params.topics,topic_param)]});
  const [region, setRegion] = useState({ selectedOption: (region_param===undefined) ? params.regions[0] : params.regions[getIndex(params.regions,region_param)]});
  const [gender, setGender] = useState({ selectedOption: (gender_param===undefined) ? params.genders[0] : params.genders[getIndex(params.genders,gender_param)]});
  const [ageRange, setAgeRange] = useState({ selectedOption: (ageRange_param===undefined) ? params.ageRanges[0] : params.ageRanges[getIndex(params.ageRanges,ageRange_param)]});
  const [riskScore, setRiskScore] = useState({ selectedOption: (riskScore_param===undefined) ? params.riskScores[0] : params.riskScores[getIndex(params.riskScores,riskScore_param)]});
  const [orderBy, setOrderBy] = useState({ selectedOption: (orderByParam===undefined) ? params.orderByOptions[0] : params.orderByOptions[getIndex(params.orderByOptions,orderByParam)]});
  const [orderDirection, setOrderDirection] = useState({ selectedOption: (orderDirectionParam===undefined) ? params.orderDirections[0] : params.orderDirections[getIndex(params.orderDirections,orderDirectionParam)]});
  
  const numResultsToRequest = 20;
  const resultsOffset = useRef(0);
  const resetOffset = () => { resultsOffset.current = 0 };
  const incermentOffset = (i) => { resultsOffset.current = resultsOffset.current + i };
  const decermentOffset = (i) => { if (resultsOffset.current >= i) {resultsOffset.current = resultsOffset.current - i }};
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
          orderDirection: orderDirection.selectedOption.value,
          numResults: numResultsToRequest,
          offset: resultsOffset.current
        },
      })
      .then((response) => {
        console.log(response.data);
        setAds(response.data);
      })
      .catch((error) => {
        console.log(error);
        if (error.response && error.response.status === 401) {
          handleShowNeedLoginModal();
        }
      })
      .finally(() => {});
  };

  const getPreviousPageOfAds = () => {
    decermentOffset(numResultsToRequest);
    getAds();
  };
  const getNextPageOfAds = () => {
    incermentOffset(numResultsToRequest);
    getAds();
  };

  const getFirstPageOfAds = () => {
    resetOffset();
    getAds();
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
        <Button variant="primary" onClick={getFirstPageOfAds}>Get Ads</Button>
      </div>
      <div className="App-ad-pane">
        {ads.map((ad) => (
          <AdUnit ad={ad} key={ad.ad_cluster_id} handleShowNeedLoginModal={handleShowNeedLoginModal}/>
        ))}
      </div>
      <PageNavigation
        showNext={ads.length > 0}
        showPrevious={resultsOffset.current > 0}
        onClickPrevious={getPreviousPageOfAds}
        onClickNext={getNextPageOfAds}
      />
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
