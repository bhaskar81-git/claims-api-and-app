# Claims API Documentation

## Overview

This document provides detailed documentation for the P&C Insurance Claims GraphQL API. The API is designed to support insurance claim adjusters by managing claims, policyholders, damage reports, liability reports, and repair estimates.

## Getting Started

To run the server, follow these steps:

1.  Install the dependencies:
    ```bash
    npm install
    ```

2.  Start the server:
    ```bash
    npm start
    ```

The server will be available at `http://localhost:4000`.

## API Endpoint

The GraphQL endpoint is:

`http://localhost:4000/graphql`

## Queries

### `getAllClaims`

Retrieves a list of all claims.

**Example Request:**

```graphql
query {
  getAllClaims {
    id
    policyNumber
    status
  }
}
```

**Example Response:**

```json
{
  "data": {
    "getAllClaims": [
      {
        "id": "1",
        "policyNumber": "P123456789",
        "status": "Open"
      },
      {
        "id": "2",
        "policyNumber": "P987654321",
        "status": "Closed"
      }
    ]
  }
}
```

### `getClaim(id: ID!)`

Retrieves a specific claim by its ID.

*   `id`: The unique identifier of the claim.

**Example Request:**

```graphql
query {
  getClaim(id: "1") {
    id
    policyNumber
    status
    dateOfLoss
    policyHolder {
      name
      address
    }
  }
}
```

**Example Response:**

```json
{
  "data": {
    "getClaim": {
      "id": "1",
      "policyNumber": "P123456789",
      "status": "Open",
      "dateOfLoss": "2024-07-20",
      "policyHolder": {
        "name": "John Doe",
        "address": "123 Main St, Anytown, USA"
      }
    }
  }
}
```

### `getRepairEstimatesForClaim(claimId: ID!)`

Retrieves all repair estimates for a specific claim.

*   `claimId`: The unique identifier of the claim.

**Example Request:**

```graphql
query {
  getRepairEstimatesForClaim(claimId: "2") {
    shopName
    amount
    documentLink
  }
}
```

**Example Response:**

```json
{
  "data": {
    "getRepairEstimatesForClaim": [
      {
        "shopName": "Otherville Body Shop",
        "amount": 4500,
        "documentLink": "/docs/re2_estimate.pdf"
      }
    ]
  }
}
```

## Mutations

### `updateClaimStatus(id: ID!, status: String!)`

Updates the status of a specific claim.

*   `id`: The unique identifier of the claim.
*   `status`: The new status of the claim.

**Example Request:**

```graphql
mutation {
  updateClaimStatus(id: "1", status: "Closed") {
    id
    status
  }
}
```

**Example Response:**

```json
{
  "data": {
    "updateClaimStatus": {
      "id": "1",
      "status": "Closed"
    }
  }
}
```

### `addClaim(claimInput: ClaimInput!)`

Adds a new claim.

*   `claimInput`: An object containing the new claim's details.

**Example Request:**

```graphql
mutation {
  addClaim(claimInput: { policyNumber: "PNEW001", dateOfLoss: "2024-08-01", policyHolderId: "101"}) {
    id
    policyNumber
    status
  }
}
```

**Example Response:**

```json
{
  "data": {
    "addClaim": {
      "id": "a3be61ca-2a43-4d15-88e2-bbe044d92e3e",
      "policyNumber": "PNEW001",
      "status": "Open"
    }
  }
}
```

### `updateClaimDetails(id: ID!, claimInput: ClaimInput!)`

Updates the details of an existing claim.

*   `id`: The unique identifier of the claim to update.
*   `claimInput`: An object containing the updated claim details.

**Example Request:**

```graphql
mutation {
  updateClaimDetails(id: "a3be61ca-2a43-4d15-88e2-bbe044d92e3e", claimInput: { policyNumber: "PNEW001-UPDATED", dateOfLoss: "2024-08-02", policyHolderId: "102"}) {
    id
    policyNumber
    dateOfLoss
    policyHolder {
      name
    }
  }
}
```

**Example Response:**

```json
{
  "data": {
    "updateClaimDetails": {
      "id": "a3be61ca-2a43-4d15-88e2-bbe044d92e3e",
      "policyNumber": "PNEW001-UPDATED",
      "dateOfLoss": "2024-08-02",
      "policyHolder": {
        "name": "Jane Smith"
      }
    }
  }
}
```

### `deleteClaim(id: ID!)`

Deletes a claim by its ID.

*   `id`: The unique identifier of the claim to delete.

**Example Request:**

```graphql
mutation {
  deleteClaim(id: "a3be61ca-2a43-4d15-88e2-bbe044d92e3e") {
    id
    policyNumber
  }
}
```

**Example Response:**

```json
{
  "data": {
    "deleteClaim": {
      "id": "a3be61ca-2a43-4d15-88e2-bbe044d92e3e",
      "policyNumber": "PNEW001-UPDATED"
    }
  }
}
```

## Error Handling

The API returns standard GraphQL errors. If a resolver encounters an issue (e.g., an item is not found), it will return a `null` value for the data field and an `errors` array.

**Example Error Response (Claim Not Found):**

```json
{
  "data": {
    "getClaim": null
  },
  "errors": [
    {
      "message": "Claim not found",
      "locations": [ { "line": 2, "column": 3 } ],
      "path": [ "getClaim" ],
      "extensions": {
        "code": "INTERNAL_SERVER_ERROR"
      }
    }
  ]
}
```

## Types

### `PolicyHolder`

| Field     | Type      | Description                               |
| :-------- | :-------- | :---------------------------------------- |
| `id`      | `ID!`     | The unique identifier of the policyholder. |
| `name`    | `String!` | The name of the policyholder.             |
| `address` | `String`  | The address of the policyholder.          |

### `DamageReport`

| Field         | Type       | Description                               |
| :------------ | :--------- | :---------------------------------------- |
| `id`          | `ID!`      | The unique identifier of the damage report. |
| `description` | `String!`  | A description of the damage.              |
| `photos`      | `[String]` | A list of URLs to photos of the damage.   |

### `LiabilityReport`

| Field                  | Type      | Description                                    |
| :--------------------- | :-------- | :----------------------------------------- |
| `id`                   | `ID!`     | The unique identifier of the liability report. |
| `details`              | `String!` | Details of the liability assessment.         |
| `policeReportAttached` | `Boolean` | Whether a police report is attached.         |

### `RepairEstimate`

| Field          | Type     | Description                                  |
| :------------- | :------- | :------------------------------------------- |
| `id`           | `ID!`    | The unique identifier of the repair estimate. |
| `shopName`     | `String!`| The name of the repair shop.                 |
| `amount`       | `Float!` | The estimated cost of repairs.               |
| `documentLink` | `String` | A link to the repair estimate document.      |

### `Claim`

| Field              | Type                | Description                                      |
| :----------------- | :------------------ | :----------------------------------------------- |
| `id`               | `ID!`               | The unique identifier of the claim.              |
| `policyNumber`     | `String!`           | The policy number associated with the claim.     |
| `policyHolderId`   | `ID!`               | The ID of the policyholder.                      |
| `dateOfLoss`       | `String!`           | The date the loss occurred.                      |
| `status`           | `String!`           | The current status of the claim.                 |
| `policyHolder`     | `PolicyHolder`      | The policyholder associated with the claim.      |
| `damageReports`    | `[DamageReport]`    | A list of damage reports for the claim.          |
| `liabilityReports` | `[LiabilityReport]` | A list of liability reports for the claim.       |
| `repairEstimates`  | `[RepairEstimate]`  | A list of repair estimates for the claim.        |

### `ClaimInput`

| Field            | Type      | Description                                  |
| :--------------- | :-------- | :------------------------------------------- |
| `policyNumber`   | `String!` | The policy number for the new claim.         |
| `dateOfLoss`     | `String!` | The date the loss occurred.                  |
| `policyHolderId` | `ID!`     | The ID of the policyholder for the new claim. |
