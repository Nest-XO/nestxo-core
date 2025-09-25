import gql from 'graphql-tag';

export const tenantAdminSchema = gql`
  extend type Channel {
    tenant: Tenant
  }
  type Tenant {
    id: ID!
    name: String!
    code: String!
    token: String!
    description: String
    channels: [Channel!]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  extend type Query {
    tenant(id: ID!): Tenant
    tenantByCode(code: String!): Tenant
    tenantByName(name: String!): Tenant
    tenants: [Tenant!]!
  }

  extend type Mutation {
    createTenant(
      name: String!
      description: String
      token: String!
      channelIds: [ID!]
    ): Tenant!

    updateTenant(
      id: ID!
      name: String
      addChannelIds: [ID!]
      removeChannelIds: [ID!]
    ): Tenant!

    deleteTenant(id: ID!): Boolean!
  }
`;
