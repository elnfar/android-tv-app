import { gql, useSubscription } from "@apollo/client";
import { useNhostClient } from "@nhost/react";
import { AVPlaybackStatus, ResizeMode, Video } from "expo-av";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { Dimensions, View, ViewStyle, Image, Text } from "react-native";
import DeviceInfo from "react-native-device-info";
import ViewShot, { captureRef } from "react-native-view-shot";
import useDevice from "../hooks/useDevice";
import { MONITOR_SUBSCRIPTION } from "../utils/graphql-funcs";

// Nhost configuration


export default function Home() {
    // const [media, setMedia] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const nhostClient = useNhostClient();
    // const [playlist, setPlaylist] = useState<any>([]);
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
    const videoRef = useRef(null);
    // const [deviceId, setDeviceId] = useState('');
    const [registration_code, setRegistration_code] = useState('ACV-123-DDE');

    const [monitor_id, setMonitor_id] = useState('9d7ade03-451f-49ee-a342-5fa033f6857c');
    const { data, error: gError } = useSubscription(MONITOR_SUBSCRIPTION);

    const { deviceId, is_registered, monitor, playlist, media, fetchMonitorByUpdatingIsRegister } = useDevice(registration_code, monitor_id); // Initialize useDevice hook with initial values


    const viewRef = useRef();  // Create a ref to the view

    // Function to take snapshot


    const reg_ex = data && data.monitor[0].registration_code
    console.log(data, "DATA");
    
    useEffect(() => {
        if (data && data.monitor) {
            console.log(data, 'sub received');
            

            const newMonitor = data.monitor[0];  // Assuming `data.monitor` is an array
            console.log(newMonitor, 'nmlnkdalndaslndalksndklasndlkas');
            

            // Check if the registration code matches
            if (newMonitor.registration_code == "") {
                // Stop media playback or reset media state
                // For example, set media state to null or some default value
                return;
            }

            if (newMonitor.registration_code === registration_code) {
                // Stop media playback or reset media state
                // For example, set media state to null or some default value
             fetchMonitorByUpdatingIsRegister();
            }
            
            // If registration code matches, fetch or update as needed
            
        }

        if(!data) return

        if (gError) {
            console.error('Subscription error:', gError.message, gError);
        }
    }, [gError, reg_ex,]);

  
    const getPublicUrl = (fileId: string) => {
        return nhostClient.storage.getPublicUrl({ fileId });
    };

    const { height, width } = Dimensions.get('screen');

    const mediaStyle: ViewStyle = {
        alignSelf: 'center',
        width,
        height,
    };

    const isImage = (type: string) => {
        return type.startsWith('image/');
    };

    const isVideo = (type: string) => {
        return type.startsWith('video/');
    };

    const handlePlaybackStatusUpdate = async (status: AVPlaybackStatus) => {
        //@ts-ignore
        if (status.didJustFinish && !status.isLooping) {
            moveToNextMedia();
        }
    };

    const moveToNextMedia = () => {
        const nextIndex = (currentMediaIndex + 1) % playlist.media_ids.length;
        setCurrentMediaIndex(nextIndex);
    };

    useEffect(() => {
        let timer: NodeJS.Timeout;

        const handleNextMedia = () => {
            moveToNextMedia();
            const nextMedia = playlist.media_ids[(currentMediaIndex + 1) % playlist.media_ids.length];
            const duration = Number(nextMedia.duration) * 1000; // convert to milliseconds
            timer = setTimeout(handleNextMedia, duration);
        };

        if (playlist.media_ids && playlist.media_ids[currentMediaIndex]) {
            const currentMedia = playlist.media_ids[currentMediaIndex];
            if (isImage(currentMedia.type)) {
                const duration = Number(currentMedia.duration) * 1000; // convert to milliseconds
                timer = setTimeout(handleNextMedia, duration);
            }
        }

        return () => clearTimeout(timer);
    }, [currentMediaIndex, playlist.media_ids]);

    if (error) {
        return <View><Text>Error: {error.message}</Text></View>;
    }

   const currentMedia = playlist.media_ids ? playlist.media_ids[currentMediaIndex] : null;

    if (!currentMedia) {
        return (
            <View>
                <Text>deviceId: {deviceId}</Text>
            </View>
        );
    }


    
    return (
        <ViewShot ref={viewRef} options={{ format: "jpg", quality: 0.9 }}>
        <View>
            {currentMedia ? (
                isVideo(currentMedia.type) ? (
                    <Video
                        ref={videoRef}
                        style={mediaStyle}
                        source={{
                            uri: getPublicUrl(currentMedia.url),
                        }}
                        useNativeControls
                        resizeMode={ResizeMode.STRETCH}
                        isLooping={false}
                        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
                        onLoadStart={() => videoRef.current?.playAsync()} 
                    />
                ) : (
                    <Image
                        source={{ uri: getPublicUrl(currentMedia.url) }}
                        style={mediaStyle}
                    />
                )
            ) : (
                <View><Text> Loading</Text></View>
                // <ActivityIndicator size="large" color="#0000ff" />
            )}
        </View>
        </ViewShot>
    );
}














// import { gql, useSubscription } from "@apollo/client";
// import { useNhostClient } from "@nhost/react";
// import { AVPlaybackStatus, ResizeMode, Video } from "expo-av";
// import React, { useCallback, useEffect, useState, useRef } from "react";
// import { Dimensions, View, ViewStyle, Image, Text } from "react-native";
// import DeviceInfo from "react-native-device-info";
// import ViewShot, { captureRef } from "react-native-view-shot";

// // Nhost configuration
// const getPlaylistById = `
// query getPlaylistById($id: uuid!) {
//     playlist(where: {id: {_eq: $id}}) {
//         id  
//         title
//         media_ids
//     }
// }
// `;

// const getMonitorByRegistrationCode = `
// query getMonitorByRegistrationCode($registration_code: String!) {
//     monitor(where: {registration_code: {_eq: $registration_code}}) {
//         id
//         title
//         registration_code
//         schedule {
//             title
//             playlist_id
//         }
//     }
// }
// `;

// const checkDeviceExists = `
// query checkDeviceExists($deviceId: String!) {
//     devices(where: {deviceId: {_eq: $deviceId}}) {
//     id
//     deviceId
//     is_registered
//     registration_code
//     monitor_id
//     }
// }
// `;

// const createDevice = `
// mutation($deviceId: String!, $registration_code:String,$is_registered:Boolean, $monitor_id:uuid) {
// insert_devices_one(object: {deviceId: $deviceId, registration_code: $registration_code,is_registered: $is_registered, monitor_id: $monitor_id}) {
//     id
// }
// }
// `;

// const updateDeviceRegistrationMutation = `
// mutation updateDeviceRegistration($registration_code: String!, $is_registered: Boolean!) {
//     update_devices(where: {registration_code: {_eq: $registration_code}}, _set: {is_registered: $is_registered}) {
//     affected_rows
//     }
// }
// `;

// const MONITOR_SUBSCRIPTION = gql`
//   subscription GetMonitorStreamingSubscription {
//     monitor {
//       registration_code
//     }
//   }
// `;

// export default function Home() {
//     const [media, setMedia] = useState(null);
//     const [error, setError] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const nhostClient = useNhostClient();
//     const [playlist, setPlaylist] = useState<any>([]);
//     const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
//     const videoRef = useRef(null);
//     const [deviceId, setDeviceId] = useState('');
//     const [registration_code, setRegistration_code] = useState('ACV-123-DDE');
//     const [is_registered, setIs_registered] = useState(false);
//     const [monitor_id, setMonitor_id] = useState('9d7ade03-451f-49ee-a342-5fa033f6857c');
//     const { data, error: gError } = useSubscription(MONITOR_SUBSCRIPTION);
//     const [monitor, setMonitor] = useState();


//     const viewRef = useRef();  // Create a ref to the view

//     // Function to take snapshot
//     useEffect(() => {
//         if (data && data.monitor) {
//             console.log('Subscription data received:', data);
//             const newMonitor = data.monitor[0];  // Assuming `data.monitor` is an array
//             setMonitor(newMonitor);

//             // Check if the registration code matches
//             if (newMonitor.registration_code === registration_code) {
//                 fetchMonitorByUpdatingIsRegister();
//             }
//         }
//         if (gError) {
//             console.error('Subscription error:', gError.message, gError);
//         }
//     }, [data, gError]);

//     // const fetchUniqueId = useCallback(async () => {
//     //     const id = await DeviceInfo.getUniqueId();
//     //     setDeviceId(id);
//     // }, []);

//     // useEffect(() => {
//     //     fetchUniqueId();
//     // }, [fetchUniqueId]);


//     // useEffect(() => {
//     //     async function checkAndCreateDevice() {
//     //         try {
//     //             const { data } = await nhostClient.graphql.request(checkDeviceExists, { deviceId });
//     //             if (data.devices.length === 0) {
//     //                 const response = await nhostClient.graphql.request(createDevice, {
//     //                     deviceId,
//     //                     registration_code,
//     //                     is_registered,
//     //                     monitor_id
//     //                 });
//     //                 if (response.data) {
//     //                     console.log('Device created:', response.data);
//     //                     await fetchMonitorByUpdatingIsRegister();
//     //                 } else {
//     //                     console.error('Failed to create device:', response.error);
//     //                 }
//     //             } else {
//     //                 console.log('Device already exists:', data.devices[0]);
//     //                 await fetchMonitorByUpdatingIsRegister();
//     //             }
//     //         } catch (error) {
//     //             console.error('Error checking or creating device:', error);
//     //         }
//     //     }

//     //     if (deviceId) {
//     //         checkAndCreateDevice();
//     //     }

//     // }, [deviceId, nhostClient]);


//     useEffect(() => {
//         if (media) {
//             console.log('Media and registration detected. Fetching playlist...');
//             console.log(media);
            
//             fetchPlaylist(media[0]?.schedule?.playlist_id);
//         }
//     }, [is_registered, data, nhostClient, media]);



//     async function fetchMonitorByUpdatingIsRegister() {
//         try {
//             const response = await nhostClient.graphql.request(getMonitorByRegistrationCode, {
//                 registration_code
//             });

//             console.log(response, 'Monitor response:');

//             if (response && response.data.monitor.length > 0) {
//                 const monitor = response.data.monitor[0];
//                 console.log('Monitor fetched:', monitor);

//              // Set monitor in media

//                 const updateDeviceResponse = await nhostClient.graphql.request(updateDeviceRegistrationMutation, {
//                     registration_code,
//                     is_registered: true
//                 });

//                 if (updateDeviceResponse.data.update_devices.affected_rows > 0) {
//                     console.log('Device registration updated successfully');
//                     fetchPlaylist(monitor.schedule?.playlist_id);
//                     setIs_registered(true)
//                     setMedia(monitor);
//                 } else {
//                     console.error('Failed to update device registration');
//                 }
//             } else {
//                 console.log('No monitor found with the provided registration code.');
//             }
//         } catch (error) {
//             console.error('Error fetching monitor and updating device registration:', error);
//         }
//     }

 
//     async function fetchPlaylist(id: any) {
//         if (id) {
//             try {
//                 const { data, error } = await nhostClient.graphql.request(getPlaylistById, { id });
//                 if (error) {
//                     console.error(error);
//                     return;
//                 }
//                 console.log('Playlist fetched:', data.playlist[0]);
//                 setPlaylist(data.playlist[0]);

//             } catch (error) {
//                 setError(error);
//             }
//         } else {
//             console.log('No valid playlist ID found in media');
//         }
//     }

//     const getPublicUrl = (fileId: string) => {
//         return nhostClient.storage.getPublicUrl({ fileId });
//     };

//     const { height, width } = Dimensions.get('screen');

//     const mediaStyle: ViewStyle = {
//         alignSelf: 'center',
//         width,
//         height,
//     };

//     const isImage = (type: string) => {
//         return type.startsWith('image/');
//     };

//     const isVideo = (type: string) => {
//         return type.startsWith('video/');
//     };

//     const handlePlaybackStatusUpdate = async (status: AVPlaybackStatus) => {
//         //@ts-ignore
//         if (status.didJustFinish && !status.isLooping) {
//             moveToNextMedia();
//         }
//     };

//     const moveToNextMedia = () => {
//         const nextIndex = (currentMediaIndex + 1) % playlist.media_ids.length;
//         setCurrentMediaIndex(nextIndex);
//     };

//     useEffect(() => {
//         let timer: NodeJS.Timeout;

//         const handleNextMedia = () => {
//             moveToNextMedia();
//             const nextMedia = playlist.media_ids[(currentMediaIndex + 1) % playlist.media_ids.length];
//             const duration = Number(nextMedia.duration) * 1000; // convert to milliseconds
//             timer = setTimeout(handleNextMedia, duration);
//         };

//         if (playlist.media_ids && playlist.media_ids[currentMediaIndex]) {
//             const currentMedia = playlist.media_ids[currentMediaIndex];
//             if (isImage(currentMedia.type)) {
//                 const duration = Number(currentMedia.duration) * 1000; // convert to milliseconds
//                 timer = setTimeout(handleNextMedia, duration);
//             }
//         }

//         return () => clearTimeout(timer);
//     }, [currentMediaIndex, playlist.media_ids]);

//     if (error) {
//         return <View><Text>Error: {error.message}</Text></View>;
//     }

// const currentMedia = playlist.media_ids ? playlist.media_ids[currentMediaIndex] : null;

//     if (!currentMedia) {
//         return (
//             <View>
//                 <Text>deviceId: {deviceId}</Text>
//             </View>
//         );
//     }


    
//     return (
//         <ViewShot ref={viewRef} options={{ format: "jpg", quality: 0.9 }}>
//         <View>
//             {currentMedia ? (
//                 isVideo(currentMedia.type) ? (
//                     <Video
//                         ref={videoRef}
//                         style={mediaStyle}
//                         source={{
//                             uri: getPublicUrl(currentMedia.url),
//                         }}
//                         useNativeControls
//                         resizeMode={ResizeMode.STRETCH}
//                         isLooping={false}
//                         onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
//                         onLoadStart={() => videoRef.current?.playAsync()} 
//                     />
//                 ) : (
//                     <Image
//                         source={{ uri: getPublicUrl(currentMedia.url) }}
//                         style={mediaStyle}
//                     />
//                 )
//             ) : (
//                 <View><Text> Loading</Text></View>
//                 // <ActivityIndicator size="large" color="#0000ff" />
//             )}
//         </View>
//         </ViewShot>
//     );
// }
