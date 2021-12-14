import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";
import Chat from "./Chat";


const Container = styled.div`
  display: grid;
  grid-template-columns:300px 300px 300px ;
  grid-template-row:300px 300px;
  height: 90vh;
  width:100%;
  margin: auto;
  flex-wrap: wrap;
  
`;

const StyledVideo = styled.video`
  height: 50%;
  width: 90%;
  border:3px solid black;
  border-radius:10px;
  float: left;
  margin:20px;
  
`;




const Video = (props) => {
  const ref = useRef();

  useEffect(() => {
    props.peer.on("stream", (stream) => {
      ref.current.srcObject = stream;
    });
  }, []);

  return <StyledVideo playsInline autoPlay ref={ref} />;
};

const videoConstraints = {
  height: window.innerHeight / 1,
  width: window.innerWidth / 2,
};


const Room = (props) => {
  const [peers, setPeers] = useState([]);
  const socketRef = useRef();
  const userVideo = useRef();
  const peersRef = useRef([]);
  
  const roomID = props.match.params.roomID;

  useEffect(() => {
    socketRef.current = io.connect("http://localhost:5000/");
    navigator.mediaDevices
      .getUserMedia({ video: videoConstraints, audio: true })
      .then((stream) => {
        userVideo.current.srcObject = stream;
        socketRef.current.emit("join room", roomID);
        socketRef.current.on("all users", (users) => {
          const peers = [];
          users.forEach((userID) => {
            const peer = createPeer(userID, socketRef.current.id, stream);
            peersRef.current.push({
              peerID: userID,
              peer,
            });
            peers.push(peer);
          });
          setPeers(peers);
        });

        socketRef.current.on("user joined", (payload) => {
          const peer = addPeer(payload.signal, payload.callerID, stream);
          peersRef.current.push({
            peerID: payload.callerID,
            peer,
          });

          setPeers((users) => [...users, peer]);
        });

        socketRef.current.on("receiving returned signal", (payload) => {
          const item = peersRef.current.find((p) => p.peerID === payload.id);
          item.peer.signal(payload.signal);
        });
      });

      
  }, []);

  useEffect(()=>{
    socketRef.current.on("room full",()=>{
      alert("This room full");
    })
  })

  function createPeer(userToSignal, callerID, stream) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("sending signal", {
        userToSignal,
        callerID,
        signal,
      });
    });

    return peer;
  }

  function addPeer(incomingSignal, callerID, stream) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("returning signal", { signal, callerID });
    });

    peer.signal(incomingSignal);

    return peer;
  }

  return (
    
    <Container  >
      <Container style={{width:"1100px"}}  > <StyledVideo muted ref={userVideo} autoPlay playsInline />
      {peers.map((peer, index) => {
        return <Video key={index} peer={peer} />;
      })}</Container>
     
      <Chat roomID={roomID}/>
      
    </Container>
  );
};



export default Room;
