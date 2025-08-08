const { v4: uuidv4 } = require('uuid');

const policyHolders = [
    { id: '101', name: 'John Doe', address: '123 Main St, Anytown, USA' },
    { id: '102', name: 'Jane Smith', address: '456 Oak Ave, Otherville, USA' },
];

const claims = [
    {
        id: '1',
        policyNumber: 'P123456789',
        policyHolderId: '101',
        dateOfLoss: '2024-07-20',
        status: 'Open',
    },
    {
        id: '2',
        policyNumber: 'P987654321',
        policyHolderId: '102',
        dateOfLoss: '2024-07-15',
        status: 'Closed',
    },
];



// Export a function that returns a fresh copy of the data to avoid in-memory modifications between tests
const createDataSource = () => ({
    policyHolders: JSON.parse(JSON.stringify(policyHolders)),
    claims: JSON.parse(JSON.stringify(claims)),
    uuidv4,
});

module.exports = { createDataSource };
