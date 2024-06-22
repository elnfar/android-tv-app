import { NhostClient } from '@nhost/nhost-js';
import { Environment, Framework, ProExampleConfig } from '../types';

export function isProduction() {
  return process.env.NODE_ENV === Environment.PRODUCTION;
}

export function isDevelopment() {
  return process.env.NODE_ENV === Environment.DEVELOPMENT;
}

export function isStaging() {
  return process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview';
}

export function getNhostClient() {
  const nhost = new NhostClient({
    subdomain: 'local',
    region: '',
  });

  return nhost;
}

export async function getExampleList({ framework }: { framework?: Framework } = {}): Promise<ProExampleConfig[]> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_PRO_EXAMPLES_URL}/examples.json`, {
    next: { tags: ['examples'] },
  });
  const examples = await response.json();
  return examples
    .filter((example:any) => (framework ? example.framework === framework : true))
    .map((example:any) => ({ ...example, framework: 'react' }));
}

export async function getExampleConfig({ id, framework }: { id: string; framework: Framework }) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_PRO_EXAMPLES_URL}/${id}/config.json`, {
    next: { tags: ['examples'] },
  });
  const config = await response.json();
  return config;
}