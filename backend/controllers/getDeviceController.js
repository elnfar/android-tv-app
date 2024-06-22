// getDeviceController.js

import fetch from 'node-fetch';
import pkg from '@apollo/client';
const { gql, ApolloClient, InMemoryCache, HttpLink } = pkg;

// Nhost configuration
const subdomain = 'jhugfkkoqofbgmfeshkg';
const region = 'eu-central-1';
const graphqlUrl = `https://${subdomain}.graphql.${region}.nhost.run/v1`;

// Initialize Apollo Client
const client = new ApolloClient({
    //@ts-ignore
  link: new HttpLink({ uri: graphqlUrl, fetch }),
  cache: new InMemoryCache()
});

// Define GraphQL query
const GET_DEVICE_BY_ID_QUERY = gql`
  query GetDeviceById($deviceId: String!) {
    devices(where: { deviceId: { _eq: $deviceId } }) {
      id
      deviceId
      registration_code
      is_registered
      monitor_id
    }
  }
`;

export const getDeviceController = async (req, res) => {
  const { deviceId } = req.params;

  try {
    const { data } = await client.query({
      query: GET_DEVICE_BY_ID_QUERY,
      variables: { deviceId }
    });

    if (data.devices.length > 0) {
      res.status(200).json(data.devices[0]);
    } else {
      res.status(404).json({ error: 'Device not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching the device' });
  }
};
