import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  ButtonGroup,
  Button,
  Navbar,
  Form,
  FormControl,
} from "react-bootstrap";
import "../App.css";

const Header = ({
  search,
  filterValue,
  isStreamActive,
  switchStreamStatus,
}) => {
  const [onActive, setOnActive] = useState(isStreamActive);
  const [searchValue, setSearchValue] = useState("");
  const handleClick = () => {
    switchStreamStatus(!onActive);
    setOnActive(!onActive);
  };

  const changeValue = (event) => {
    setSearchValue(event.target.value);
  };

  useEffect(() => {
    search(searchValue);
  }, [searchValue]);

  return (
    <Navbar bg="light" expand="lg" className="header">
      <ButtonGroup className="button-group">
        <Button
          onClick={handleClick}
          active={!onActive}
          className="switch-button"
        >
          Live
        </Button>
        <Button
          onClick={handleClick}
          active={onActive}
          className="switch-button"
        >
          Pause
        </Button>
      </ButtonGroup>

      <Form className="search" inline>
        <FormControl
          onChange={changeValue}
          value={filterValue}
          type="text"
          placeholder="Search"
          className="mr-sm-2"
        />
      </Form>
    </Navbar>
  );
};

export default Header;
