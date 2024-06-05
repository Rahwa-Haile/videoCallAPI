import React, { useState, useEffect } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import VideoPlayer from "./videoplayer";

const VideoRoom = () => {
  const [users, setUsers] = useState([]);
  const [localTracks, setLocalTracks] = useState([]);
 

  const appID = "e2b4c0dc519640b28b1ef0464ce5df01";
  const token =
    "007eJxTYJBi8Lt64XWP8a36yi3/k2zsuhuW8NZczN1wnXH/BOvDhUsUGFKNkkySDVKSTQ0tzUwMkowskgxT0wxMzEySU01T0gwM7azi0xoCGRm236tlYWSAQBCfgyEnNbEoLzMvnYEBABOTIew=";
  const channel = "learning";

  const client = AgoraRTC.createClient({
    mode: "rtc",
    codec: "vp8",
  });

  

  


  const handleUserJoined = async (user, mediaType) => {
    await client.subscribe(user, mediaType);

    if (mediaType === "video") {
      setUsers((previousUsers) => {
        previousUsers = previousUsers.filter(
          (prevUser) => prevUser.uid !== user.uid
        );
        return [...previousUsers, user];
      });
    }
  };

  const handleUserLeft = (user) => {
    user.videoTrack.stop();
    user.videoTrack.close();
    user.audioTrack.stop();
    user.audioTrack.close();
    setUsers((previousUsers) =>
      previousUsers.filter((u) => {
        return u.uid !== user.uid;
      })
    );
  };

  useEffect(() => {
    client.on("user-published", handleUserJoined);
    client.on("user-left", handleUserLeft);
    client
      .join(appID, channel, token, null)
      .then((uid) => {
        return Promise.all([
          AgoraRTC.createMicrophoneAndCameraTracks(),
          uid
        ]);
      })
      .then(([tracks, uid]) => {
        const [audioTrack, videoTrack] = tracks;
       
        setLocalTracks(tracks);
        setUsers((previousUsers) => [
          ...previousUsers,
          {
            uid,
            videoTrack,
            audioTrack,
         
          },
        ]);
        client.publish(tracks);
      });

    //clean up function

    return () => {
      for (let localTrack of localTracks) {
        localTrack.stop(); // this effectively stops camera and microphone
        localTrack.close(); // this releaseas media resources allowing other apps to access your camera and microphone
      }
      client.off("user-published", handleUserJoined); // removes event listeners as to prevent memory leaks
      client.off("user-left", handleUserLeft);
      client.unpublish(localTracks).then(() => {
        //unpublishing removes your local tracks from other participants in the call
        client.leave(); // leaves the channel
      });
    };
  }, []);
  return (
    <>
      <div>
        <section>NumberOfUsers: {users.length}</section>
        <div>
          {users.map((user) => {
            return (
              <VideoPlayer
                key={user.uid}
                user={user}
                localTracks={localTracks}
                client={client}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};

export default VideoRoom;
