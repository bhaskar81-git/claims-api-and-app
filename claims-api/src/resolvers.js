const createResolvers = (dataSource) => ({
  Query: {
    getAllClaims: () => dataSource.claims,
    getClaim: (parent, { id }) => dataSource.claims.find(claim => claim.id == id),
    
  },
  Mutation: {
    updateClaimStatus: (parent, { id, status }) => {
      const claim = dataSource.claims.find(claim => claim.id === id);
      if (!claim) {
        throw new Error('Claim not found');
      }
      claim.status = status;
      return claim;
    },
    addClaim: (parent, { claimInput }) => {
      const newClaim = {
        id: dataSource.uuidv4(),
        policyNumber: claimInput.policyNumber,
        dateOfLoss: claimInput.dateOfLoss,
        policyHolderId: claimInput.policyHolderId,
        status: 'Open', // Always default to Open
        damageReports: claimInput.damageReports || '',
        liabilityReports: claimInput.liabilityReports || '',
        repairEstimates: claimInput.repairEstimates || '',
      };
      dataSource.claims.push(newClaim);
      return newClaim;
    },
    updateClaimDetails: (parent, { id, claimInput }) => {
      console.log('--- ENTERING updateClaimDetails ---');
      console.log('Received ID:', id);
      console.log('Received claimInput:', JSON.stringify(claimInput, null, 2));
      const claimIndex = dataSource.claims.findIndex(claim => claim.id === id);
      console.log('Found claimIndex:', claimIndex);
      if (claimIndex === -1) {
        console.error('Claim not found for update!');
        throw new Error('Claim not found');
      }
      const originalClaim = dataSource.claims[claimIndex];
      const updatedClaim = { ...originalClaim, ...claimInput };
      dataSource.claims[claimIndex] = updatedClaim;
      console.log('Returning updatedClaim:', JSON.stringify(updatedClaim, null, 2));
      console.log('--- EXITING updateClaimDetails ---');
      return updatedClaim;
    },
    deleteClaim: (parent, { id }) => {
      const claimIndex = dataSource.claims.findIndex(claim => claim.id === id);
      if (claimIndex === -1) {
        throw new Error('Claim not found');
      }
      const deletedClaim = dataSource.claims.splice(claimIndex, 1);
      return deletedClaim[0];
    },
    addPolicyHolder: (parent, { policyHolderInput }) => {
      const newId = String(dataSource.policyHolders.length + 1);
      const newPolicyHolder = {
        id: newId,
        ...policyHolderInput,
      };
      dataSource.policyHolders.push(newPolicyHolder);
      return newPolicyHolder;
    },
  },
  Claim: {
    policyHolder: (claim) => dataSource.policyHolders.find(ph => ph.id === claim.policyHolderId),
  },
});

module.exports = createResolvers;
