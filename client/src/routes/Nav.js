import React from "react";
import { Navbar } from "react-bootstrap";
import "./Nav.scss";
import { GiAbstract069 } from "react-icons/gi";


const Nav = () => {
  return (
    <Navbar  variant="dark" bg="dark">
      <Navbar.Brand  >
       
        <GiAbstract069 style={{height:"40px",width:"45px"}}  />  {" "}
        D-Chat
      </Navbar.Brand>

    </Navbar>
  );
};

export default Nav;
