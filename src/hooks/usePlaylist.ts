import { useState, useEffect } from 'react';
import { useNhostClient } from '@nhost/react';
import { getPlaylistById } from '../utils/graphql-funcs';

const usePlaylist = (playlist_id) => {
    const nhostClient = useNhostClient();
    const [playlist, setPlaylist] = useState(null);

    useEffect(() => {
        const fetchPlaylist = async (id) => {
            if (id) {
                try {
                    const { data, error } = await nhostClient.graphql.request(getPlaylistById, { id });
                    if (error) {
                        console.error(error);
                        return;
                    }
                    setPlaylist(data.playlist[0]);
                } catch (error) {
                    console.error(error);
                }
            } else {
                console.log('No valid playlist ID found in media');
            }
        };

        fetchPlaylist(playlist_id);
    }, [playlist_id, nhostClient]);

    return playlist;
};

export default usePlaylist;
