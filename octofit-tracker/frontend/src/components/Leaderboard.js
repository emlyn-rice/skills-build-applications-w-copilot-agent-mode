import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { apiEndpoint } from '../api';

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

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLeader, setSelectedLeader] = useState(null);
  const endpoint = apiEndpoint('/leaderboard/');

  const fetchLeaderboard = useCallback(() => {
    fetch(endpoint)
      .then(res => res.json())
      .then(data => {
        const results = data.results || data;
        setLeaders(results);
        console.log('Leaderboard endpoint:', endpoint);
        console.log('Fetched leaderboard:', results);
      })
      .catch(err => console.error('Error fetching leaderboard:', err));
  }, [endpoint]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const columns = useMemo(() => {
    const keySet = new Set();

    leaders.forEach((leader) => {
      if (leader && typeof leader === 'object') {
        Object.keys(leader).forEach((key) => keySet.add(key));
      }
    });

    const preferredOrder = ['id', 'team', 'points'];
    const orderedPreferred = preferredOrder.filter((key) => keySet.has(key));
    const alphabeticalRemainder = [...keySet].filter((key) => !preferredOrder.includes(key)).sort();

    return [...orderedPreferred, ...alphabeticalRemainder];
  }, [leaders]);

  const filteredLeaders = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();
    return leaders.filter((leader) => columns.some((column) => formatValue(leader?.[column]).toLowerCase().includes(lowerSearch)));
  }, [columns, leaders, searchTerm]);

  return (
    <div className="card page-card">
      <div className="card-body text-start">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
          <h2 className="h3 mb-0">Leaderboard</h2>
          <a className="link-primary" href={endpoint} target="_blank" rel="noreferrer">API endpoint</a>
        </div>

        <form className="row g-2 mb-3" onSubmit={(event) => event.preventDefault()}>
          <div className="col-md-8">
            <input
              type="text"
              className="form-control"
              placeholder="Search leaderboard"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
          <div className="col-md-4 d-grid">
            <button type="button" className="btn btn-primary" onClick={fetchLeaderboard}>Refresh Leaderboard</button>
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
              {filteredLeaders.length > 0 ? filteredLeaders.map((leader, idx) => (
                <tr key={leader.id || idx}>
                  <th scope="row">{idx + 1}</th>
                  {columns.map((column) => (
                    <td key={`${leader.id || idx}-${column}`} className="table-cell-truncate">{formatValue(leader?.[column])}</td>
                  ))}
                  <td className="text-end">
                    <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => setSelectedLeader(leader)}>View</button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={columns.length + 2} className="text-center py-4">No leaderboard results found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedLeader && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h3 className="modal-title h5 mb-0">Leaderboard Entry</h3>
                  <button type="button" className="btn-close" aria-label="Close" onClick={() => setSelectedLeader(null)}></button>
                </div>
                <div className="modal-body">
                  <div className="container-fluid">
                    {columns.map((column) => (
                      <div key={column} className="row py-2 border-bottom">
                        <div className="col-sm-4 fw-semibold">{formatLabel(column)}</div>
                        <div className="col-sm-8">{formatValue(selectedLeader?.[column])}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setSelectedLeader(null)}>Close</button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" onClick={() => setSelectedLeader(null)}></div>
        </>
      )}
    </div>
  );
};

export default Leaderboard;
