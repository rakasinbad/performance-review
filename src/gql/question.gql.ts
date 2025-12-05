import gql from "graphql-tag";

export const QUESTION_GQL = gql`
  query Questions($input: QuestionQueryParams!) {
    Questions(input: $input) {
      data {
        id
        text
        questionGroupId
      }
      meta {
        total
        totalFiltered
      }
    }
  }
`;

export const QUESTION_GROUP_GQL = gql`
  query QuestionGroup($input: QuestionGroupQueryParams!) {
    QuestionGroup(input: $input) {
      id
      instruction
    }
  }
`;
