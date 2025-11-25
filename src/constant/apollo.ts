const isProd = false;
export const APOLLO_SERVER = isProd
  ? `https://api-v2.dapurcokelat.com/graphql`
  : `http://localhost:8080/graphql`;
