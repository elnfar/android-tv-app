import { gql } from "@apollo/client";

export const getPlaylistById = `
query getPlaylistById($id: uuid!) {
    playlist(where: {id: {_eq: $id}}) {
        id  
        title
        media_ids
    }
}
`;

export const getMonitorByRegistrationCode = `
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

export const checkDeviceExists = `
    query checkDeviceExists($deviceId: String!) {
        devices(where: {deviceId: {_eq: $deviceId}}) {
            id
            deviceId
            is_registered
            registration_code
            monitor_id
        }
}
`;

export const createDevice = `
    mutation($deviceId: String!, $registration_code:String,$is_registered:Boolean, $monitor_id:uuid) {
        insert_devices_one(object: {deviceId: $deviceId, registration_code: $registration_code,is_registered: $is_registered, monitor_id: $monitor_id}) {
            id
        }
    }
`;

export const updateDeviceRegistrationMutation = `
mutation updateDeviceRegistration($registration_code: String!, $is_registered: Boolean!) {
    update_devices(where: {registration_code: {_eq: $registration_code}}, _set: {is_registered: $is_registered}) {
    affected_rows
    }
}
`;

export const MONITOR_SUBSCRIPTION = gql`
  subscription GetMonitorStreamingSubscription {
    monitor {
      registration_code
    }
  }
`;
