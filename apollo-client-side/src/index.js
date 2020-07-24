import React from "react";
import { render } from "react-dom";

import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { ApolloProvider, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import { InMemoryCache } from "apollo-cache-inmemory";
import { onError } from "apollo-link-error";
import { HttpLink } from "apollo-link-http";

// This query will trigger a network error because "missing" is not part of the schema.
// const QUERY = gql`{missing}`

// This query will trigger a GraphQL error because the "bad" query throws an error on the server-side.
// Depending on the errorPolicy, result.data may be undefined or partially populated.
const QUERY = gql`{good, bad}`

const cache = new InMemoryCache();
const httpLink = new HttpLink({
  uri: "http://localhost:4000"
});

// In dashboard, we use the onError link. We also use it here, just to see if it
// makes any difference. (It does not.)
const onErrorLink = onError(({ graphQLErrors, networkError }) => {});

const client = new ApolloClient({
  link: ApolloLink.from([onErrorLink, httpLink]),
  cache
});

function DataComponent() {
  const { loading, error, data, refetch } = useQuery(QUERY,
  {
    errorPolicy: "none",
  });

  console.log("result", data)

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      data
      <button onClick={() => refetch()}>Refetch!</button>
    </div>
  )
}

const App = () => (
  <ApolloProvider client={client}>
    <div>
      <p>This page makes a graphQL query to an Apollo server running at localhost:4000 and logs any GraphQL errors or network errors. It will print 'true' if there are GraphQL errors and/or network errors present.</p>
      <DataComponent />
    </div>
  </ApolloProvider>
);

render(<App />, document.getElementById("root"));
