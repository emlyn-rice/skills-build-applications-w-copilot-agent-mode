import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { API_BASE_URL } from '../api';

const formatLabel = (key) => key
  .replace(/_/g, ' ')
  .replace(/([a-z])([A-Z])/g, '$1 $2')
  .replace(/\b\w/g, (char) => char.toUpperCase());

const formatValue = (value) => {
  if (value === null || value === undefined || value === '') {
    return '—';
  }

  if (Array.isArray(value)) {
    return value.length > 0 ? value.map((item) => formatValue(item)).join(', ') : '—';
  }

  if (typeof value === 'object') {
    return Object.entries(value)
      .map(([key, nestedValue]) => `${formatLabel(key)}: ${formatValue(nestedValue)}`)
      .join('; ');
  }

  return String(value);
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const endpoint = `${API_BASE_URL}users/`;

  const fetchUsers = useCallback(() => {
    fetch(endpoint)
      .then(res => res.json())
      .then(data => {
        const results = data.results || data;
        setUsers(results);
        console.log('Users endpoint:', endpoint);
        console.log('Fetched users:', results);
      })
      .catch(err => console.error('Error fetching users:', err));
  }, [endpoint]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const columns = useMemo(() => {
    const keySet = new Set();

    users.forEach((user) => {
      if (user && typeof user === 'object') {
        Object.keys(user).forEach((key) => keySet.add(key));
      }
    });

    const preferredOrder = ['id', 'username', 'email', 'name'];
    const orderedPreferred = preferredOrder.filter((key) => keySet.has(key));
    const alphabeticalRemainder = [...keySet].filter((key) => !preferredOrder.includes(key)).sort();

    return [...orderedPreferred, ...alphabeticalRemainder];
  }, [users]);

  const filteredUsers = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();
    return users.filter((user) => columns.some((column) => formatValue(user?.[column]).toLowerCase().includes(lowerSearch)));
  }, [columns, searchTerm, users]);

  return (
    <div className="card page-card">
      <div className="card-body text-start">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
          <h2 className="h3 mb-0">Users</h2>
          <a className="link-primary" href={endpoint} target="_blank" rel="noreferrer">API endpoint</a>
        </div>

        <form className="row g-2 mb-3" onSubmit={(event) => event.preventDefault()}>
          <div className="col-md-8">
            <input
              type="text"
              className="form-control"
              placeholder="Search users"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
          <div className="col-md-4 d-grid">
            <button type="button" className="btn btn-primary" onClick={fetchUsers}>Refresh Users</button>
          </div>
        </form>

        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th scope="col" style={{ width: '70px' }}>#</th>
                {columns.map((column) => (
                  <th key={column} scope="col">{formatLabel(column)}</th>
                ))}
                <th scope="col" className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? filteredUsers.map((user, idx) => (
                <tr key={user.id || idx}>
                  <th scope="row">{idx + 1}</th>
                  {columns.map((column) => (
                    <td key={`${user.id || idx}-${column}`} className="table-cell-truncate">{formatValue(user?.[column])}</td>
                  ))}
                  <td className="text-end">
                    <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => setSelectedUser(user)}>View</button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={columns.length + 2} className="text-center py-4">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedUser && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h3 className="modal-title h5 mb-0">User Details</h3>
                  <button type="button" className="btn-close" aria-label="Close" onClick={() => setSelectedUser(null)}></button>
                </div>
                <div className="modal-body">
                  <div className="container-fluid">
                    {columns.map((column) => (
                      <div key={column} className="row py-2 border-bottom">
                        <div className="col-sm-4 fw-semibold">{formatLabel(column)}</div>
                        <div className="col-sm-8">{formatValue(selectedUser?.[column])}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setSelectedUser(null)}>Close</button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" onClick={() => setSelectedUser(null)}></div>
        </>
      )}
    </div>
  );
};

export default Users;
