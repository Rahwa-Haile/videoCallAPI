import React, { useEffect, useRef, useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";



const VideoPlayer = ({ user, localTracks, client }) => {
  const [isAudioMute, setIsAudioMute] = useState(false);
  const [isVideoMute, setIsVideoMute] = useState(false);

  const ref = useRef();

  const [audioTrack, videoTrack] = localTracks;

  let isLocalTrack =
    user.audioTrack === audioTrack && user.videoTrack === videoTrack;


  

  const toggleAudio = async (user) => {
    try {
      if (isLocalTrack) {
        console.log("toggle audio called");
        console.log(isLocalTrack);
        console.log("Is audio muted" + isAudioMute);

        await user.audioTrack.setMuted(!isAudioMute);
        setIsAudioMute(!isAudioMute);
      } else {
        console.log("this audio is not yours to mute");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const toggleVideo = async (user) => {
    try {
      if (isLocalTrack) {
        console.log(isLocalTrack);
        console.log("toggle video called");
        console.log("Is video muted:" + isVideoMute);
        await user.videoTrack.setMuted(!isVideoMute);
        setIsVideoMute(!isVideoMute);
      } else {
        console.log("this video is not yours to mute");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
  
    user.videoTrack.play(ref.current);
    
    if (!isLocalTrack) {
      user.audioTrack.play();
    }
  });

  return (
    <>
      <div>
        <button onClick={() => toggleAudio(user)}>
          {isAudioMute ? "Unmute audio" : "Mute audio"}
        </button>
        <button onClick={() => toggleVideo(user)}>
          {isVideoMute ? "Unmute video" : "Mute video"}
        </button>
       
      </div>
      <h1>Uid: {user.uid}</h1>
      <div
        ref={ref}
        key={user.uid}
        style={{ height: "300px", width: "400px" }}
      ></div>
    </>
  );
};

export default VideoPlayer;
