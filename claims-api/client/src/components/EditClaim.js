import React, { useState, useEffect } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { useParams, useNavigate } from 'react-router-dom';

const GET_CLAIM_DETAILS = gql`
  query GetClaim($id: ID!) {
    getClaim(id: $id) {
      id
      policyNumber
      dateOfLoss
      policyHolderId
      status
    }
  }
`;

const UPDATE_CLAIM_DETAILS = gql`
  mutation UpdateClaimDetails($id: ID!, $claimInput: UpdateClaimInput!) {
    updateClaimDetails(id: $id, claimInput: $claimInput) {
      id
      policyNumber
      dateOfLoss
      policyHolderId
    }
  }
`;

const UPDATE_CLAIM_STATUS = gql`
  mutation UpdateClaimStatus($id: ID!, $status: String!) {
    updateClaimStatus(id: $id, status: $status) {
      id
      status
    }
  }
`;

function EditClaim() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formState, setFormState] = useState({ policyNumber: '', dateOfLoss: '', policyHolderId: '', status: '' });

  const { data: queryData, loading: queryLoading, error: queryError } = useQuery(GET_CLAIM_DETAILS, { variables: { id } });
  const [updateClaimDetails, { loading: detailsLoading, error: detailsError }] = useMutation(UPDATE_CLAIM_DETAILS);
  const [updateClaimStatus, { loading: statusLoading, error: statusError }] = useMutation(UPDATE_CLAIM_STATUS);

  const [originalStatus, setOriginalStatus] = useState('');

  useEffect(() => {
    if (queryData && queryData.getClaim) {
      const { policyNumber, dateOfLoss, policyHolderId, status } = queryData.getClaim;
      setFormState({ policyNumber, dateOfLoss, policyHolderId, status });
      setOriginalStatus(status);
    }
  }, [queryData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { status, ...detailsInput } = formState;

    const promises = [];

    // Only call updateClaimDetails if other details have changed
    if (detailsInput.policyNumber !== queryData.getClaim.policyNumber || 
        detailsInput.dateOfLoss !== queryData.getClaim.dateOfLoss || 
        detailsInput.policyHolderId !== queryData.getClaim.policyHolderId) {
      const { __typename, ...cleanDetailsInput } = detailsInput;
      promises.push(updateClaimDetails({ variables: { id, claimInput: cleanDetailsInput } }));
    }

    // Only call updateClaimStatus if the status has changed
    if (status !== originalStatus) {
      promises.push(updateClaimStatus({ variables: { id, status } }));
    }

    try {
      await Promise.all(promises);
      navigate(`/claim/${id}`);
    } catch (err) {
      // Error is already handled by the mutation's error state
      console.error('Update failed', err);
    }
  };

  if (queryLoading) return <p>Loading...</p>;
  if (queryError) return <p>Error loading data: {queryError.message}</p>;
  if (detailsLoading || statusLoading) return <p>Updating...</p>;
  if (detailsError || statusError) return <p>Update error! {detailsError?.message || statusError?.message}</p>;

  return (
    <div className="form-container">
      <h2>Edit Claim</h2>
      <form onSubmit={handleSubmit}>
        <input
          value={formState.policyNumber}
          onChange={(e) => setFormState({ ...formState, policyNumber: e.target.value })}
          type="text"
          placeholder="Policy Number"
          required
        />
        <input
          value={formState.dateOfLoss}
          onChange={(e) => setFormState({ ...formState, dateOfLoss: e.target.value })}
          type="date"
          placeholder="Date of Loss"
          required
        />
        <input
          value={formState.policyHolderId}
          onChange={(e) => setFormState({ ...formState, policyHolderId: e.target.value })}
          type="text"
          placeholder="Policy Holder ID"
          required
        />
        <select
          value={formState.status}
          onChange={(e) => setFormState({ ...formState, status: e.target.value })}
          required
        >
          <option value="" disabled>Select Status</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Closed">Closed</option>
        </select>
        <div className="form-actions">
          <button type="submit" className="button-primary">Save Changes</button>
          <button type="button" onClick={() => navigate(`/claim/${id}`)}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default EditClaim;
