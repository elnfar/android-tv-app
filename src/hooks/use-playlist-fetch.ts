import { useQuery, useSubscription } from "@apollo/client";
import { GET_MEDIA_FROM_DEVICE } from "../utils/graphql-funcs";


// export const GET_MEDIA_FROM_DEVICE = gql`
// query FetchMediaIds($deviceId: String!) {
//   devices(where: { deviceId: { _eq: $deviceId }, is_registered: { _eq: true } }) {
//     monitor {
//       schedule {
//         playlist {
//           media_ids
//         }
//       }
//     }
//   }
// }`


const useFetchMediaIds = (deviceId) => {
  const { loading, error, data } = useSubscription(GET_MEDIA_FROM_DEVICE, {
    variables: { deviceId },
  });


  const mediaIds = data?.devices?.[0]?.monitor?.schedule?.playlist?.media_ids || [];

  return { mediaIds, loading, error };
};

export default useFetchMediaIds;



// import { useEffect, useState } from 'react';
// import { useQuery } from '@apollo/client';


// import { gql } from '@apollo/client';

// export const FETCH_PLAYLIST_MEDIA_IDS = gql`
//   query FetchPlaylistMediaIds($monitorId: uuid!) {
//     monitor_by_pk(id: $monitorId) {
//       id
//       registration_code
//       schedule {
//         id
//         playlist {
//           id
//           media_ids
//         }
//       }
//     }
//   }
// `;


// const useFetchPlaylistMediaIds = (monitorId) => {
//   const [mediaIds, setMediaIds] = useState([]);
//   const { loading, error, data } = useQuery(FETCH_PLAYLIST_MEDIA_IDS, {
//     variables: { monitorId },
//   });

   
  

//   useEffect(() => {
//     if (!loading && !error && data && data.monitor_by_pk) {
//       console.log(data);
              
//       setMediaIds(data.monitor_by_pk.schedule.playlist.media_ids);
//     }
//   }, [loading, error, data, monitorId]);

//   return { mediaIds, loading, error };
// };

// export default useFetchPlaylistMediaIds;
