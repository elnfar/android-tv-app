import { useNhostClient } from "@nhost/react";
import { AVPlaybackStatus, ResizeMode, Video } from "expo-av";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Dimensions, View, ViewStyle, ActivityIndicator, Image, Text } from "react-native";
import DeviceInfo from "react-native-device-info";
import { DeviceContext } from "../providers/Idprovider";

const getPlaylistById = `
query getPlaylistById($id: uuid!) {
    playlist(where: {id: {_eq: $id}}) {
        id  
        title
        media_ids
    }
}
`;

const getMonitor = `
  query {
    monitor {
      id
      schedule {
        title
        playlist_id
      }
    }
  }
`;

const checkDeviceExists = `
  query checkDeviceExists($deviceId: String!) {
    devices(where: {deviceId: {_eq: $deviceId}}) {
      deviceId
      registration_code
    }
  }
`;



export const createDevice = `
mutation($deviceId: String!, $registration_code:String,$is_registered:Boolean, $monitor_id:uuid) {
  insert_devices_one(object: {deviceId: $deviceId, registration_code: $registration_code,is_registered: $is_registered, monitor_id: $monitor_id}) {
    id
  }
}
`

const getMonitorById = `
  query getMonitorById($deviceId: String!) {
    monitor(where: {deviceId: {_eq: $deviceId}}) {
      id
      title
      deviceId
      schedule {
        title
        playlist_id
      }
    }
  }
`;
const getMonitorByRegistrationCode = `
query getMonitorByRegistrationCode($registration_code: String!) {
    monitor(where: {registration_code: {_eq: $registration_code}}) {
        id
        title
        registration_code
        schedule {
            title
            playlist_id
        }
    }
}
`;

const updateMonitorsDeviceId = `
mutation updateMonitorDeviceId($monitor_id: uuid!, $deviceId: String!) {
    update_monitor(where: {registration_code: {_eq: $registration_code}}, _set: {deviceId: $deviceId}) {
        id
    }
}
`;

export const updateDeviceRegistration = `
mutation updateDeviceRegistration($registration_code: String!, $is_registered: Boolean!) {
  update_devices(where: {registration_code: {_eq: $registration_code}}, _set: {is_registered: $is_registered}) {
    affected_rows
  }
}
`;

type Status = Partial<AVPlaybackStatus> & {
    isPlaying?: boolean;
    uri?: string;
    rate?: number;
    positionMillis?: number;
    playableDurationMillis?: number;
};

export default function AnotherHome() {
    const [media, setMedia] = React.useState([]);
    const [error, setError] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const nhostClient = useNhostClient();
    const [playlist, setPlaylist] = React.useState<any>([]);
    const [currentMediaIndex, setCurrentMediaIndex] = React.useState(0);
    const [mon,setMon] = useState<any>()
    const videoRef = React.useRef(null);





  const [registration_code, setRegistration_code] = React.useState('ACV-123-DDE')
  const [is_registered, setIs_registered] = React.useState(false)
  const [monitor_id, setMonitor_id] = React.useState('9d7ade03-451f-49ee-a342-5fa033f6857c')
  const [devices,setDevices] = useState([])
const [deviceId, setDeviceId] = useState('304e5336571ca3b5')

  




    useEffect(() => {
        async function handleCheck() {
            try {
                const {data} = await nhostClient.graphql.request(checkDeviceExists, { deviceId: deviceId });
                
                if(data) {
                    setDevices(data.devices)
                    console.log(data);
                    
                }

                console.log(data,'data');
                
                
            } catch (error) {
                console.error('Error checking or creating device:', error);
            }}


            handleCheck()
    },[nhostClient, deviceId, registration_code])
    


console.log(devices,'Devices from another home');


    return (
        <View>
           <Text>ANother one</Text>
        </View>
    );
}
