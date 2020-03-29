import { addDays } from 'date-fns';
import React, { useState } from 'react';
import AdUnit from "./AdUnit.js";
import './App.css';
import TimePeriodPicker from './TimePeriodPicker.js';
import FilterSelector from './FilterSelector.js';
import axios from 'axios';

function App() {
  const [startDate, setStartDate] = useState(addDays(new Date(), -7));
  const [endDate, setEndDate] = useState(new Date());

  const [content, setContent] = useState('');
  const [ads, setAds] = useState([{
    funding_entity: 'Funding Entity',
    url: 'https://3jbq2ynuxa-flywheel.netdna-ssl.com/wp-content/uploads/2017/05/Autopilot.png',
    spend: '0-99 USD',
    impressions: '1000-5000',
    ad_lib_url: 'https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=US&impression_search_field=has_impressions_lifetime&view_all_page_id=153080620724',
    archive_id: 0
  }]);
  const [topic, setTopic] = useState({ selectedOption: { label: "COVID-19", value: 914 } });
  const topics = [
    { label: "Abortion", value: 612 },
    { label: "Addiction", value: 597 },
    { label: "Addition", value: 621 },
    { label: "African American Community", value: 616 },
    { label: "Ballot Measure", value: 607 },
    { label: "COVID-19", value: 914 },
    { label: "Children/Parenting/Eldercare", value: 601 },
    { label: "Democratic Norms", value: 598 },
    { label: "Donate", value: 599 },
    { label: "Economy/Taxes", value: 622 },
    { label: "Education  (college/university)", value: 619 },
    { label: "Education (K-12)", value: 618 },
    { label: "Elections", value: 606 },
    { label: "Energy", value: 609 },
    { label: "Environment/Climate", value: 602 },
    { label: "Foreign Policy", value: 617 },
    { label: "Guns", value: 615 },
    { label: "Heathcare", value: 623 },
    { label: "Immigration", value: 613 },
    { label: "Latino Community", value: 611 },
    { label: "Military/War", value: 614 },
    { label: "National Security / Terrorism", value: 600 },
    { label: "Pending Legislation", value: 605 },
    { label: "Political persuading / broken system", value: 603 },
    { label: "Regulation", value: 620 },
    { label: "Rural Community", value: 608 },
    { label: "Veterans Issues", value: 604 },
    { label: "Womens Issues", value: 610 }
  ]

  const [region, setRegion] = useState({ selectedOption: { label: "New York", value: "NY" } });
  const regions = [
    {
      label: "Alabama",
      value: "AL"
    },
    {
      label: "Alaska",
      value: "AK"
    },
    {
      label: "American Samoa",
      value: "AS"
    },
    {
      label: "Arizona",
      value: "AZ"
    },
    {
      label: "Arkansas",
      value: "AR"
    },
    {
      label: "California",
      value: "CA"
    },
    {
      label: "Colorado",
      value: "CO"
    },
    {
      label: "Connecticut",
      value: "CT"
    },
    {
      label: "Delaware",
      value: "DE"
    },
    {
      label: "District Of Columbia",
      value: "DC"
    },
    {
      label: "Federated States Of Micronesia",
      value: "FM"
    },
    {
      label: "Florida",
      value: "FL"
    },
    {
      label: "Georgia",
      value: "GA"
    },
    {
      label: "Guam",
      value: "GU"
    },
    {
      label: "Hawaii",
      value: "HI"
    },
    {
      label: "Idaho",
      value: "ID"
    },
    {
      label: "Illinois",
      value: "IL"
    },
    {
      label: "Indiana",
      value: "IN"
    },
    {
      label: "Iowa",
      value: "IA"
    },
    {
      label: "Kansas",
      value: "KS"
    },
    {
      label: "Kentucky",
      value: "KY"
    },
    {
      label: "Louisiana",
      value: "LA"
    },
    {
      label: "Maine",
      value: "ME"
    },
    {
      label: "Marshall Islands",
      value: "MH"
    },
    {
      label: "Maryland",
      value: "MD"
    },
    {
      label: "Massachusetts",
      value: "MA"
    },
    {
      label: "Michigan",
      value: "MI"
    },
    {
      label: "Minnesota",
      value: "MN"
    },
    {
      label: "Mississippi",
      value: "MS"
    },
    {
      label: "Missouri",
      value: "MO"
    },
    {
      label: "Montana",
      value: "MT"
    },
    {
      label: "Nebraska",
      value: "NE"
    },
    {
      label: "Nevada",
      value: "NV"
    },
    {
      label: "New Hampshire",
      value: "NH"
    },
    {
      label: "New Jersey",
      value: "NJ"
    },
    {
      label: "New Mexico",
      value: "NM"
    },
    {
      label: "New York",
      value: "NY"
    },
    {
      label: "North Carolina",
      value: "NC"
    },
    {
      label: "North Dakota",
      value: "ND"
    },
    {
      label: "Northern Mariana Islands",
      value: "MP"
    },
    {
      label: "Ohio",
      value: "OH"
    },
    {
      label: "Oklahoma",
      value: "OK"
    },
    {
      label: "Oregon",
      value: "OR"
    },
    {
      label: "Palau",
      value: "PW"
    },
    {
      label: "Pennsylvania",
      value: "PA"
    },
    {
      label: "Puerto Rico",
      value: "PR"
    },
    {
      label: "Rhode Island",
      value: "RI"
    },
    {
      label: "South Carolina",
      value: "SC"
    },
    {
      label: "South Dakota",
      value: "SD"
    },
    {
      label: "Tennessee",
      value: "TN"
    },
    {
      label: "Texas",
      value: "TX"
    },
    {
      label: "Utah",
      value: "UT"
    },
    {
      label: "Vermont",
      value: "VT"
    },
    {
      label: "Virgin Islands",
      value: "VI"
    },
    {
      label: "Virginia",
      value: "VA"
    },
    {
      label: "Washington",
      value: "WA"
    },
    {
      label: "West Virginia",
      value: "WV"
    },
    {
      label: "Wisconsin",
      value: "WI"
    },
    {
      label: "Wyoming",
      value: "WY"
    }
  ]
  const [gender, setGender] = useState({ selectedOption: { label: "Female", value: "F" } })
  const genders = [{ label: "Male", value: "M" },
  { label: "Female", value: "F" },
  { label: "Unknown", value: "U" }
  ]

  const [ageRange, setAgeRange] = useState({ selectedOption: { label: "18-24", value: "18-24" } })
  const ageRanges = [
    { label: "18-24", value: "18-24" },
    { label: "25-34", value: "25-34" },
    { label: "35-44", value: "35-44" },
    { label: "45-54", value: "45-54" },
    { label: "55-64", value: "55-64" },
    { label: "65+", value: "65+" }
  ]
  const getAds = () => {
    axios.get('http://ccs3usr.engineering.nyu.edu:8008/',
      {
        params: {
          startDate: startDate,
          endDate: endDate,
          topic: topic.selectedOption.value,
          region: region.selectedOption.label, // This is intentional
          gender: gender.selectedOption.value,
          ageRange: ageRange.selectedOption.value
        }
      }).then(
        response => {
          console.log(response)
          console.log(response.data)
          setContent(JSON.stringify(response.data))
          setAds(response.data)
        }
      ).catch(error => {
        console.log(error)
      }).finally(() => { });
  };

  return (
    <div className="App">
      <header className="App-header">
      </header>
      <div className="App-filter-selector">
        <FilterSelector setState={setTopic} option={topic} title="Topic" options={topics} />
        <FilterSelector setState={setRegion} option={region} title="Region" options={regions} />
        <FilterSelector setState={setGender} option={gender} title="Gender" options={genders} />
        <FilterSelector setState={setAgeRange} option={ageRange} title="Age Range" options={ageRanges} />
        <TimePeriodPicker startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate} />
        <button onClick={getAds}>
          Get Ads
        </button>
        <p>{content}</p>
      </div>
      <div className="App-ad-pane">
        <ul>
          {ads.map(ad => (<AdUnit ad={ad} key={ad.archive_id} />))}
        </ul>
      </div>
    </div>
  );
}

export default App;
