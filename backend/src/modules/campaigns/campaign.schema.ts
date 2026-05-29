export const campaignTypeDefs = `#graphql
  type CampaignSender {
    id: ID
    email: String
  }

  type CampaignTemplate {
    id: ID
    name: String
  }

  type Campaign {
    id: ID!
    name: String
    subject: String
    recipients: [String]
    status: String
    sentCount: Int
    failedCount: Int
    openedCount: Int
    sender: CampaignSender
    template: CampaignTemplate
    createdAt: String
    updatedAt: String
  }

  type CampaignConnection {
    campaigns: [Campaign]
    totalPages: Int
  }

  extend type Query {
    recentCampaigns(limit: Int): [Campaign]
    paginatedCampaigns(page: Int, limit: Int, status: String): CampaignConnection
    campaign(id: ID!): Campaign
  }
`;
