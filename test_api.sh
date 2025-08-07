#!/bin/bash

API_URL="http://localhost:4000/graphql"

# Helper function to make GraphQL requests
make_request() {
    local query=$1
    echo "Executing query: $query"
    curl -s -X POST -H "Content-Type: application/json" --data "{\"query\": \"$query\"}" $API_URL | json_pp
    echo -e "\n--------------------------------------------------\n"
}

# 1. Get all claims
echo "Fetching all claims..."
QUERY_ALL_CLAIMS="query { getAllClaims { id policyNumber status } }"
make_request "$QUERY_ALL_CLAIMS"

# 2. Get a specific claim with detailed data
echo "Fetching claim with ID 1 and its details..."
QUERY_SPECIFIC_CLAIM='query { getClaim(id: \"1\") { id policyNumber status dateOfLoss policyHolder { name address } damageReports { description } liabilityReports { details } repairEstimates { shopName amount } } }'
make_request "$QUERY_SPECIFIC_CLAIM"

# 3. Get only repair estimates for a specific claim
echo "Fetching only repair estimates for claim with ID 2..."
QUERY_REPAIR_ESTIMATES='query { getRepairEstimatesForClaim(claimId: \"2\") { shopName amount documentLink } }'
make_request "$QUERY_REPAIR_ESTIMATES"

# 4. Update a claim's status
echo "Updating status for claim with ID 1 to 'In Progress'..."
MUTATION_UPDATE_STATUS='mutation { updateClaimStatus(id: \"1\", status: \"In Progress\") { id status } }'
make_request "$MUTATION_UPDATE_STATUS"

# 5. Verify the status update
echo "Verifying status update for claim with ID 1..."
QUERY_VERIFY_UPDATE='query { getClaim(id: \"1\") { id status } }'
make_request "$QUERY_VERIFY_UPDATE"
