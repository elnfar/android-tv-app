import pkg from '@apollo/client';
const { gql, ApolloClient, InMemoryCache, HttpLink } = pkg;
import fetch from 'node-fetch';

const subdomain = 'jhugfkkoqofbgmfeshkg';
const region = 'eu-central-1';
const graphqlUrl = `https://${subdomain}.graphql.${region}.nhost.run/v1`;

// Initialize Apollo Client
const client = new ApolloClient({
  link: new HttpLink({ uri: graphqlUrl, fetch }),
  cache: new InMemoryCache()
});

const GET_MONITOR_BY_REGISTRATION_CODE_QUERY = gql`
  query GetMonitorByRegistrationCode($registration_code: String!) {
    monitor(where: { registration_code: { _eq: $registration_code } }) {
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

const UPDATE_DEVICE_REGISTRATION_MUTATION = gql`
  mutation UpdateDeviceRegistration($registration_code: String!, $is_registered: Boolean!) {
    update_devices(where: { registration_code: { _eq: $registration_code } }, _set: { is_registered: $is_registered }) {
      affected_rows
    }
  }
`;

export const fetchMonitorAndUpdateDevice = async (req, res) => {
  const { registration_code } = req.body;

  try {
    // Fetch the monitor by registration code
    const { data: monitorData } = await client.query({
      query: GET_MONITOR_BY_REGISTRATION_CODE_QUERY,
      variables: { registration_code }
    });

    if (!monitorData || monitorData.monitor.length === 0) {
      return res.status(404).json({ message: "No monitor found with the provided registration code." });
    }

    const monitor = monitorData.monitor[0];

    // Update the device registration
    const { data: updateDeviceResponse } = await client.mutate({
      mutation: UPDATE_DEVICE_REGISTRATION_MUTATION,
      variables: { registration_code, is_registered: true }
    });

    if (updateDeviceResponse.update_devices.affected_rows > 0) {
      return res.status(200).json({ message: 'Device registration updated successfully', monitor });
    } else {
      return res.status(400).json({ message: 'Failed to update device registration' });
    }

  } catch (error) {
    console.error('Error fetching monitor and updating device:', error);
    return res.status(500).json({ error: 'An error occurred while fetching the monitor and updating the device' });
  }
};
