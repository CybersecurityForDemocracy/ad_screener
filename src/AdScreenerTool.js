import React, { useState, useEffect, useRef } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import axios from "axios";
import { addDays } from "date-fns";
import { useQueryParam, StringParam, NumberParam } from 'use-query-params';
import { Link } from 'react-router-dom';
import ReactLoading from 'react-loading';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';

import AdUnit from "./AdUnit.js";
import TimePeriodPicker from "./TimePeriodPicker.js";
import FilterSelector from "./FilterSelector.js";
import LabelEntryForm from "./LabelEntryForm.js";
import SearchField from "./SearchField.js";
import ReverseImageSearchForm from "./ReverseImageSearchForm.js"

const getAdsURL = "/getads";
const getFilterSelectorDataURL = "/filter-options";
const advertiserSearchURL = "/search/pages_type_ahead";

function getSelectorValue(array,param){
  return (param===undefined) ? array[0] : array[array.findIndex(element => element.value === param)]
}

function AdScreenerTool() {
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

const AdClustersDisplay = (params) => {
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
      <div><br /><br /><p>No results found</p></div>
    );
  }
    
  return (
    <div>
      <div className="App-ad-pane" align="center">
        {ads.map((ad) => (
          <AdUnit ad={ad} key={ad.ad_cluster_id} handleShowNeedLoginModal={handleShowNeedLoginModal} topics={topics}/>
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
  const [fullTextSearchQuery, setFullTextSearchQuery] = useState(null);
  const [selectedSearchTab, setSelectedSearchTab] = useState('topics');
  const [isAdvertiserSearchLoading, setIsAdvertiserSearchLoading] = useState(false);
  const [advertiserSearchOptions, setAdvertiserSearchOptions] = useState([]);
  const [pageId, setPageId] = useState(null);
  const [searchImage, setSearchImage] = useState(null);
  const [disableOptions, setDisableOptions] = useState(false);
	
  const numResultsToRequest = 20;
  const resultsOffset = useRef(0);
  const resetOffset = () => { resultsOffset.current = 0 };
  const incermentOffset = (i) => { resultsOffset.current = resultsOffset.current + i };
  const decermentOffset = (i) => { if (resultsOffset.current >= i) {resultsOffset.current = resultsOffset.current - i }};
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);
  const [showTopicModal, setShowTopicModal] = useState(false);
  const handleCloseTopicModal = () => setShowTopicModal(false);
  const handleShowTopicModal = () => setShowTopicModal(true);
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
    console.log("in getads");
    console.log("topic: ", topic.selectedOption);
    console.log("page: ",pageId);
    console.log("full text: ", fullTextSearchQuery);
    console.log("image file: ", searchImage);
    if(!searchImage && !topic.selectedOption && !pageId && !fullTextSearchQuery){
      alert("Invalid search. Please enter a value for one of the search options.");
      setIsGetAdsRequestPending(false);
      setIsAdDataEmpty(false);
    }
    else if(searchImage){
      const formData = new FormData();
      console.log(formData.has('reverse_image_search'));
      formData.append('reverse_image_search', searchImage.file);
      console.log(formData.has('reverse_image_search'));
      const config = {
        headers: {
          'content-type': 'multipart/form-data'
        }
      };
      console.log(formData.get('reverse_image_search'));
      axios
        .post(getAdsURL, formData, config)
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
    else{
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
            offset: resultsOffset.current,
            full_text_search: fullTextSearchQuery,
            page_id: pageId
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

  const handleSelect = (k) => {
  	setSelectedSearchTab(k);
    switch(k) {
      case "topics":
        setFullTextSearchQuery(null);
        setPageId(null);
        setSearchImage(null);
        setDisableOptions(false);
        break;

      case "advertiser":
        setFullTextSearchQuery(null);
        setTopic({ selectedOption: ""});
        setTopicParam(undefined);
        setSearchImage(null);
        setDisableOptions(false);
        break;

      case "fullText":
        setTopic({ selectedOption: ""});
        setTopicParam(undefined);
        setPageId(null);
        setSearchImage(null);
        setDisableOptions(false);
        break;

      case "image":
        setTopic({ selectedOption: ""});
        setTopicParam(undefined);
        setPageId(null);
        setFullTextSearchQuery(null);
        setDisableOptions(true);
        break;

      default:
        alert("Select one of the tabs");
    }
  }

  const handleAdvertiserSearch = (query) => {
	setIsAdvertiserSearchLoading(true);
	axios
	  .get(advertiserSearchURL, {
		params: {
		  q: query
		},
	  })
	  .then((response) => {
		console.log(response.data);
		const results = response.data.data.map((i) => ({
		  id: i.id,
		  page: i.page_name,
		}))
		setAdvertiserSearchOptions(results);
		setIsAdvertiserSearchLoading(false);
		console.log(advertiserSearchOptions);
	  })
	  .catch((error) => {
		console.log(error);
		if (error.response && error.response.status === 401) {
			handleShowNeedLoginModal();
		}
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
      	<div>
      	 Search By:
          <Tabs 
            activeKey={selectedSearchTab}
            onSelect={handleSelect}
          >
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
      	    <Tab
      	      eventKey="advertiser"
      	      title="Advertiser"
      	      mountOnEnter={true}
      	    >
          		<AsyncTypeahead
          		  id="advertiser-search"
          		  isLoading={isAdvertiserSearchLoading}
          		  labelKey="page"
          		  minLength={1}
          		  onSearch={handleAdvertiserSearch}
          		  onChange={(selected) => {try {setPageId(selected[0].id)} catch(e) {}}}
          		  options={advertiserSearchOptions}
          		  placeholder="Search for an advertiser page..."
          		  renderMenuItemChildren={(option, props) => (
          		  	<React.Fragment>
          		  	  <span>{option.page}</span>
          		  	</React.Fragment>
          		  )}
          		/>
            </Tab>
            <Tab
              eventKey="image"
              title="Image"
              mountOnEnter={true}
            >
              <ReverseImageSearchForm 
                setState={setSearchImage}
              />
            </Tab>
          </Tabs>
        </div>
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
          disabled={disableOptions}
        />
        <Button variant="primary" onClick={getFirstPageOfAds}>Get Ads</Button>
      </div>

      <a href="#" onClick={handleShowTopicModal}>
        Click here to suggest topics.
      </a>

      <AdClustersDisplay
        isGetAdsRequestPending={isGetAdsRequestPending}
        isAdDataEmpty={isAdDataEmpty}
        ads={ads}
        handleShowNeedLoginModal={handleShowNeedLoginModal}
        resultsOffset={resultsOffset}
        getPreviousPageOfAds={getPreviousPageOfAds}
        getNextPageOfAds={getNextPageOfAds}
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

export default AdScreenerTool;
 
