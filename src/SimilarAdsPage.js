import React, { useState, useEffect } from "react";
import axios from "axios";
import { useQueryParam, NumberParam } from 'use-query-params';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown'
import Button from "react-bootstrap/Button";
import ReactLoading from 'react-loading';

import "./Dashboard.css";
import UserClusterAdUnit from "./UserClusterAdUnit.js";

const getAdDetailsURL = "/ads/";
const getSimilarAdsURL = "/get_similar_ads/"
const errorImageSrc = 'https://storage.googleapis.com/facebook_ad_archive_screenshots/error.png';

const SimilarAdsDisplay = (params) => {
  const isGetAdsRequestPending = params.isGetAdsRequestPending;
  const isAdDataEmpty = params.isAdDataEmpty;
  const ads = params.ads;

  console.log(ads);

  if(isGetAdsRequestPending) {
    return (
      <div align="center"><br /><ReactLoading type="spin" color="#000"/></div>
    );
  }
  
  if(isAdDataEmpty) {
    return (
      <div className="similar-ads-results"><h5>Similar Ads found: None</h5></div>
    );
  }
    
  return (
    <div className="similar-ads-results">
      {ads.length === 0 ? <div></div> : <h5> Similar Ads found: </h5>}
      <div className="App-ad-pane scroll">
        {ads.map((ad) => (
          <UserClusterAdUnit 
            ad={JSON.parse(ad)} 
            key={ad.archive_id} 
            canDelete={false}
            showAddToClusterButton={true}
          />
        ))}
      </div>
    </div>
  );
}

function SimilarAdsPage() {
	const [archiveIdParam, setArchiveIdParam] = useQueryParam('archive_id', NumberParam);
	const [referenceAdDetails, setReferenceAdDetails] = useState([]);
	const [isReferenceAdDetailsLoaded, setIsReferenceAdDetailsLoaded] = useState(false);
	const [similarAds, setSimilarAds] = useState([]);
	const [similarityFeature, setSimilarityFeature] = useState("---");
	const [similarityLevel, setSimilarityLevel] = useState("---");
	const [isGetAdsRequestPending, setIsGetAdsRequestPending] = useState(false);
	const [isAdDataEmpty, setIsAdDataEmpty] = useState(false);

	const similarityLevelValueMapping = {'Identical': 0, 'High': 8, 'Medium': 16, 'Low': 24}
  const similarityFeatureValueMapping = {'Text': 'creative_body', 'Image': 'creative_image'}

	const getAdDetails = () => {
		axios
		  .get(getAdDetailsURL + archiveIdParam)
		  .then((response) => {
		    console.log(response.data);
		    setReferenceAdDetails(response.data);
		    setIsReferenceAdDetailsLoaded(true);
		  })
		  .catch((error) => {
		    console.log(error);
		  })
		  .finally(() => {});
	};

	const getSimilarAds = () => {
		if(similarityFeature === '---' || similarityLevel === '---') {
			alert("Please select a similarity feature and level!")
			return;
		}
		setIsGetAdsRequestPending(true);
		var ads = [];
		axios
		  .get(getSimilarAdsURL + archiveIdParam + "/" + similarityFeatureValueMapping[similarityFeature] + "/" + similarityLevelValueMapping[similarityLevel])
		  .then((response) => {
		  	let ad_entries = Object.values(response.data);
		    for (let i=0; i<ad_entries.length; i++) {
		      if (ad_entries[i].length !== 0) {
		        for (let j=0; j<ad_entries[i].length; j++){
		    	  ads.push(ad_entries[i][j]);
		    	}
		      }
		    }
		    setSimilarAds(ads);
		    setIsGetAdsRequestPending(false);
		    setIsAdDataEmpty(ads.length === 0);
		    console.log(ads);
		  })
		  .catch((error) => {
		    console.log(error);
		  })
		  .finally(() => {});
	}

	useEffect(() => {
		getAdDetails();
	}, []);

	const handleFeatureSelect = (e) => {
		console.log(e);
		setSimilarityFeature(e);
	}

	const handleSimilaritySelect = (e) => {
		console.log(e);
		setSimilarityLevel(e);
	}

  if (!isReferenceAdDetailsLoaded) {
    return (<h1>Loading...</h1>);
  }

	return(
	  <div>
        <header className="App-header">
          <h1>Welcome to NYU's Misinformation Screener</h1>
        </header>
        <div className="center-align">
          <Button href="/"> Back to dashboard </Button>
        </div>
        <div className="selected-ad-details">
          <div className="ad-image-small">
            <img className="ad-image" alt={referenceAdDetails.url} src={referenceAdDetails.url} onError={errorImageSrc}/>
          </div>
          <div className="selected-ad-info">
            <h4>Archive ID: {referenceAdDetails.archive_id}</h4>
            <hr />
            <h6>Ad creation date: {referenceAdDetails.ad_creation_date}</h6>
            <h6>Last active date: {referenceAdDetails.last_active_date}</h6>
            <h6>Estimated Spend: ${referenceAdDetails.min_spend} - ${referenceAdDetails.max_spend}</h6>
            <h6>Estimated Impressions: {referenceAdDetails.min_impressions} - {referenceAdDetails.max_impressions}</h6>
          </div>
          <div className="similar-ads-form">
            <h5>Find Similar Ads:</h5>
            <div className="similar-ads-form-dropdown-align">
              <DropdownButton
                title="Select feature"
                className="pad-button"
                onSelect={handleFeatureSelect}
              >
                <Dropdown.Item eventKey="Text">Text</Dropdown.Item>
                <Dropdown.Item eventKey="Image">Image</Dropdown.Item>
              </DropdownButton>
              <DropdownButton
                title="Select similarity level"
                className="pad-button"
                onSelect={handleSimilaritySelect}
              >
                <Dropdown.Item eventKey="Identical">Identical</Dropdown.Item>
                <Dropdown.Item eventKey="High">High</Dropdown.Item>
                <Dropdown.Item eventKey="Medium">Medium</Dropdown.Item>
                <Dropdown.Item eventKey="Low">Low</Dropdown.Item>
              </DropdownButton>
            </div>
            <div className="similarity-selections">
              Feature:{" " + similarityFeature}<br />
              Similarity:{" " + similarityLevel}
            </div>
            <Button className="similar-ads-button" onClick={getSimilarAds}>View Similar Ads</Button>
          </div>
        </div>
        <SimilarAdsDisplay
          isGetAdsRequestPending={isGetAdsRequestPending}
          isAdDataEmpty={isAdDataEmpty}
          ads={similarAds}
        />
      </div>
	);
}

export default SimilarAdsPage;