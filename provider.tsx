'use client';

import * as React from 'react';

import { NhostProvider } from '@nhost/react';
import { NhostApolloProvider } from '@nhost/react-apollo';
import { getNhostClient } from './src/utils';

export const nhost = getNhostClient();

type Props = {
  children: React.ReactNode;
};

export function NhostClientProvider({ children }: Props) {
  return (
    <NhostProvider nhost={nhost}>
      <NhostApolloProvider nhost={nhost}>{children}</NhostApolloProvider>
    </NhostProvider>
  );
}

export default NhostClientProvider;