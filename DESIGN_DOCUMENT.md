# Claims Management Application - Design Document

## 1. Overview

This document outlines the technical design and architecture of the Claims Management application. The project is a full-stack web application designed to allow claims adjusters and operations teams to perform Create, Read, Update, and Delete (CRUD) operations on insurance claims.

The system consists of a React-based frontend user interface and a GraphQL API backend powered by Node.js and Apollo Server.

## 2. System Architecture

The application follows a standard client-server architecture.

-   **Frontend (Client):** A single-page application (SPA) built with React. It handles user interaction, view rendering, and communication with the backend. It uses the Apollo Client library to manage GraphQL queries and mutations.
-   **Backend (Server):** A Node.js server using the Express framework. It hosts an Apollo Server instance to expose a GraphQL API. It is responsible for all business logic and data manipulation. For this project, it uses a simple in-memory data source.

### Architectural Diagram

Here is a diagram illustrating the flow of data and control within the application:

```mermaid
graph TD
    A[User's Browser] -- Interacts with --> B(React UI);
    B -- Sends GraphQL Queries/Mutations --> C{Apollo Client};
    C -- HTTP Request --> D[Node.js Server (Express)];
    D -- Handles Request --> E{Apollo Server};
    E -- Executes --> F[GraphQL Resolvers];
    F -- Accesses/Modifies --> G[In-Memory Data Source];
    G -- Returns Data --> F;
    F -- Returns Data --> E;
    E -- Returns Data --> D;
    D -- HTTP Response --> C;
    C -- Updates Cache & UI --> B;
end
```

## 3. Backend Features (GraphQL API)

The API is the core of the application, providing all necessary operations for managing claims and policyholders.

### Data Models (Schema)

-   **`Claim`**: Represents a single insurance claim.
    -   `id`: Unique identifier.
    -   `policyNumber`: The associated policy number.
    -   `dateOfLoss`: The date the loss occurred.
    -   `status`: The current status of the claim (e.g., 'Open', 'Closed').
    -   `policyHolder`: The associated policyholder (nested object).
    -   `damageReports`: A text field for damage report details.
    -   `liabilityReports`: A text field for liability report details.
    -   `repairEstimates`: A text field for repair estimate details.
-   **`PolicyHolder`**: Represents the person who holds the policy.
    -   `id`: Unique identifier.
    -   `name`: The name of the policyholder.
    -   `address`: The address of the policyholder.

### API Endpoints (Queries & Mutations)

-   **Queries (Fetching Data):**
    -   `getAllClaims`: Retrieves a list of all claims.
    -   `getClaim(id: ID!)`: Retrieves a single claim by its ID.

-   **Mutations (Modifying Data):**
    -   `addClaim(claimInput: ClaimInput!)`: Creates a new claim.
    -   `updateClaimDetails(id: ID!, claimInput: UpdateClaimInput!)`: Updates the details of an existing claim.
    -   `updateClaimStatus(id: ID!, status: String!)`: Updates only the status of a claim.
    -   `deleteClaim(id: ID!)`: Deletes a claim.
    -   `addPolicyHolder(policyHolderInput: PolicyHolderInput!)`: Creates a new policyholder.

## 4. Frontend Features (React UI)

The user interface is designed to be intuitive and user-friendly, providing a seamless experience for managing claims.

-   **Claims Dashboard (`/`)**
    -   Displays a list of all claims in a clear, tabular format.
    -   Each entry shows key information like Policy Number, Date of Loss, and Status.
    -   Users can click on any claim to navigate to its details page.
    -   Provides a button to navigate to the "Add Claim" page.

-   **Claim Details Page (`/claim/:id`)**
    -   Displays all information for a single, selected claim.
    -   Shows policyholder details and all report/estimate information.
    -   Provides buttons to **Edit** or **Delete** the claim.

-   **Add Claim Page (`/add-claim`)**
    -   A comprehensive form for creating a new claim.
    -   Allows for the inline creation of a new policyholder by entering their name and address.
    -   Includes text areas for adding details about Damage Reports, Liability Reports, and Repair Estimates.

-   **Edit Claim Page (`/claim/:id/edit`)**
    -   A form pre-populated with the details of an existing claim.
    -   Allows the user to modify all claim details, including the status and associated reports.
