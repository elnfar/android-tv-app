'use client';

import { useEffect, useState } from 'react';
import { useNhostClient } from '@nhost/react';

const getPlaylistById = `
query getPlaylistById($id: uuid!) {
    playlist(where: {id: {_eq: $id}}) {
        id  
        title
        createdAt
        updatedAt
        media_ids
        description
    }
}
`;

const useFetchPlaylistById = (id: string) => {
  const nhostClient = useNhostClient();
  const [playlist, setPlaylist] = useState<any>([]);

  
  useEffect(() => {

    async function fetchPlaylist() {
      try {
        const { data, error } = await nhostClient.graphql.request(getPlaylistById, {
          id: id
        });

        if (error) {
          console.error(error);
          return;
        }
        
        console.log(data.playlist[0]);
        setPlaylist(data.playlist[0]);
        
        
      } catch (error) {
            return error
      }
    }

    fetchPlaylist();

  }, [id]);

  console.log(playlist);
  
  return {
    playlist
}

};

export default useFetchPlaylistById;
