# Postman GraphQL Inputs

This file contains the queries and mutations you can use in Postman to test the GraphQL API.

### Postman Setup

1.  **URL**: `http://localhost:4000/graphql`
2.  **Method**: `POST`
3.  **Headers**: Add a header `Content-Type` with the value `application/json`.
4.  **Body**: Select the `GraphQL` radio button in the body tab. This provides a dedicated input for your query and another for GraphQL variables if needed.

---

### 1. Get All Claims

This query fetches a list of all claims with their ID, policy number, and status.

```graphql
query GetAllClaims {
  getAllClaims {
    id
    policyNumber
    status
  }
}
```

---

### 2. Get a Specific Claim with Detailed Data

This query retrieves a single claim by its ID (`"1"`) and includes nested details like the policyholder, damage reports, and repair estimates.

```graphql
query GetSpecificClaim {
  getClaim(id: "1") {
    id
    policyNumber
    status
    dateOfLoss
    policyHolder {
      name
      address
    }
    damageReports {
      description
    }
    liabilityReports {
      details
    }
    repairEstimates {
      shopName
      amount
    }
  }
}
```

---

### 3. Get Only Repair Estimates for a Specific Claim

This is an example of a customized query to fetch only the repair estimates for a specific claim (`"2"`).

```graphql
query GetRepairEstimatesForClaim {
  getRepairEstimatesForClaim(claimId: "2") {
    shopName
    amount
    documentLink
  }
}
```

---

### 4. Update a Claim's Status

This mutation updates the status of a claim (`"1"`) to `"In Progress"`.

```graphql
mutation UpdateClaimStatus {
  updateClaimStatus(id: "1", status: "In Progress") {
    id
    status
  }
}
```

---

### 5. Verify the Status Update

After running the mutation, you can use this query to confirm that the status of claim `"1"` has been updated.

```graphql
query VerifyClaimUpdate {
  getClaim(id: "1") {
    id
    status
  }
}
```
