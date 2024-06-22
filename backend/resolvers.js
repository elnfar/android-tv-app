import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();

export const resolvers = {
  Subscription: {
    monitorRegistrationChanged: {
      subscribe: (_, { registration_code }, { pubsub }) => {
        return pubsub.asyncIterator(`MONITOR_REGISTRATION_CHANGED_${registration_code}`);
      },
    },
  },


};
