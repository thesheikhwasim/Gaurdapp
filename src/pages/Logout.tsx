import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { BASEURL } from '../utilities_constant';
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

        await axios.post(BASEURL+'logout.php', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        // Clear local storage data
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        localStorage.removeItem('photosData');
        localStorage.removeItem('guardalertkey');

        // Redirect to login page
        history.push('/pages/login');
        window.location.reload()
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
