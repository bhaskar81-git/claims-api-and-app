const { gql } = require('apollo-server-express');

// A unified schema for the entire application
const typeDefs = gql`
  type PolicyHolder {
    id: ID!
    name: String!
    address: String
  }

  

  type Claim {
    id: ID!
    policyNumber: String!
    policyHolderId: ID!
    dateOfLoss: String!
    status: String!
    damageReports: String
    liabilityReports: String
    repairEstimates: String
    
    # Nested fields resolved from other data sources
    policyHolder: PolicyHolder
  }

  input ClaimInput {
    policyNumber: String!
    dateOfLoss: String!
    policyHolderId: ID!
    damageReports: String
    liabilityReports: String
    repairEstimates: String
  }

  input PolicyHolderInput {
    name: String!
    address: String
  }

  input UpdateClaimInput {
    policyNumber: String
    dateOfLoss: String
    policyHolderId: ID
    damageReports: String
    liabilityReports: String
    repairEstimates: String
  }

  type Query {
    getAllClaims: [Claim]
    getClaim(id: ID!): Claim
    
  }

  type Mutation {
    # Adjuster workflow mutations
    updateClaimStatus(id: ID!, status: String!): Claim

    # Claims management mutations
    addClaim(claimInput: ClaimInput!): Claim
    updateClaimDetails(id: ID!, claimInput: UpdateClaimInput!): Claim
    deleteClaim(id: ID!): Claim
    addPolicyHolder(policyHolderInput: PolicyHolderInput!): PolicyHolder
  }
`;

module.exports = typeDefs;
