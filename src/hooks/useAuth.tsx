import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const useAuth = () => {
  const history = useHistory();

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log(token, "isLoggedIn");
    if (token !== "null") {
        console.log("not coming here")
      history.push('/pages/Login');
    } else{
        console.log(" coming here")
    }
  }, []);
};

export default useAuth;
