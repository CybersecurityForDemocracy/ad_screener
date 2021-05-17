import React, { useState, useEffect, useRef } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import axios from "axios";
import { addDays } from "date-fns";
import { useQueryParam, StringParam, NumberParam } from 'use-query-params';
import { Link } from 'react-router-dom';
import ReactLoading from 'react-loading';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';

import AdUnit from "./AdUnit.js";
import AdClusterUnit from "./AdClusterUnit.js";
import TimePeriodPicker from "./TimePeriodPicker.js";
import FilterSelector from "./FilterSelector.js";
import LabelEntryForm from "./LabelEntryForm.js";
import SearchField from "./SearchField.js";
import ReverseImageSearchForm from "./ReverseImageSearchForm.js"

import "./Dashboard.css"

import { auth } from "./firebase";
import withAuthorization from "./withAuthorization";
import Cookies from 'js-cookie';

const getAdClustersURL = "/ad-clusters";
const getAdsURL = "/ads"
const getFilterSelectorDataURL = "/filter-options";
const advertiserSearchURL = "/search/pages_type_ahead";
const id_token_cookie_name = 'id_token';

function getSelectorValue(array,param){
  return (param===undefined) ? array[0] : array[array.findIndex(element => element.value === param)]
}

function SearchTool() {
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

  return (
    <AdScreener
      topics={topics}
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

const AdsDisplay = (params) => {
  const isGetAdsRequestPending = params.isGetAdsRequestPending;
  const isAdDataEmpty = params.isAdDataEmpty;
  const ads = params.ads;
  const handleShowNeedLoginModal = params.handleShowNeedLoginModal;
  const resultsOffset = params.resultsOffset;
  const getPreviousPageOfAds = params.getPreviousPageOfAds;
  const getNextPageOfAds = params.getNextPageOfAds;
  const topics = params.topics;

  if(isGetAdsRequestPending) {
    return (
      <div align="center"><br /><br /><ReactLoading type="spin" color="#000"/></div>
    );
  }
  
  if(isAdDataEmpty) {
    return (
      <div><br /><br /><h5>Ads found: None</h5></div>
    );
  }
    
  return (
    <div>
      {ads.length === 0 ? <div></div> : <h5> Ads found: </h5>}
      <div className="App-ad-pane">
        {ads.map((ad) => (
          <AdUnit 
            ad={ad} 
            key={ad.archive_id} 
            handleShowNeedLoginModal={handleShowNeedLoginModal} 
            topics={topics}
          />
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

const AdClustersDisplay = (params) => {
  const isGetAdsRequestPending = params.isGetAdsRequestPending;
  const isAdDataEmpty = params.isAdDataEmpty;
  const adClusters = params.adClusters;
  const handleShowNeedLoginModal = params.handleShowNeedLoginModal;
  const resultsOffset = params.resultsOffset;
  const getPreviousPageOfAds = params.getPreviousPageOfAds;
  const getNextPageOfAds = params.getNextPageOfAds;
  const topics = params.topics;

  if(isGetAdsRequestPending) {
    return (
      <div align="center"><br /><br /><ReactLoading type="spin" color="#000"/></div>
    );
  }
  
  if(isAdDataEmpty) {
    return (
      <div><br /><br /><h5>Ad Clusters found: None</h5></div>
    );
  }
    
  return (
    <div>
      {adClusters.length == 0 ? <div></div> : <h5> Clusters found: </h5>}
      <div className="App-ad-pane">
        {adClusters.map((ad) => (
          <AdClusterUnit 
            ad={ad} 
            key={ad.ad_cluster_id} 
            handleShowNeedLoginModal={handleShowNeedLoginModal} 
            topics={topics}
          />
        ))}
      </div>
      <PageNavigation
        showNext={adClusters.length > 0}
        showPrevious={resultsOffset.current > 0}
        onClickPrevious={getPreviousPageOfAds}
        onClickNext={getNextPageOfAds}
      />
    </div>
  );
}

const AdScreener = (params) => {

  const [startDateParam, setStartDateParam] = useQueryParam('Start Date', StringParam);
  const [endDateParam, setEndDateParam] = useQueryParam('End Date', StringParam);
  const [topicParam, setTopicParam] = useQueryParam('Topic', StringParam);

  const [startDate, setStartDate] = useState((startDateParam===undefined) ? addDays(new Date(), -7) : new Date(startDateParam));
  const [endDate, setEndDate] = useState((endDateParam===undefined) ? new Date() : new Date(endDateParam));
  const [topic, setTopic] = useState({ selectedOption: getSelectorValue(params.topics,topicParam)});
  const [fullTextSearchQuery, setFullTextSearchQuery] = useState(null);
  const [selectedSearchTab, setSelectedSearchTab] = useState('topics');
  const [disableOptions, setDisableOptions] = useState(false);
	
  const numAdResultsToRequest = 10;
  const numAdClusterResultsToRequest = 10;
  const adResultsOffset = useRef(0);
  const adClusterResultsOffset = useRef(0);
  const resetAdOffset = () => { adResultsOffset.current = 0 };
  const resetAdClusterOffset = () => { adClusterResultsOffset.current = 0 };
  const incrementAdOffset = (i) => { adResultsOffset.current = adResultsOffset.current + i };
  const incrementAdClusterOffset = (i) => { adClusterResultsOffset.current = adClusterResultsOffset.current + i };
  const decrementAdOffset = (i) => { if (adResultsOffset.current >= i) {adResultsOffset.current = adResultsOffset.current - i }};
  const decrementAdClusterOffset = (i) => { if (adClusterResultsOffset.current >= i) {adClusterResultsOffset.current = adClusterResultsOffset.current - i }};
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);
  const [showTopicModal, setShowTopicModal] = useState(false);
  const handleCloseTopicModal = () => setShowTopicModal(false);
  const handleShowTopicModal = () => setShowTopicModal(true);
  const [showNeedLoginModal, setShowNeedLoginModal] = useState(false);
  const handleShowNeedLoginModal = () => setShowNeedLoginModal(true);
  const handleCloseNeedLoginModal = () => setShowNeedLoginModal(false);
  const [isGetAdClustersRequestPending, setIsGetAdClustersRequestPending] = useState(false);
  const [isAdClusterDataEmpty, setIsAdClusterDataEmpty] = useState(false);
  const [isGetAdsRequestPending, setIsGetAdsRequestPending] = useState(false);
  const [isAdDataEmpty, setIsAdDataEmpty] = useState(false);
  const [adClusters, setAdClusters] = useState([
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

  const getIndividualAds = () => {
    setIsGetAdsRequestPending(true);
    setIsAdDataEmpty(true);
    console.log("in getads");
    console.log("topic: ", topic.selectedOption);
    console.log("full text: ", fullTextSearchQuery);
    if(!topic.selectedOption && !fullTextSearchQuery){
      alert("Invalid search. Please enter a value for one of the search options.");
      setIsGetAdsRequestPending(false);
      setIsAdDataEmpty(false);
    }
    else{
      axios
        .get(getAdsURL, {
          params: {
            startDate: startDate,
            endDate: endDate,
            topic: topic.selectedOption.value,
            full_text_search: fullTextSearchQuery,
            offset: adResultsOffset.current,
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
          setIsAdDataEmpty(true);
          setIsGetAdsRequestPending(false);
        })
        .finally(() => {});
      }
  };

  const getAdClusters = () => {
    setIsGetAdClustersRequestPending(true);
    setIsAdClusterDataEmpty(true);
    console.log("in getads");
    console.log("topic: ", topic.selectedOption);
    console.log("full text: ", fullTextSearchQuery);
    if(!topic.selectedOption && !fullTextSearchQuery){
      alert("Invalid search. Please enter a value for one of the search options.");
      setIsGetAdClustersRequestPending(false);
      setIsAdClusterDataEmpty(false);
    }
    else{
      axios
        .get(getAdClustersURL, {
          params: {
            startDate: startDate,
            endDate: endDate,
            topic: topic.selectedOption.value,
            full_text_search: fullTextSearchQuery,
            offset: adClusterResultsOffset.current,
          },
        })
        .then((response) => {
          console.log(response.data);
          setAdClusters(response.data);
          setIsAdClusterDataEmpty(response.data.length === 0);
          setIsGetAdClustersRequestPending(false);
        })
        .catch((error) => {
          console.log(error);
          if (error.response && error.response.status === 401) {
            handleShowNeedLoginModal();
          }
          setIsAdClusterDataEmpty(true);
          setIsGetAdClustersRequestPending(false);
        })
        .finally(() => {});
      }
  };

  const getPreviousPageOfAds = (mode) => {
    switch(mode) {
      case "clusters":
        decrementAdClusterOffset(numAdClusterResultsToRequest);
        getAdClusters();
        break;
      case "ad":
        decrementAdOffset(numAdResultsToRequest);
        getIndividualAds();
        break;
      default:
        decrementAdOffset(numAdResultsToRequest);
        decrementAdClusterOffset(numAdClusterResultsToRequest);
        getAdClusters();
        getIndividualAds();     
    } 
  };
  
  const getNextPageOfAds = (mode) => {
    switch(mode) {
      case "clusters":
        incrementAdClusterOffset(numAdClusterResultsToRequest);
        getAdClusters();
        break;
      case "ad":
        incrementAdOffset(numAdResultsToRequest);
        getIndividualAds();
        break;
      default:
        incrementAdOffset(numAdResultsToRequest);
        incrementAdClusterOffset(numAdClusterResultsToRequest);
        getAdClusters();
        getIndividualAds();     
    } 
  };

  const getFirstPageOfAds = (mode) => {
    switch(mode) {
      case "clusters":
        resetAdClusterOffset();
        getAdClusters();
        setAds([]);
        break;
      case "ad":
        resetAdOffset();
        getIndividualAds();
        setAdClusters([]);
        break;
      case "all":
        resetAdOffset();
        resetAdClusterOffset();
        getAdClusters();
        getIndividualAds();
        break;
      default:
        resetAdOffset();
        resetAdClusterOffset();
        getAdClusters();
        getIndividualAds();     
    }  
  };

  const handleSelect = (k) => {
  	setSelectedSearchTab(k);
    switch(k) {
      case "topics":
        setFullTextSearchQuery(null);
        setDisableOptions(false);
        break;

      case "fullText":
        setTopic({ selectedOption: ""});
        setTopicParam(undefined);
        setDisableOptions(false);
        break;

      default:
        alert("Select one of the tabs");
    }
  }

  const handleSignOut = function () {
    Cookies.remove(id_token_cookie_name);
    auth.signOut();
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to NYU's Misinformation Screener</h1>
        <Button onClick={handleSignOut}>Sign Out</Button>
      </header>
      <div className="center-align">
        <Button href="/"> Back to dashboard </Button>
      </div>
      <p>
        Please select filters below and click 'Get Ads' to load content.{" "}
        {/* eslint-disable-next-line */}
        <a href="#" onClick={handleShow}>
          Click here for more information.
        </a>
      </p>

      <div className="App-filter-selector">
        <div className="search-field">
          <Tabs 
            activeKey={selectedSearchTab}
            onSelect={handleSelect}
          >
            <Tab 
              eventKey="search" title="Search by" disabled>
            </Tab>
            <Tab
      	      eventKey="topics"
      	      title="Topic"
      	      mountOnEnter={true}
      	    >
    		      <FilterSelector
    		        setState={setTopic}
    		        option={topic}
    		        options={params.topics}
    		      />
            </Tab>
            <Tab
      	      eventKey="fullText"
      	      title="Full Text"
      	      mountOnEnter={true}
      	    >   
  	          <SearchField
  	            setState={setFullTextSearchQuery}
  	          />
            </Tab>
          </Tabs>
        </div>
        <TimePeriodPicker
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          disabled={disableOptions}
        />
        <DropdownButton className="pad-button" title="Get Ads">
          <Dropdown.Item onClick={() => {getFirstPageOfAds("all")}}>Show all results</Dropdown.Item>
          <Dropdown.Item onClick={() => {getFirstPageOfAds("ad")}}>Show only individual ads</Dropdown.Item>
          <Dropdown.Item onClick={() => {getFirstPageOfAds("clusters")}}>Show only clusters (with identical ads)</Dropdown.Item>
        </DropdownButton>
      </div>

      <a href="#" onClick={handleShowTopicModal}>
        Click here to suggest topics.
      </a>

      <AdClustersDisplay
        isGetAdsRequestPending={isGetAdClustersRequestPending}
        isAdDataEmpty={isAdClusterDataEmpty}
        adClusters={adClusters}
        handleShowNeedLoginModal={handleShowNeedLoginModal}
        resultsOffset={adClusterResultsOffset}
        getPreviousPageOfAds={() => getPreviousPageOfAds("clusters")}
        getNextPageOfAds={() => getNextPageOfAds("clusters")}
        topics={params.topics}
      />

      <AdsDisplay
        isGetAdsRequestPending={isGetAdsRequestPending}
        isAdDataEmpty={isAdDataEmpty}
        ads={ads}
        handleShowNeedLoginModal={handleShowNeedLoginModal}
        resultsOffset={adResultsOffset}
        getPreviousPageOfAds={() => getPreviousPageOfAds("ads")}
        getNextPageOfAds={() => getNextPageOfAds("ads")}
        topics={params.topics}
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
        show={showTopicModal}
        onHide={handleCloseTopicModal}
        dialogClassName="modal-90w"
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Suggest a new topic</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <LabelEntryForm />
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

const authCondition = authUser => !!authUser;
export default withAuthorization(authCondition)(SearchTool);