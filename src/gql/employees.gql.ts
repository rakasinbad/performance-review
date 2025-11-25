import gql from "graphql-tag";

export const EMPLOYEES_GQL = gql`
  query Employees($input: EmployeeQueryParams!) {
    Employees(input: $input) {
      data {
        id
        nik
        nama
      }
      meta {
        total
        totalFiltered
        __typename
      }
      __typename
    }
  }
`;
