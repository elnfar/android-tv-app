import React, { useEffect } from 'react';
import { useSubscription } from '@apollo/client';
import { MONITOR_SUBSCRIPTION } from '../utils/graphql-funcs';

const MonitorSubscription = ({ registration_code, fetchMonitorByUpdatingIsRegister }) => {
    const { data, error } = useSubscription(MONITOR_SUBSCRIPTION);

    useEffect(() => {
        if (data && data.monitor) {
            const newMonitor = data.monitor[0]; // Assuming `data.monitor` is an array
            console.log('Subscription data received:', data);

            // Check if the registration code matches
            if (newMonitor.registration_code === registration_code) {
                fetchMonitorByUpdatingIsRegister();
            }
        }
        if (error) {
            console.error('Subscription error:', error.message, error);
        }
    }, [data, error, fetchMonitorByUpdatingIsRegister, registration_code]);

    return null; // MonitorSubscription doesn't render anything directly
};

export default MonitorSubscription;
