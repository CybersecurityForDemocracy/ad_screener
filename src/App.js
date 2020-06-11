import React, { useState, useEffect, useRef } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import { addDays } from "date-fns";
import { useQueryParam, StringParam, NumberParam } from 'use-query-params';
import { Link } from 'react-router-dom';
import ReactLoading from 'react-loading';

import "./App.css";
import AdUnit from "./AdUnit.js";
import TimePeriodPicker from "./TimePeriodPicker.js";
import FilterSelector from "./FilterSelector.js";

const getAdsURL = "/getads";
const getFilterSelectorDataURL = "/filter-options";

const disableOptions = false;

function getSelectorValue(array,param){
	return (param==undefined) ? array[0] : array[array.findIndex(element => element.value === param)]
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

const AdCluster = (params) => {
  const isGetAdsRequestPending = params.isGetAdsRequestPending;
  const isAdDataEmpty = params.isAdDataEmpty;
  const ads = params.ads;
  const handleShowNeedLoginModal = params.handleShowNeedLoginModal;
  const resultsOffset = params.resultsOffset;
  const getPreviousPageOfAds = params.getPreviousPageOfAds;
  const getNextPageOfAds = params.getNextPageOfAds;

  if(!isGetAdsRequestPending) {
    return (
      <div align="center"><br /><br /><ReactLoading type="spin" color="#000"/></div>
    );
  }
  else {
    if(isAdDataEmpty) {
      return (
        <div><br /><br /><p>No results found</p></div>
      );
    }
    else{
      return (
        <div>
          <div className="App-ad-pane" align="center">
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
        </div>
      );
    }
  }
  return (<div><br /><br /><p>Error loading results</p></div>);
}

const AdScreener = (params) => {

  const [startDateParam, setStartDateParam] = useQueryParam('Start Date', StringParam);
  const [endDateParam, setEndDateParam] = useQueryParam('End Date', StringParam);
  const [topicParam, setTopicParam] = useQueryParam('Topic', StringParam);
  const [regionParam, setRegionParam] = useQueryParam('Region', StringParam);
  const [genderParam, setGenderParam] = useQueryParam('Gender', StringParam);
  const [ageRangeParam, setAgeRangeParam] = useQueryParam('Age Range', StringParam);
  const [riskScoreParam, setRiskScoreParam] = useQueryParam('Risk Score', StringParam);
  const [orderByParam, setOrderByParam] = useQueryParam('Sort By Field', StringParam);
  const [orderDirectionParam, setOrderDirectionParam] = useQueryParam('Sort Order', StringParam);

  const [startDate, setStartDate] = useState((startDateParam===undefined) ? addDays(new Date(), -7) : new Date(startDateParam));
  const [endDate, setEndDate] = useState((endDateParam===undefined) ? new Date() : new Date(endDateParam));
  const [topic, setTopic] = useState({ selectedOption: getSelectorValue(params.topics,topicParam)});
  const [region, setRegion] = useState({ selectedOption: getSelectorValue(params.regions,regionParam)});
  const [gender, setGender] = useState({ selectedOption: getSelectorValue(params.genders,genderParam)});
  const [ageRange, setAgeRange] = useState({ selectedOption: getSelectorValue(params.ageRanges,ageRangeParam)});
  const [riskScore, setRiskScore] = useState({ selectedOption: getSelectorValue(params.riskScores,riskScoreParam)});
  const [orderBy, setOrderBy] = useState({ selectedOption: getSelectorValue(params.orderByOptions,orderByParam)});
  const [orderDirection, setOrderDirection] = useState({ selectedOption: getSelectorValue(params.orderDirections,orderDirectionParam)});
  
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
  const [isGetAdsRequestPending, setIsGetAdsRequestPending] = useState(false);
  const [isAdDataEmpty, setIsAdDataEmpty] = useState(false);
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
    setIsGetAdsRequestPending(true);
    setIsAdDataEmpty(true);
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
        setIsAdDataEmpty(response.data.length === 0);
        setIsGetAdsRequestPending(false);
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

      <AdCluster
        isGetAdsRequestPending={isGetAdsRequestPending}
        isAdDataEmpty={isAdDataEmpty}
        ads={ads}
        handleShowNeedLoginModal={handleShowNeedLoginModal}
        resultsOffset={resultsOffset}
        getPreviousPageOfAds={getPreviousPageOfAds}
        getNextPageOfAds={getNextPageOfAds}
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
