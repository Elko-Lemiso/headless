import { ApolloClient, InMemoryCache, HttpLink } from 'apollo-boost';
import { ApolloLink } from 'apollo-link';
import fetch from 'isomorphic-unfetch';
import { setContext } from 'apollo-link-context';

import { GRAPHQL_URL } from '../Config';

let apolloClient = null;

function create(initialState, token = null) {
  const isBrowser = typeof window !== 'undefined';

  const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    // const token = localStorage.getItem('token');
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token,
      },
    };
  });
  const httpLink = new HttpLink({
    uri: GRAPHQL_URL, // Server URL (must be absolute)
    credentials: 'same-origin', // Additional fetch() options like `credentials` or `headers`
    // Use fetch() polyfill on the server
    fetch: !isBrowser && fetch,
  });
  return new ApolloClient({
    connectToDevTools: isBrowser,
    ssrMode: !isBrowser, // Disables forceFetch on the server (so queries are only run once)
    link: ApolloLink.from([authLink, httpLink]),
    cache: new InMemoryCache({
      dataIdFromObject: object => object.id || null,
      addTypename: false,
    }).restore(initialState || {}),
  });
}

export default function initApollo(initialState, token) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (typeof window === 'undefined') {
    return create(initialState, token);
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState, token);
  }

  return apolloClient;
}
