#!/bin/bash

API_URL="http://localhost:4000/graphql"

# Helper function to make GraphQL requests
make_request() {
    local query=$1
    echo "Executing query: $query"
    # Use jq to safely create the JSON payload
    json_payload=$(jq -n --arg q "$query" '{"query": $q}')
    # Use a variable to store the response to extract the ID later
    response=$(curl -s -X POST -H "Content-Type: application/json" --data "$json_payload" $API_URL)
    echo $response | json_pp
    echo -e "\n--------------------------------------------------\n"
}

# --- Adjuster Workflow API Tests ---
echo "--- TESTING ADJUSTER WORKFLOW API ---"

# 1. Get all claims
echo "Fetching all claims..."
QUERY_ALL_CLAIMS="query { getAllClaims { id policyNumber status } }"
make_request "$QUERY_ALL_CLAIMS"

# 2. Get a specific claim with detailed data
echo "Fetching claim with ID 1 and its details..."
QUERY_SPECIFIC_CLAIM='query { getClaim(id: "1") { id policyNumber status dateOfLoss policyHolder { name address } damageReports { description } liabilityReports { details } repairEstimates { shopName amount } } }'
make_request "$QUERY_SPECIFIC_CLAIM"

# 3. Get only repair estimates for a specific claim
echo "Fetching only repair estimates for claim with ID 2..."
QUERY_REPAIR_ESTIMATES='query { getRepairEstimatesForClaim(claimId: "2") { shopName amount documentLink } }'
make_request "$QUERY_REPAIR_ESTIMATES"

# --- Claims Management API Tests ---
echo "--- TESTING CLAIMS MANAGEMENT API ---"

# 4. Add a new claim
echo "Adding a new claim..."
ADD_CLAIM_MUTATION='mutation { addClaim(claimInput: { policyNumber: "PNEW001", dateOfLoss: "2024-08-01", policyHolderId: "101"}) { id policyNumber status } }'
make_request "$ADD_CLAIM_MUTATION"
# Extract the ID of the newly created claim
new_claim_id=$(echo $response | jq -r '.data.addClaim.id')
echo "New claim created with ID: $new_claim_id"

# 5. Update the details of the new claim
echo "Updating details for claim ID: $new_claim_id..."
UPDATE_CLAIM_MUTATION=$(printf 'mutation { updateClaimDetails(id: "%s", claimInput: { policyNumber: "PNEW001-UPDATED", dateOfLoss: "2024-08-02", policyHolderId: "102"}) { id policyNumber dateOfLoss policyHolder { name } } }' "$new_claim_id")
make_request "$UPDATE_CLAIM_MUTATION"

# 6. Delete the claim
echo "Deleting claim ID: $new_claim_id..."
DELETE_CLAIM_MUTATION=$(printf 'mutation { deleteClaim(id: "%s") { id policyNumber } }' "$new_claim_id")
make_request "$DELETE_CLAIM_MUTATION"

# 7. Verify the claim is deleted
echo "Verifying deletion of claim ID: $new_claim_id..."
VERIFY_DELETE_QUERY=$(printf 'query { getClaim(id: "%s") { id } }' "$new_claim_id")
make_request "$VERIFY_DELETE_QUERY"
