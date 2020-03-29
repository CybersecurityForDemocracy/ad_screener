import React from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const TimePeriodPicker = params => {
    const updateStartTime = date => {
        params.setStartDate(date);
    };
    const updateEndTime = date => {
        params.setEndDate(date)
    };
    console.log(params.startDate);
    console.log(params.endDate);

    return <div>
        Time Range<br />
        <div>
            Start Time:
    <DatePicker selected={params.startDate} onChange={updateStartTime} /></div>
        <div>
            End Time:
    <DatePicker selected={params.endDate} onChange={updateEndTime} /></div>
    </div>;
}

export default TimePeriodPicker;