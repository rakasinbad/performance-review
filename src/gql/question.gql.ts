import gql from "graphql-tag";

export const QUESTION_GQL = gql`
  query Questions($input: QuestionQueryParams!) {
    Questions(input: $input) {
      data {
        id
        text
      }
      meta {
        total
        totalFiltered
      }
    }
  }
`;
