import React from 'react';
import Select from 'react-select';

const FilterSelector = params => {
  const handleChange = selectedOption => {
    params.setState({ selectedOption });
    console.log(`Option selected:`, selectedOption);
  };
  console.log(params.option)
  return (
    <div>
      {params.title}
      <Select
        value={params.option.selectedOption}
        onChange={handleChange}
        options={params.options}
        isSearchable={true}
        isMulti={false}
        name={params.title}
      />
    </div>
  );
}

export default FilterSelector