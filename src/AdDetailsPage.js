import React, { useState, useEffect } from "react";
import axios from "axios";
import { useQueryParam, StringParam } from 'use-query-params';

import AdDetailsContent from "./AdDetailsContent.js";

const getClusterURL = "/archive-id";

function AdDetailsPage() {
	const [adIdParam, setAdIdParam] = useQueryParam('ad_id', StringParam);
	const [adClusterData, setAdClusterData] = useState([]);
	const [isAdClusterDataLoaded, setIsAdClusterDataLoaded] = useState(false);
	const [isAdClusterDataEmpty, setIsAdClusterDataEmpty] = useState(false);

	const getAdClusterData = () => {
		axios
		  .get(getClusterURL + '/' + adIdParam + '/cluster')
		  .then((response) => {
		    console.log(response.data);
		    setAdClusterData(response.data);
		    setIsAdClusterDataLoaded(true);
		  })
		  .catch((error) => {
		    console.log(error);
		    if (error.response.status === 404) {
		      setIsAdClusterDataEmpty(true);
		    }
		  })
		  .finally(() => {});
	};
	
	useEffect(() => {
		getAdClusterData();
	}, []);

	if (isAdClusterDataEmpty) {
		return (<div><br /><br /><br /><h3 align="center">No results found</h3></div>);
	}

	if (!isAdClusterDataLoaded) {
		return (<h1>Loading...</h1>);
	}

	return (
		<div className="App-ad-cluster-data">
		<h2>Cluster ID: {adClusterData.ad_cluster_id} </h2>
		<hr />
		<AdDetailsContent
		  details={adClusterData}
		/>
		</div>
	);
}

export default AdDetailsPage;