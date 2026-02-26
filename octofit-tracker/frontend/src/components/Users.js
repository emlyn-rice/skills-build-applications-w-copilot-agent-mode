import React, { useEffect, useState } from 'react';
import { apiEndpoint } from '../api';

const Users = () => {
  const [users, setUsers] = useState([]);
  const endpoint = apiEndpoint('/users/');

  useEffect(() => {
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

  return (
    <div>
      <h2>Users</h2>
      <ul>
        {users.map((user, idx) => (
          <li key={user.id || idx}>{user.name || JSON.stringify(user)}</li>
        ))}
      </ul>
    </div>
  );
};

export default Users;
