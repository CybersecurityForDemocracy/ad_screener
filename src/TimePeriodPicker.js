import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useQueryParam, StringParam } from 'use-query-params';

const TimePeriodPicker = (params) => {
  const [sd, setsd] = useQueryParam('Start Date', StringParam);
  const [ed, seted] = useQueryParam('End Date', StringParam);
  const updateStartTime = (date) => {
    params.setStartDate(date);
    setsd(date.toString());
  };
  const updateEndTime = (date) => {
    params.setEndDate(date);
    seted(date.toString());
  };
  console.log(params.startDate);
  console.log(params.endDate);

  return (
    <div>
      <div>
        Start Date:{" "}
        <DatePicker selected={params.startDate} onChange={updateStartTime} />
      </div>
      <div>
        End Date:{" "}
        <DatePicker selected={params.endDate} onChange={updateEndTime} />
      </div>
    </div>
  );
};

export default TimePeriodPicker;
