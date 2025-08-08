import React from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { useParams, Link, useNavigate } from 'react-router-dom';

const DELETE_CLAIM = gql`
  mutation DeleteClaim($id: ID!) {
    deleteClaim(id: $id) {
      id
    }
  }
`;

const GET_ALL_CLAIMS = gql`
  query GetAllClaims {
    getAllClaims {
      id
    }
  }
`;

const GET_CLAIM_DETAILS = gql`
  query GetClaim($id: ID!) {
    getClaim(id: $id) {
      id
      policyNumber
      status
      dateOfLoss
      policyHolder {
        name
        address
      }
      damageReports
      liabilityReports
      repairEstimates
    }
  }
`;

function ClaimDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(GET_CLAIM_DETAILS, { variables: { id } });

  const [deleteClaim] = useMutation(DELETE_CLAIM, {
    refetchQueries: [{ query: GET_ALL_CLAIMS }],
    onCompleted: () => navigate('/'),
  });

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this claim?')) {
      deleteClaim({ variables: { id } });
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const { getClaim: claim } = data;

  return (
    <div className="claim-details">
      <div className="details-header">
        <h2>Claim Details</h2>
        <div className="details-actions">
          <button onClick={() => navigate(`/claim/${id}/edit`)} className="button-primary">Edit Claim</button>
          <button onClick={handleDelete} className="button-danger">Delete Claim</button>
          <Link to="/" className="back-link">Back to Claims List</Link>
        </div>
      </div>
      <div className="details-grid">
        <div className="detail-item"><strong>ID:</strong> {claim.id}</div>
        <div className="detail-item"><strong>Policy Number:</strong> {claim.policyNumber}</div>
        <div className="detail-item"><strong>Status:</strong> {claim.status}</div>
        <div className="detail-item"><strong>Date of Loss:</strong> {claim.dateOfLoss}</div>
        {claim.policyHolder ? (
          <div className="detail-section full-width">
            <h3>Policy Holder</h3>
            <p><strong>Name:</strong> {claim.policyHolder.name}</p>
            <p><strong>Address:</strong> {claim.policyHolder.address}</p>
          </div>
        ) : (
          <div className="detail-section full-width">
            <h3>Policy Holder</h3>
            <p>No policy holder data available for this claim.</p>
          </div>
        )}

        {claim.damageReports && <div className="detail-section full-width">
          <h3>Damage Reports</h3>
          <p>{claim.damageReports}</p>
        </div>}

        {claim.liabilityReports && <div className="detail-section full-width">
          <h3>Liability Reports</h3>
          <p>{claim.liabilityReports}</p>
        </div>}

        {claim.repairEstimates && <div className="detail-section full-width">
          <h3>Repair Estimates</h3>
          <p>{claim.repairEstimates}</p>
        </div>}
      </div>
    </div>
  );
}

export default ClaimDetails;
