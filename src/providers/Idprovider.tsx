import { ApolloClient } from '@apollo/client';
import { useNhostClient } from '@nhost/react';
import React, { createContext, useState, useEffect } from 'react';
import DeviceInfo from 'react-native-device-info';

export const DeviceContext = createContext(null);

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

export const DeviceProvider = ({ children }) => {

    const [registration_code, setRegistration_code] = React.useState('ACV-123-DDE')
  const [is_registered, setIs_registered] = React.useState(false)
  const [monitor_id, setMonitor_id] = React.useState('9d7ade03-451f-49ee-a342-5fa033f6857c')
  const [devices,setDevices] = useState([])
const [deviceId, setDeviceId] = useState('304e5336571ca3b5')
const nhostClient = useNhostClient();

    useEffect(() => {
        const fetchDeviceId = async () => {
            const id = await DeviceInfo.getUniqueId();
            setDeviceId(id);
        };

        fetchDeviceId();
    }, []);


    // useEffect(() => {

    //     async function handleCreate() {
    
    //     //having 2 schedule, if user prefers usual schedule ( without week days), submitting usualSchedule which has start/end time, if user swaps to custom we submit customSchedule.

    //     let customSchedules = {
    //       registration_code,
    //       is_registered,
    //       monitor_id,
    //       deviceId:deviceId
    //     };
    
    //       //custom checker
    //       try {
    //         const {data} = await nhostClient.graphql.request(checkDeviceExists, { deviceId: deviceId });
    

    //         if (devices.length === 0) {
                
    //             await nhostClient.graphql.request(createDevice, customSchedules);
    //             console.log(data,'created successfully');

    //         } 
    //     } catch (error) {
    //         console.error('Error checking or creating device:', error);
    //     }}



    //     handleCreate() 
        
    //     },[])
      


    return (
      
        <DeviceContext.Provider value={{
            deviceId,

        }}>
            {children}
        </DeviceContext.Provider>
    );
};
