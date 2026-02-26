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

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const endpoint = apiEndpoint('/teams/');

  const fetchTeams = useCallback(() => {
    fetch(endpoint)
      .then(res => res.json())
      .then(data => {
        const results = data.results || data;
        setTeams(results);
        console.log('Teams endpoint:', endpoint);
        console.log('Fetched teams:', results);
      })
      .catch(err => console.error('Error fetching teams:', err));
  }, [endpoint]);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  const columns = useMemo(() => {
    const keySet = new Set();

    teams.forEach((team) => {
      if (team && typeof team === 'object') {
        Object.keys(team).forEach((key) => keySet.add(key));
      }
    });

    const preferredOrder = ['id', 'name'];
    const orderedPreferred = preferredOrder.filter((key) => keySet.has(key));
    const alphabeticalRemainder = [...keySet].filter((key) => !preferredOrder.includes(key)).sort();

    return [...orderedPreferred, ...alphabeticalRemainder];
  }, [teams]);

  const filteredTeams = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();
    return teams.filter((team) => columns.some((column) => formatValue(team?.[column]).toLowerCase().includes(lowerSearch)));
  }, [columns, searchTerm, teams]);

  return (
    <div className="card page-card">
      <div className="card-body text-start">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
          <h2 className="h3 mb-0">Teams</h2>
          <a className="link-primary" href={endpoint} target="_blank" rel="noreferrer">API endpoint</a>
        </div>

        <form className="row g-2 mb-3" onSubmit={(event) => event.preventDefault()}>
          <div className="col-md-8">
            <input
              type="text"
              className="form-control"
              placeholder="Search teams"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
          <div className="col-md-4 d-grid">
            <button type="button" className="btn btn-primary" onClick={fetchTeams}>Refresh Teams</button>
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
              {filteredTeams.length > 0 ? filteredTeams.map((team, idx) => (
                <tr key={team.id || idx}>
                  <th scope="row">{idx + 1}</th>
                  {columns.map((column) => (
                    <td key={`${team.id || idx}-${column}`} className="table-cell-truncate">{formatValue(team?.[column])}</td>
                  ))}
                  <td className="text-end">
                    <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => setSelectedTeam(team)}>View</button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={columns.length + 2} className="text-center py-4">No teams found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedTeam && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h3 className="modal-title h5 mb-0">Team Details</h3>
                  <button type="button" className="btn-close" aria-label="Close" onClick={() => setSelectedTeam(null)}></button>
                </div>
                <div className="modal-body">
                  <div className="container-fluid">
                    {columns.map((column) => (
                      <div key={column} className="row py-2 border-bottom">
                        <div className="col-sm-4 fw-semibold">{formatLabel(column)}</div>
                        <div className="col-sm-8">{formatValue(selectedTeam?.[column])}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setSelectedTeam(null)}>Close</button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" onClick={() => setSelectedTeam(null)}></div>
        </>
      )}
    </div>
  );
};

export default Teams;
