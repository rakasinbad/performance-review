import gql from "graphql-tag";

export const QUESTION_GQL = gql`
  query Questions($input: QuestionQueryParams!) {
    Questions(input: $input) {
      data {
        id
        text
        questionGroupId
        type
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

export const CREATE_RESPONSE_GQL = gql`
  mutation Response($input: CreateResponse!) {
    CreateResponse(input: $input) {
      id
    }
  }
`;
