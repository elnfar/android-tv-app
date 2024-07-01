import { gql, useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { getUniqueId } from "react-native-device-info";
import { CHECK_DEVICE_QUERY, CREATE_DEVICE_MUTATION } from "../utils/graphql-funcs";

export const useCreateDevice = () =>  {

    const [deviceCreated, setDeviceCreated] = useState(false);  
    const [monitorId, setMonitorId] = useState('');
    const deviceId = 'newid1zxyaax'

    const {data, loading} = useQuery(CHECK_DEVICE_QUERY, {
        variables:{deviceId}
    });
    const [createDevice] = useMutation(CREATE_DEVICE_MUTATION);

    useEffect(() => {
        if (!loading &&  data.devices.length === 0) {
            async function initializeDevice() {
              try {
                await createDevice({
                  variables: {
                    deviceId,
                    is_registered: false,
                  },
                });
                setDeviceCreated(true);
                console.log('Device created successfully');
            }catch (error) {
            console.log(error);
        }
      }
      initializeDevice();
    } else if(!loading && data && data.devices.length > 0) {
      setMonitorId(data.devices[0].monitor_id);
    }
    }, [loading, data]);

   return {
        deviceCreated,
        monitorId
   }
}