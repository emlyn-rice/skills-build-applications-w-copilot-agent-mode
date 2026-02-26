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

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const endpoint = apiEndpoint('/workouts/');

  const fetchWorkouts = useCallback(() => {
    fetch(endpoint)
      .then(res => res.json())
      .then(data => {
        const results = data.results || data;
        setWorkouts(results);
        console.log('Workouts endpoint:', endpoint);
        console.log('Fetched workouts:', results);
      })
      .catch(err => console.error('Error fetching workouts:', err));
  }, [endpoint]);

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  const columns = useMemo(() => {
    const keySet = new Set();

    workouts.forEach((workout) => {
      if (workout && typeof workout === 'object') {
        Object.keys(workout).forEach((key) => keySet.add(key));
      }
    });

    const preferredOrder = ['id', 'user', 'suggestion'];
    const orderedPreferred = preferredOrder.filter((key) => keySet.has(key));
    const alphabeticalRemainder = [...keySet].filter((key) => !preferredOrder.includes(key)).sort();

    return [...orderedPreferred, ...alphabeticalRemainder];
  }, [workouts]);

  const filteredWorkouts = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();
    return workouts.filter((workout) => columns.some((column) => formatValue(workout?.[column]).toLowerCase().includes(lowerSearch)));
  }, [columns, searchTerm, workouts]);

  return (
    <div className="card page-card">
      <div className="card-body text-start">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
          <h2 className="h3 mb-0">Workouts</h2>
          <a className="link-primary" href={endpoint} target="_blank" rel="noreferrer">API endpoint</a>
        </div>

        <form className="row g-2 mb-3" onSubmit={(event) => event.preventDefault()}>
          <div className="col-md-8">
            <input
              type="text"
              className="form-control"
              placeholder="Search workouts"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
          <div className="col-md-4 d-grid">
            <button type="button" className="btn btn-primary" onClick={fetchWorkouts}>Refresh Workouts</button>
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
              {filteredWorkouts.length > 0 ? filteredWorkouts.map((workout, idx) => (
                <tr key={workout.id || idx}>
                  <th scope="row">{idx + 1}</th>
                  {columns.map((column) => (
                    <td key={`${workout.id || idx}-${column}`} className="table-cell-truncate">{formatValue(workout?.[column])}</td>
                  ))}
                  <td className="text-end">
                    <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => setSelectedWorkout(workout)}>View</button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={columns.length + 2} className="text-center py-4">No workouts found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedWorkout && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h3 className="modal-title h5 mb-0">Workout Details</h3>
                  <button type="button" className="btn-close" aria-label="Close" onClick={() => setSelectedWorkout(null)}></button>
                </div>
                <div className="modal-body">
                  <div className="container-fluid">
                    {columns.map((column) => (
                      <div key={column} className="row py-2 border-bottom">
                        <div className="col-sm-4 fw-semibold">{formatLabel(column)}</div>
                        <div className="col-sm-8">{formatValue(selectedWorkout?.[column])}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setSelectedWorkout(null)}>Close</button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" onClick={() => setSelectedWorkout(null)}></div>
        </>
      )}
    </div>
  );
};

export default Workouts;
