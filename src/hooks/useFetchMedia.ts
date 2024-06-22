import { useNhostClient } from "@nhost/react";
import { useEffect, useState } from "react";



const getMedia = `
    query {
      media {
        id
        title
        src
        file_id
        type
        createdAt
      }
    }
  `



export function useMediaFetch() {
    const [media,setMedia] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const nhostClient = useNhostClient();
  
    useEffect(() => {
      async function fetchMedia() {
        try {
          const { data } = await nhostClient.graphql.request(getMedia);
          setMedia(data.media);
        } catch (error:any) {
          setError(error);
          return error
        }
      }

    

      fetchMedia()

    }, [nhostClient]);
  
    
  
    return { media, loading, error };
  }