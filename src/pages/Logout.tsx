import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const Logout: React.FC = () => {
  const history = useHistory();

  useEffect(() => {
    const logout = async () => {
      try {
        // Make the API call to logout
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('action', 'logout');
        formData.append('token', token);

        await axios.post('https://guard.ghamasaana.com/guard_new_api/logout.php', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        // Clear local storage data
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');

        // Redirect to login page
        history.push('/pages/login');
      } catch (error) {
        console.error('Error logging out:', error);
        // Handle the error as needed
      }
    };

    logout();
  }, [history]);

  return null; // No UI needed for logout
};

export default Logout;
