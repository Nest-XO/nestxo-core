import gql from 'graphql-tag';

export const GET_TENANTS = gql`
  query tenants {
    tenants {
      id
      name
      code
      token
    }
  }
`;

export const CREATE_TENANT = gql`
  mutation CreateTenant($name: String!, $description: String!, $token: String!) {
    createTenant(name: $name, description: $description, token: $token) {
      id
      name
      code
      token
      description
      channels {
        id
        code
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_TENANTS_ID_NAME = gql`
  query GetTenants {
    tenants {
      id
      name
    }
  }
`;

export const GET_TENANT_BY_ID = gql`
  query GetTenant($id: ID!) {
    tenant(id: $id) {
      id
      name
    }
  }
`;