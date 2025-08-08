# GraphQL API Data Strategy

This document explains how the GraphQL API currently handles data storage, retrieval, and updates.

### 1. Where the Data is Stored: In-Memory Mock Data

The data is **not stored in a database**. It is stored **in-memory** within the running Node.js application. Inside the `server.js` file, you'll find these JavaScript variables defined at the top:

```javascript
// Mock data
let claims = [
    { id: '1', /* ... */ },
    { id: '2', /* ... */ }
];

const policyHolders = { /* ... */ };
const damageReports = { /* ... */ };
const liabilityReports = { /* ... */ };
const repairEstimates = { /* ... */ };
```

*   **What this means:** All the data for claims, policyholders, etc., is held in simple JavaScript arrays and objects. This collection of data acts as a temporary, "mock" database.
*   **Volatility:** This data is **volatile**. If you stop and restart the server, any changes you made (like updating a claim's status) will be lost, and the data will reset to its original state as defined in the code.

### 2. How the GraphQL API Returns and Updates Data

The logic is handled by **resolvers**, which are functions that "resolve" a query or mutation by fetching or modifying data.

#### How Queries Work (Fetching Data)

When you send a query like `getClaim(id: "1")`, the following happens:

1.  **Apollo Server** receives the query and identifies that it needs to run the `getClaim` resolver.
2.  **The Resolver Executes:** It runs the code defined for `getClaim`:
    ```javascript
    getClaim: (parent, { id }) => claims.find(claim => claim.id === id)
    ```
3.  **Data Retrieval:** This function uses the standard JavaScript `find()` method to search through the `claims` array in memory.
4.  **Data is Returned:** Once it finds the matching claim object, it returns it. Apollo Server then shapes this object into the JSON response.

#### How Mutations Work (Updating Data)

When you send a mutation like `updateClaimStatus(id: "1", status: "In Progress")`:

1.  **Apollo Server** receives the mutation and calls the `updateClaimStatus` resolver.
2.  **The Resolver Executes:** It runs this code:
    ```javascript
    updateClaimStatus: (parent, { id, status }) => {
        const claim = claims.find(claim => claim.id === id); // 1. Find the claim
        if (!claim) {
            throw new Error('Claim not found');
        }
        claim.status = status; // 2. Modify the object directly
        return claim; // 3. Return the updated object
    }
    ```
3.  **Data Modification:** The resolver finds the correct claim object within the `claims` array and directly changes its `status` property.

### Summary and Next Steps for a Real Application

| Aspect      | Current Implementation (Mock)      | Real-World Application (Production)                               |
| :---------- | :--------------------------------- | :---------------------------------------------------------------- |
| **Storage**   | In-memory JavaScript variables.    | A persistent database (e.g., PostgreSQL, MongoDB, DynamoDB).      |
| **Data State**| Volatile (resets on server restart). | Persistent (data is saved permanently).                           |
| **Resolvers** | Manipulate local arrays/objects.   | Execute database queries (e.g., `SELECT * FROM claims...` or `db.claims.findOne(...)`). |

For a production environment, the next step would be to replace the in-memory mock data with a real database connection. The resolver logic would be updated to interact with that database, but the GraphQL schema and the queries you use in Postman would remain exactly the same.
