import React from "react";
import ReactDOM from "react-dom/client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { onError } from "@apollo/client/link/error";

import { App } from "./App.tsx";

const queryClient = new QueryClient();

import {
  from,
  HttpLink,
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";
import { APOLLO_SERVER } from "./constant/apollo.ts";

import { setContext } from "@apollo/client/link/context";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";

const httpLink = new HttpLink({
  uri: APOLLO_SERVER,
});

const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors)
      graphQLErrors.forEach(({ message, locations, path }) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      );

    if (networkError) console.log(`[Network error]: ${networkError}`);
    return forward(operation);
  }
);

const authLink = setContext((_, { headers }) => {
  // const token = localStorage.getItem("token");

  return {
    headers: {
      ...headers,
    },
  };
});

const apolloClient = new ApolloClient({
  link: authLink.concat(from([errorLink, httpLink])),
  cache: new InMemoryCache(),
});

export const theme = createTheme({
  palette: {
    primary: {
      main: "#764E3F", // blue
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ApolloProvider client={apolloClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </ApolloProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
