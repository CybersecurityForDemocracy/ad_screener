import React, { useState } from "react";
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

// Real Data URL
const realAdsURL = "http://ccs3usr.engineering.nyu.edu:8010/getads";

// Test URL
const mockAdsURL = "http://ccs3usr.engineering.nyu.edu:8010/getmockads";

const useMockData = true;
const disableOptions = false;

const getAdsURL = useMockData ? mockAdsURL : realAdsURL;

function App() {
  const [startDate, setStartDate] = useState(addDays(new Date(), -7));
  const [endDate, setEndDate] = useState(new Date());
  const [topic, setTopic] = useState({ selectedOption: topics[5] });
  const [region, setRegion] = useState({ selectedOption: regions[0] });
  const [gender, setGender] = useState({ selectedOption: genders[0] });
  const [ageRange, setAgeRange] = useState({ selectedOption: ageRanges[0] });
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
          ageRange: ageRange.selectedOption.value
        }
      })
      .then(response => {
        console.log(response.data);
        setAds(response.data);
      })
      .catch(error => {
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
        <TimePeriodPicker
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
        />
        <button onClick={getAds}>Get Ads</button>
      </div>
      <div className="App-ad-pane">
        {ads.map(ad => (
          <AdUnit ad={ad} key={ad.archive_id} />
        ))}
      </div>
      <Modal
        show={showModal}
        onHide={handleClose}
        dialogClassName="modal-90w"
        size="lg"
      >
        <Modal.Header>
          <Modal.Title>How to use this tool</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Please fill me in with details and disclaimers</p>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default App;
