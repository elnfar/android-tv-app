import React, { useRef, useEffect, useState } from 'react';
import { View, Image, Text, ViewStyle, Dimensions } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import ViewShot from 'react-native-view-shot';
import { getPublicUrl, isImage, isVideo } from '../utils/helpers';

const { height, width } = Dimensions.get('screen');

const MediaDisplay = ({ nhostClient, currentMedia, moveToNextMedia }) => {
    const videoRef = useRef(null);
    const viewRef = useRef();

    const mediaStyle: ViewStyle = {
        alignSelf: 'center',
        width,
        height,
    };

    const handlePlaybackStatusUpdate = async (status) => {
        if (status.didJustFinish && !status.isLooping) {
            moveToNextMedia();
        }
    };

    useEffect(() => {
        let timer;

        const handleNextMedia = () => {
            moveToNextMedia();
            const nextMedia = currentMedia.next;
            const duration = Number(nextMedia.duration) * 1000; // convert to milliseconds
            timer = setTimeout(handleNextMedia, duration);
        };

        if (isImage(currentMedia.type)) {
            const duration = Number(currentMedia.duration) * 1000; // convert to milliseconds
            timer = setTimeout(handleNextMedia, duration);
        }

        return () => clearTimeout(timer);
    }, [currentMedia, moveToNextMedia]);

    if (!currentMedia) {
        return <View><Text>Loading</Text></View>;
    }

    return (
        <ViewShot ref={viewRef} options={{ format: "jpg", quality: 0.9 }}>
            <View>
                {isVideo(currentMedia.type) ? (
                    <Video
                        ref={videoRef}
                        style={mediaStyle}
                        source={{ uri: getPublicUrl(nhostClient, currentMedia.url) }}
                        useNativeControls
                        resizeMode={ResizeMode.STRETCH}
                        isLooping={false}
                        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
                        onLoadStart={() => videoRef.current?.playAsync()} 
                    />
                ) : (
                    <Image
                        source={{ uri: getPublicUrl(nhostClient, currentMedia.url) }}
                        style={mediaStyle}
                    />
                )}
            </View>
        </ViewShot>
    );
};

export default MediaDisplay;
