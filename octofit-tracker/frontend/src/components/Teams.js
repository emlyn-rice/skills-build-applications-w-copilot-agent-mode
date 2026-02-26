import React, { useEffect, useState } from 'react';
import { apiEndpoint } from '../api';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const endpoint = apiEndpoint('/teams/');

  useEffect(() => {
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

  return (
    <div>
      <h2>Teams</h2>
      <ul>
        {teams.map((team, idx) => (
          <li key={team.id || idx}>{team.name || JSON.stringify(team)}</li>
        ))}
      </ul>
    </div>
  );
};

export default Teams;
