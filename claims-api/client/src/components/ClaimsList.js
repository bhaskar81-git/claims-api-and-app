import React from 'react';
import { gql, useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

export const GET_ALL_CLAIMS = gql`
  query GetAllClaims {
    getAllClaims {
      id
      policyNumber
      status
      dateOfLoss
    }
  }
`;

function ClaimsList() {
  const { loading, error, data } = useQuery(GET_ALL_CLAIMS);
  const navigate = useNavigate();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleRowClick = (id) => {
    navigate(`/claim/${id}`);
  };

  return (
    <div>
      <div className="claims-list-header">
        <h2>All Claims</h2>
        <button onClick={() => navigate('/add-claim')} className="button-primary">Add New Claim</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Policy Number</th>
            <th>Status</th>
            <th>Date of Loss</th>
          </tr>
        </thead>
        <tbody>
          {data.getAllClaims.map(({ id, policyNumber, status, dateOfLoss }) => (
            <tr key={id} onClick={() => handleRowClick(id)}>
              <td>{id}</td>
              <td>{policyNumber}</td>
              <td>{status}</td>
              <td>{dateOfLoss}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ClaimsList;
