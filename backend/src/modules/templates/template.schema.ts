export const templateTypeDefs = `#graphql
  type Template {
    id: ID!
    name: String!
    subject: String!
    html: String!
    text: String
    variables: [String]
    userId: ID!
    createdAt: String
    updatedAt: String
  }

  input CreateTemplateInput {
    name: String!
    subject: String!
    html: String!
    text: String
    variables: [String]
  }

  input UpdateTemplateInput {
    name: String
    subject: String
    html: String
    text: String
    variables: [String]
  }

  type Query {
    templates: [Template]
    template(id: ID!): Template
  }

  type Mutation {
    createTemplate(input: CreateTemplateInput!): Template
    updateTemplate(id: ID!, input: UpdateTemplateInput!): Template
    deleteTemplate(id: ID!): Template
  }
`;
