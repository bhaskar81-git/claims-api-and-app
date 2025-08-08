const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

// Mock data
let claims = [
    {
        id: '1',
        policyNumber: 'P123456789',
        status: 'Open',
        dateOfLoss: '2024-07-20',
        policyHolderId: '101',
        damageReportIds: ['dr1'],
        liabilityReportIds: ['lr1'],
        repairEstimateIds: ['re1']
    },
    {
        id: '2',
        policyNumber: 'P987654321',
        status: 'Closed',
        dateOfLoss: '2024-06-15',
        policyHolderId: '102',
        damageReportIds: ['dr2'],
        liabilityReportIds: [],
        repairEstimateIds: ['re2', 're3']
    }
];

const policyHolders = {
    '101': { id: '101', name: 'John Doe', address: '123 Main St, Anytown, USA' },
    '102': { id: '102', name: 'Jane Smith', address: '456 Oak Ave, Otherville, USA' }
};

const damageReports = {
    'dr1': { id: 'dr1', description: 'Front bumper damage', photos: ['/photos/dr1_1.jpg'] },
    'dr2': { id: 'dr2', description: 'Hail damage to roof and hood', photos: ['/photos/dr2_1.jpg', '/photos/dr2_2.jpg'] }
};

const liabilityReports = {
    'lr1': { id: 'lr1', details: 'Other party at fault, police report attached.', documentLink: '/docs/lr1_police_report.pdf' }
};

const repairEstimates = {
    're1': { id: 're1', shopName: 'Anytown Auto Repair', amount: 1500.00, documentLink: '/docs/re1_estimate.pdf' },
    're2': { id: 're2', shopName: 'Otherville Body Shop', amount: 4500.00, documentLink: '/docs/re2_estimate.pdf' },
    're3': { id: 're3', shopName: 'Trusty Mechanics', amount: 4250.00, documentLink: '/docs/re3_estimate.pdf' }
};

// GraphQL schema
const typeDefs = gql`
    type Query {
        getAllClaims: [Claim]
        getClaim(id: ID!): Claim
        getRepairEstimatesForClaim(claimId: ID!): [RepairEstimate]
    }

    type Mutation {
        updateClaimStatus(id: ID!, status: String!): Claim
    }

    type Claim {
        id: ID!
        policyNumber: String!
        status: String!
        dateOfLoss: String!
        policyHolder: PolicyHolder
        damageReports: [DamageReport]
        liabilityReports: [LiabilityReport]
        repairEstimates: [RepairEstimate]
    }

    type PolicyHolder {
        id: ID!
        name: String
        address: String
    }

    type DamageReport {
        id: ID!
        description: String
        photos: [String]
    }

    type LiabilityReport {
        id: ID!
        details: String
        documentLink: String
    }

    type RepairEstimate {
        id: ID!
        shopName: String
        amount: Float
        documentLink: String
    }
`;

// Resolvers
const resolvers = {
    Query: {
        getAllClaims: () => claims,
        getClaim: (parent, { id }) => claims.find(claim => claim.id === id),
        getRepairEstimatesForClaim: (parent, { claimId }) => {
            const claim = claims.find(c => c.id === claimId);
            if (!claim) return [];
            return claim.repairEstimateIds.map(id => repairEstimates[id]);
        }
    },
    Mutation: {
        updateClaimStatus: (parent, { id, status }) => {
            const claim = claims.find(claim => claim.id === id);
            if (!claim) {
                throw new Error('Claim not found');
            }
            claim.status = status;
            return claim;
        }
    },
    Claim: {
        policyHolder: (claim) => policyHolders[claim.policyHolderId],
        damageReports: (claim) => claim.damageReportIds.map(id => damageReports[id]),
        liabilityReports: (claim) => claim.liabilityReportIds.map(id => liabilityReports[id]),
        repairEstimates: (claim) => claim.repairEstimateIds.map(id => repairEstimates[id])
    }
};

async function startServer() {
    const app = express();
    const server = new ApolloServer({
        typeDefs,
        resolvers,
    });

    await server.start();
    server.applyMiddleware({ app });

    const PORT = 4000;
    app.listen(PORT, () => {
        console.log(`Server ready at http://localhost:${PORT}${server.graphqlPath}`);
    });
}

startServer();
