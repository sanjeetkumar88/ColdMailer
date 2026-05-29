export const mediaTypeDefs = `#graphql
  type Media {
    id: ID!
    originalName: String
    size: Int
    url: String
    createdAt: String
  }

  extend type Query {
    mediaFiles: [Media]
  }
`;
