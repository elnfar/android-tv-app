import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { useCreateDevice } from '../hooks/use-create-device';
import useFetchPlaylistMediaIds from '../hooks/use-playlist-fetch';
import { useNhostClient } from '@nhost/react';
import { AVPlaybackStatus, Video } from 'expo-av';
import { Image } from 'react-native';
import { isVideo } from '../utils/helpers';



interface MonitorId {
    monitor_id:string
}

export const MediaPlayer = ({deviceId}) => {
const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
 const { mediaIds, loading, error} =  useFetchPlaylistMediaIds(deviceId);

 console.log(mediaIds, "MIDS");
 

  const getPublicUrl = (fileId) => {
    return nhostClient.storage.getPublicUrl({ fileId });
  };
  


  const { height, width } = Dimensions.get('window');
  const mediaStyle = { width, height };


  const nhostClient = useNhostClient();
  

  useEffect(() => {
    let timer;

    const handleNextMedia = () => {
      setCurrentMediaIndex((prevIndex) => (prevIndex + 1) % mediaIds.length);
    };

    if (mediaIds && mediaIds.length > 0) {
      const currentMedia = mediaIds[currentMediaIndex];
      if (currentMedia) {
        const duration = Number(currentMedia.duration) * 1000;
        timer = setTimeout(handleNextMedia, duration);
      }
    }

    return () => clearTimeout(timer);
  }, [currentMediaIndex, mediaIds]);

  const currentMedia = mediaIds ? mediaIds[currentMediaIndex] : null;

  const handlePlaybackStatusUpdate = async (status: AVPlaybackStatus) => {
    if (status.isLoaded && !status.isLooping) {
      setCurrentMediaIndex((prevIndex) => (prevIndex + 1) % mediaIds.length);
    }
  };

  if (!mediaIds || mediaIds.length === 0) return <Text>No media available</Text>;

  return (
    <View>
    {currentMedia ? (
      isVideo(currentMedia.type) ? (
        <Video
          source={{ uri: getPublicUrl(currentMedia.url) }}
          style={mediaStyle}
          useNativeControls
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
          shouldPlay
        />
      ) : (
        <Image source={{ uri: getPublicUrl(currentMedia.url) }} style={mediaStyle} />
      )
    ) : (
      <Text>Loading media...</Text>
    )}
  </View>
  );
};

export default MediaPlayer;