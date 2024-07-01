import React, { useState } from 'react';
import { useCreateDevice } from '../hooks/use-create-device';
import MediaPlayer from './MediaPlayer';
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";

if (__DEV__) {
  // Adds messages only in a dev environment
  loadDevMessages();
  loadErrorMessages();
}

const Home = () => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const { deviceCreated, monitorId } = useCreateDevice();

  

  // if (!deviceCreated) {
  //   return <Text>Creating device...</Text>;
  // }

  return (
    <MediaPlayer deviceId='newid1zxyaax'/>
  )
};

export default Home;