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

// Define GraphQL queries and mutations
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

const CREATE_DEVICE_MUTATION = gql`
  mutation CreateDevice($deviceId: String!, $registration_code: String!, $is_registered: Boolean!, $monitor_id: uuid!) {
    insert_devices_one(object: {deviceId: $deviceId, registration_code: $registration_code, is_registered: $is_registered, monitor_id: $monitor_id}) {
      id
      deviceId
      registration_code
      is_registered
      monitor_id
    }
  }
`;

const GET_MONITOR_BY_REGISTRATION_CODE_QUERY = gql`
  query GetMonitorByRegistrationCode($registration_code: String!) {
    monitor(where: { registration_code: { _eq: $registration_code } }) {
      id
      registration_code
    }
  }
`;


export const createDeviceController = async (req, res) => {
  const { deviceId, registration_code, is_registered, monitor_id } = req.body;

  try {
    // Check if the device already exists
    const { data: deviceData } = await client.query({
      query: GET_DEVICE_BY_ID_QUERY,
      variables: { deviceId }
    });

    if (deviceData.devices.length > 0) {
      // If the device exists, check if it needs to be updated

      // Check if any monitor includes the registration_code
      const { data: monitorData } = await client.query({
        query: GET_MONITOR_BY_REGISTRATION_CODE_QUERY,
        variables: { registration_code }
      });

      console.log('Monitor Data:', monitorData);
      // If no update is needed, return the existing device information
      return res.status(200).json({ message: 'Device already exists with the given deviceId' });
    }

    // If the device does not exist, create a new one
    const createResponse = await client.mutate({
      mutation: CREATE_DEVICE_MUTATION,
      variables: { deviceId, registration_code, is_registered, monitor_id }
    });

    // Respond with the created device data
    res.status(201).json(createResponse.data.insert_devices_one);

  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({ error: 'An error occurred while creating the device' });
  }
};



class RetryAblePromise extends Promise {
  static async retry(
    retries,
    executor
  ) {

  }
}