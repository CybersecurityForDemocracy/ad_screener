import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useQueryParam, StringParam } from 'use-query-params';

const TimePeriodPicker = (params) => {
  const [startingDate, setStartingDate] = useQueryParam('Start Date', StringParam);
  const [endingDate, setEndingDate] = useQueryParam('End Date', StringParam);
  const updateStartTime = (date) => {
    params.setStartDate(date);
    setStartingDate(date.toString());
  };
  const updateEndTime = (date) => {
    params.setEndDate(date);
    setEndingDate(date.toString());
  };
  console.log(params.startDate);
  console.log(params.endDate);

  return (
    <div>
      <div>
        Start Date:{" "}
        <DatePicker selected={params.startDate} onChange={updateStartTime} disabled={params.disabled}/>
      </div>
      <div>
        End Date:{" "}
        <DatePicker selected={params.endDate} onChange={updateEndTime} disabled={params.disabled}/>
      </div>
    </div>
  );
};

export default TimePeriodPicker;
