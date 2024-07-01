import { useNhostClient } from "@nhost/react";




export const getPublicUrl = (fileId) => {
  const nhostClient = useNhostClient();
 nhostClient.storage.getPublicUrl({ fileId });

}
