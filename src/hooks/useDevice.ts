import { useState, useEffect, useCallback } from 'react';
import { useNhostClient } from '@nhost/react';
import { fetchUniqueId } from '../utils/helpers';
import { checkDeviceExists, createDevice, updateDeviceRegistrationMutation, getMonitorByRegistrationCode, getPlaylistById } from '../utils/graphql-funcs';

const useDevice = (registration_code, monitor_id) => {
    const nhostClient = useNhostClient();
    const [deviceId, setDeviceId] = useState('');
    const [is_registered, setIs_registered] = useState(false);
    const [monitor, setMonitor] = useState(null);
    const [playlist, setPlaylist] = useState<any>([]);
    const [media, setMedia] = useState(null);

    const fetchUniqueIdCallback = useCallback(async () => {
        const id = await fetchUniqueId();
        setDeviceId(id);
    }, []);

    useEffect(() => {
        fetchUniqueIdCallback();
    }, [fetchUniqueIdCallback]);

    const checkAndCreateDevice = async () => {
        try {
            const { data } = await nhostClient.graphql.request(checkDeviceExists, { deviceId });

            if (data.devices.length === 0) {
                const response = await nhostClient.graphql.request(createDevice, {
                    deviceId,
                    registration_code,
                    is_registered,
                    monitor_id
                });
                if (response.data) {
                    await fetchMonitorByUpdatingIsRegister();
                } else {
                    console.error('Failed to create device:', response.error);
                }
            } else {
                await fetchMonitorByUpdatingIsRegister();
            }
        } catch (error) {
            console.error(error);
        }
    };

 
    async function fetchMonitorByUpdatingIsRegister() {
                try {
                    const response = await nhostClient.graphql.request(getMonitorByRegistrationCode, {
                        registration_code
                    });
        
                    console.log(response, 'Monitor response:');
        
                    if (response && response.data.monitor.length > 0) {
                        const monitor = response.data.monitor[0];
                        console.log('Monitor fetched:', monitor);
        
                     // Set monitor in media
        
                        const updateDeviceResponse = await nhostClient.graphql.request(updateDeviceRegistrationMutation, {
                            registration_code,
                            is_registered: true
                        });
        
                        if (updateDeviceResponse.data.update_devices.affected_rows > 0) {
                            console.log('Device registration updated successfully');
                            fetchPlaylist(monitor.schedule?.playlist_id);
                            setIs_registered(true)
                            setMedia(monitor);
                        } else {
                            console.error('Failed to update device registration');
                        }
                    } else {
                        console.log('No monitor found with the provided registration code.');
                    }
                } catch (error) {
                    console.error('Error fetching monitor and updating device registration:', error);
                }
            }

            async function fetchPlaylist(id: any) {
                if (id) {
                    try {
                        const { data, error } = await nhostClient.graphql.request(getPlaylistById, { id });
                        if (error) {
                            console.error(error);
                            return;
                        }
                        console.log('Playlist fetched:', data.playlist[0]);
                        setPlaylist(data.playlist[0]);
                    } catch (error) {
                        return error
                    }
                } else {
                    console.log('No valid playlist ID found in media');
                }
            }
        
        
            useEffect(() => {
                if (deviceId) {
                    checkAndCreateDevice();
                }
                if (media) {
                    console.log('Media and registration detected. Fetching playlist...');
                    console.log(media);
                    
                    fetchPlaylist(media[0]?.schedule?.playlist_id);
                }
            }, [deviceId,nhostClient]);
        
    return { deviceId, is_registered, monitor, fetchMonitorByUpdatingIsRegister, playlist,media };
};

export default useDevice;
