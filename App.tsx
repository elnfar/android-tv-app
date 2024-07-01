import * as React from 'react';
import { Platform, View, StyleSheet, Text } from 'react-native';
import { NhostProvider, useNhostClient } from '@nhost/react';
import { nhost } from './src/lib/nhost';
import Home from './src/components/Home';
import { DeviceProvider } from './src/providers/Idprovider';
import { createClient } from 'graphql-ws';
import { ApolloProvider, ApolloClient, InMemoryCache, HttpLink, split } from '@apollo/client';
import { getMainDefinition } from "@apollo/client/utilities";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";

const subdomain = 'jhugfkkoqofbgmfeshkg';
const region = 'eu-central-1';
const graphqlUrl = `https://${subdomain}.hasura.${region}.nhost.run/v1/graphql`;

const cache = new InMemoryCache({
  typePolicies: {
    Subscription: {
      fields: {
        devices: {
          merge(existing = [], incoming) {
            return incoming;
          },
        },
      },
    },
  },
});


export default function App() {
  const wsLink = new GraphQLWsLink(
    createClient({
      url: `wss://jhugfkkoqofbgmfeshkg.hasura.eu-central-1.nhost.run/v1/graphql`,
    
    })
  );

  const httpLink = new HttpLink({
    uri: graphqlUrl,
  });

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink,
    httpLink
  );

  const client = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
  });

  

  return (
    <ApolloProvider client={client}>
      <NhostProvider nhost={nhost}>
          <View style={styles.container}>
            <Home />
            <View style={styles.unique}>
              <Text>Device Unique ID: </Text>
            </View>
            <View style={styles.buttons}></View>
          </View>
      </NhostProvider>
     </ApolloProvider>
  );
}

const scale = Platform.OS === 'ios' ? 2.0 : 1.0;
const backgroundColor = '#ecf0f1';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 50 * scale,
  },
  button: {
    backgroundColor: 'darkblue',
    margin: 20 * scale,
    borderRadius: 5 * scale,
    padding: 10 * scale,
  },
  buttonText: {
    color: 'white',
    fontSize: 20 * scale,
  },
  progressContainer: {
    backgroundColor,
    flexDirection: 'row',
    width: '100%',
    height: 5 * scale,
    margin: 0,
  },
  progressLeft: {
    backgroundColor: 'blue',
    borderTopRightRadius: 5 * scale,
    borderBottomRightRadius: 5 * scale,
    flexDirection: 'row',
    height: '100%',
  },
  progressRight: {
    backgroundColor,
    flexDirection: 'row',
    height: '100%',
  },
  unique: {
    marginBottom: 100,
  },
});
