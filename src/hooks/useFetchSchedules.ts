import { useNhostClient } from "@nhost/react";
import { useEffect, useState } from "react";

 const getSchedules = `
     query {
        schedules {
            id
            title
            playlist_id
            start
            end
            off
        }
}
`

export function useFetchSchedules() {
    const [schedules,setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const nhostClient = useNhostClient();
  
    useEffect(() => {
      async function fetchMedia() {
        try {
          const { data } = await nhostClient.graphql.request(getSchedules);
          setSchedules(data.schedules);
        } catch (error:any) {
          setError(error);
          return error
        }
      }

      fetchMedia()
    }, [nhostClient]);
  

  
    return { schedules, loading, error };
  }