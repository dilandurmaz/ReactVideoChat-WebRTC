import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import io from "socket.io-client";
import {Collapse} from "react-bootstrap";

const Page = styled.div`
  display: flex;
  width: 26%;
  align-self: stretch;
  flex-direction: column;
  right:0;
  position:absolute;
  margin-top:-10px;
  margin:20px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 300px;
  max-height: 400px;
  overflow: auto;
  width: 97%;
  border: 1px solid black;
  border-radius: 10px;
  padding-bottom: 10px;
  margin-top: 5px;
  
`;

const TextArea = styled.textarea`
  width: 98%;
  height: 100px;
  border-radius: 10px;
  margin-top: 10px;
  padding-left: 10px;
  padding-top: 10px;
  font-size: 17px;
  background-color: transparent;
  border: 1px solid black;
  outline: none;
  letter-spacing: 1px;
  line-height: 20px;
  ::placeholder {
    color: lightgray;
  }
`;

const Button = styled.button`
  background-color: #212529;
  width: 98%;
  border: none;
  height: 50px;
  border-radius: 10px;
  color: white;
  font-size: 1.5rem;
`;

const Form = styled.form`
  width: 400px;
`;

const MyRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
`;

const MyMessage = styled.div`
  width: 45%;
  background-color: #212529;
  color: white;
  padding: 10px;
  margin-right: 5px;
  text-align: center;
  border-top-right-radius: 10%;
  border-bottom-right-radius: 10%;
`;

const PartnerRow = styled(MyRow)`
  justify-content: flex-start;
`;

const PartnerMessage = styled.div`
  width: 45%;
  background-color: #212529;
  color: white;
  border: 1px solid lightgray;
  padding: 10px;
  margin-left: 5px;
  text-align: center;
  border-top-left-radius: 10%;
  border-bottom-left-radius: 10%;
`;

const Chat = () => {
  
  const [open, setOpen] = useState(false); 

  const [yourID, setYourID] = useState();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io.connect("http://localhost:5000/");

    socketRef.current.on("your id", (id) => {
      setYourID(id);
    });

    socketRef.current.on("message", (message) => {
      console.log("here");
      receivedMessage(message);
    });
  }, []);

  function receivedMessage(message) {
    setMessages((oldMsgs) => [...oldMsgs, message]);
  }

  function sendMessage(e) {
    e.preventDefault();
    const messageObject = {
      body: message,
      id: yourID,
    };
    setMessage("");
    socketRef.current.emit("send message", messageObject);
  }

  function handleChange(e) {
    setMessage(e.target.value);
  }

  return (
    <Page>
        <Button
        onClick={() => setOpen(!open)}
        aria-controls="example-collapse-text"
        aria-expanded={open}
      >
        Chat
      </Button>
      <Collapse in={open}>
        <div id="example-collapse-text">
        <Container>
        {messages.map((message, index) => {
          if (message.id === yourID) {
            return (
              <MyRow key={index}>
                <MyMessage>{message.body}</MyMessage>
              </MyRow>
            );
          }
          return (
            <PartnerRow key={index}>
              <PartnerMessage>{message.body}</PartnerMessage>
            </PartnerRow>
          );
        })}
      </Container>
      <Form onSubmit={sendMessage}>
        <TextArea
          value={message}
          onChange={handleChange}
          placeholder="Mesaj Yaz..."
        />
        <Button>Send</Button>
      </Form>
        </div>
      </Collapse>
     
      
    </Page>
  );
};

export default Chat;
