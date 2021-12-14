import React  from "react";
import { v1 as uuid } from "uuid";
import "./CreateRoom.scss";
import {Button} from "react-bootstrap";
const CreateRoom = (props) => {
  

  function create() {
    const id = uuid();
    props.history.push(`/room/${id}`);

   
  }

  return (
      <div className={"contain"} >
          <Button onClick={create} variant="outline-dark" size="lg">Let's Create Room </Button>
      
      </div>
      
    
  );
};

export default CreateRoom;
