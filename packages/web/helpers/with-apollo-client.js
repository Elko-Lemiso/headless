import React, { Component } from 'react';
import initApollo from './init-apollo';
import Head from 'next/head';
import { getDataFromTree } from '@apollo/react-ssr';
import { getDisplayName } from 'next-server/dist/lib/utils';
import { ApolloProvider } from '@apollo/react-hooks';

import { getFirebaseCookie } from './session';

export default PageComponent => {
  return class extends Component {
    static displayName = `withApollo(${getDisplayName(PageComponent)})`;
    static async getInitialProps(ctx) {
      const { AppTree, router } = ctx;
      let pageProps = {};
      if (PageComponent.getInitialProps) {
        pageProps = await PageComponent.getInitialProps(ctx);
      }
      const context = ctx.ctx;
      const token = getFirebaseCookie('id_token', context);
      // Run all GraphQL queries in the component tree
      // and extract the resulting data
      const apollo = initApollo();
      if (typeof window === 'undefined') {
        try {
          // Run all GraphQL queries
          await getDataFromTree(
            <AppTree
              pageProps={{
                ...pageProps,
                apollo,
                router,
              }}
            />
          );
        } catch (error) {
          // Prevent Apollo Client GraphQL errors from crashing SSR.
          // Handle them in components via the data.error prop:
          // https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-query-data-error
          console.error('Error while running `getDataFromTree`', error);
        }

        // getDataFromTree does not call componentWillUnmount
        // head side effect therefore need to be cleared manually
        Head.rewind();
      }

      // Extract query data from the Apollo store
      const apolloState = apollo.cache.extract();
      return {
        ...pageProps,
        apolloState,
        token,
      };
    }

    constructor(props) {
      super(props);
      this.apollo = props.apollo || initApollo(props.apolloState, props.token);
    }

    render() {
      const { apollo, apolloState, ...pageProps } = this.props;
      return (
        <ApolloProvider client={this.apollo}>
          <PageComponent {...pageProps} />
        </ApolloProvider>
      );
    }
  };
};
