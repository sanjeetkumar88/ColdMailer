export const analyticsTypeDefs = `#graphql
  type DashboardStats {
    totalSent: Int
    totalFailed: Int
    totalOpened: Int
    totalClicked: Int
    totalBounced: Int
    successRate: Float
  }

  type Event {
    id: ID!
    recipientEmail: String
    type: String
    error: String
    createdAt: String
  }

  extend type Query {
    dashboardStats: DashboardStats
    campaignStats(campaignId: ID!): DashboardStats
    campaignEvents(campaignId: ID!): [Event]
  }
`;
