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



// export const MONITOR_SUBSCRIPTION = gql`
//   subscription GetMonitorStreamingSubscription {
//     monitor {
//       registration_code
//     }
//   }
// `;







// export const MONITOR_SUBSCRIPTION = gql`
//   subscription OnMonitorUpdated($monitor_id: uuid!) {
//     monitor(where: { id: { _eq: $monitor_id } }) {
//       id
//       registration_code
//       # Add other fields as necessary
//     }
//   }
// `;



export const MONITOR_SUBSCRIPTION = gql`
  subscription OnMonitorUpdated($registration_code: String!) {
    monitor(where: { registration_code: { _eq: $registration_code } }) {
      id
      schedule {
        playlist_id
      }
      registration_code
    }
  }
`;

export const PLAYLIST_QUERY = gql`
  query getPlaylistById($id: uuid!) {
    playlist(where: {id: {_eq: $id}}) {
        id  
        title
        media_ids
    }
}
`;


export const UPDATE_DEVICE_MUTATION = gql`
  mutation UpdateDeviceRegistration($registration_code: String!, $is_registered: Boolean!) {
    update_devices(where: { registration_code: { _eq: $registration_code } }, _set: { is_registered: $is_registered }) {
      affected_rows
    }
  }
`;


export const CREATE_DEVICE_MUTATION = gql`
  mutation CreateDevice($is_registered: Boolean! ,$deviceId: String!) {
    insert_devices_one(object: { is_registered: $is_registered,deviceId:$deviceId }) {
      id
      registration_code
      deviceId
      monitor_id
      is_registered
    }
  }
`;

export const CHECK_DEVICE_QUERY = gql`
  query CheckDevice($deviceId: String!) {
    devices(where: { deviceId: { _eq: $deviceId } }) {
      id
      registration_code
      monitor_id
    }
  }
`;

export const GET_MEDIA_FROM_DEVICE = gql`
  subscription FetchMediaIds($deviceId: String!) {
  devices(where: { deviceId: { _eq: $deviceId }, is_registered: { _eq: true } }) {
    monitor {
      schedule {
        playlist {
          media_ids
        }
      }
    }
  }
}`
