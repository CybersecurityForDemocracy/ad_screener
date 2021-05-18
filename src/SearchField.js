import React, { useRef } from "react";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";

const SearchField = params => {
  const textInput = useRef(null);
  const handleChange = () => {
    params.setState(textInput.current.value);
    console.log(`Keyword:`, textInput.current.value);
  };

  const popover = (
    <Popover id="popover-basic">
      <Popover.Title as="h3">What is full text search?</Popover.Title>
      <Popover.Content>
        This feature searches all text in an ad, page name, funding entity, and many other things.
      </Popover.Content>
    </Popover>
  );

  return (
    <InputGroup>
      <OverlayTrigger placement="right" overlay={popover}>
      <FormControl
        placeholder="keyword"
        onChange={handleChange}
        ref={textInput}
      />
      </OverlayTrigger>
    </InputGroup>
  );
}

export default SearchField