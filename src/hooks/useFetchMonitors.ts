import { useNhostClient } from "@nhost/react";
import { useEffect, useState } from "react";


 const getMonitors = `
        query {
          monitor {
            id
            title
            sch {
              id
              title
            }
          }
        }
`

export function useFetchMonitors() { 
    const [monitors,setMonitors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const nhostClient = useNhostClient();
  
    useEffect(() => {
      async function fetchMedia() {
        try {
          const { data } = await nhostClient.graphql.request(getMonitors);
          console.log(data);
          
          setMonitors(data.monitor);
          console.log(monitors);
          
        } catch (error:any) {
          setError(error);
          return error
        }
      }

      fetchMedia()
    }, [nhostClient]);  
    
    return { monitors, loading, error };
  }