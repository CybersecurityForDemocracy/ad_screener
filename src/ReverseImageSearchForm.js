import React, { useRef } from "react";
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { Slider, IconButton , Tooltip } from '@material-ui/core';
import { MdInfo } from "react-icons/md";
const ReverseImageSearchForm = params => {
	const handleChange = (e) => {
	  params.setFileState({file:e.target.files[0]});
	  console.log({file:e.target.files[0]});
	};

	const marks = [
		{
			value: 100,
			label: 'Very Low',
		},
		{
			value: 75,
			label: 'Low',
		},
		{
			value: 50,
			label: 'Medium',
		},
		{
			value: 25,
			label: 'High',
		},
		{
			value: 0,
			label: 'Very High',
		},
	];

	const valuetext = (value) => {
		params.setSliderState(marks[value/25]["label"])
	}

	return(
	  <div>
		<Form>
		  <Form.Group>
			<Form.File id="reverse_image_search" label="Upload an image to search for similar ad creatives" onChange={handleChange} accept="image/*"/>
		  </Form.Group>
		  <Form.Group className="Slider">
	    	<Form.Label>Minimum image similarity level 
	    		<Tooltip title="Image similarity lets you control how narrowly or broadly to match ad creatives images. Very High will match ad creative images nearly identical to the uploaded image. Medium will match ad creative images somewhat similar, very similar, and nearly identical to the uploaded image. Very Low will match ad creatives images anywhere between loosely similar and nearly identical to the uploaded image." placement="right">
					<IconButton aria-label="info">
						<MdInfo />
					</IconButton>
				</Tooltip>
	    	</Form.Label>   	  
		    <Slider
				defaultValue={50}
				getAriaValueText={valuetext}
				aria-labelledby="discrete-slider-custom"
				step={null}
				valueLabelDisplay="off"
				marks={marks}
				track={false}
		  	/>
		  </Form.Group>
		</Form>
	  </div>
	);	
}

export default ReverseImageSearchForm