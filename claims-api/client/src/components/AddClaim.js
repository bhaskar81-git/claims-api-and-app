import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { GET_ALL_CLAIMS } from './ClaimsList'; // Import the query
import { useNavigate } from 'react-router-dom';

const ADD_POLICY_HOLDER = gql`
  mutation AddPolicyHolder($policyHolderInput: PolicyHolderInput!) {
    addPolicyHolder(policyHolderInput: $policyHolderInput) {
      id
      name
      address
    }
  }
`;

const ADD_CLAIM = gql`
  mutation AddClaim($claimInput: ClaimInput!) {
    addClaim(claimInput: $claimInput) {
      id
      policyNumber
      dateOfLoss
      policyHolderId
      damageReports
      liabilityReports
      repairEstimates
    }
  }
`;

function AddClaim() {
  const [formState, setFormState] = useState({
    policyNumber: '',
    dateOfLoss: '',
    policyHolderName: '',
    policyHolderAddress: '',
    damageReports: '',
    liabilityReports: '',
    repairEstimates: '',
  });
  const navigate = useNavigate();

  const [addPolicyHolder, { loading: policyHolderLoading, error: policyHolderError }] = useMutation(ADD_POLICY_HOLDER);
  const [addClaim, { loading: claimLoading, error: claimError }] = useMutation(ADD_CLAIM, {
    refetchQueries: [{ query: GET_ALL_CLAIMS }], // Correctly refetch
    onCompleted: () => navigate('/'),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // First, create the new policy holder
      const { data: policyHolderData } = await addPolicyHolder({
        variables: {
          policyHolderInput: {
            name: formState.policyHolderName,
            address: formState.policyHolderAddress,
          },
        },
      });

      // Then, use the new policy holder's ID to create the claim
      if (policyHolderData?.addPolicyHolder?.id) {
        await addClaim({
          variables: {
            claimInput: {
              policyNumber: formState.policyNumber,
              dateOfLoss: formState.dateOfLoss,
              policyHolderId: policyHolderData.addPolicyHolder.id,
              damageReports: formState.damageReports,
              liabilityReports: formState.liabilityReports,
              repairEstimates: formState.repairEstimates,
            },
          },
        });
      }
    } catch (err) {
      // Error handling is captured by the useMutation hook's error state
      console.error('Error during submission process:', err);
    }
  };

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  if (policyHolderLoading || claimLoading) return <p>Submitting...</p>;
  if (policyHolderError || claimError) return <p>Submission error! {policyHolderError?.message || claimError?.message}</p>;

  return (
    <div className="form-container">
      <h2>Add New Claim</h2>
      <form onSubmit={handleSubmit}>
        <input
          value={formState.policyNumber}
          onChange={handleChange}
          type="text"
          name="policyNumber"
          placeholder="Policy Number"
          required
        />
        <input
          value={formState.dateOfLoss}
          onChange={handleChange}
          type="date"
          name="dateOfLoss"
          placeholder="Date of Loss"
          required
        />
        <h3>Policy Holder Details</h3>
        <input
          type="text"
          name="policyHolderName"
          placeholder="Policy Holder Name"
          value={formState.policyHolderName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="policyHolderAddress"
          placeholder="Policy Holder Address"
          value={formState.policyHolderAddress}
          onChange={handleChange}
        />

        <h3>Claim Reports & Estimates</h3>
        <textarea
          name="damageReports"
          placeholder="Damage Reports"
          value={formState.damageReports}
          onChange={handleChange}
        />
        <textarea
          name="liabilityReports"
          placeholder="Liability Reports"
          value={formState.liabilityReports}
          onChange={handleChange}
        />
        <textarea
          name="repairEstimates"
          placeholder="Repair Estimates"
          value={formState.repairEstimates}
          onChange={handleChange}
        />
        <div className="form-actions">
          <button type="submit" className="button-primary">Add Claim</button>
          <button type="button" onClick={() => navigate('/')}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default AddClaim;
