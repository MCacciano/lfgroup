import { useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import lfg from './axios/lfgroup';

import useUserContext from './hooks/useUserCtx';

import AuthRoute from './components/AuthRoute';
import Navbar from './components/Navbar';

import Home from './pages/Home';
import Login from './pages/Login';
import Groups from './pages/Groups';

const App = () => {
  const { user, setUser, isLoading, setIsLoading } = useUserContext();

  // user token is being set in localStorage so we can log the
  // user back in on page refresh
  // TODO: Set the token to expire in 1 hour
  // TODO: Delete the token from localStorage on logout
  useEffect(() => {
    if (!user) {
      const getUser = async () => {
        const cachedUserToken = localStorage.getItem('lfg_user');

        if (cachedUserToken) {
          try {
            const { data } = await lfg.get('/auth/me', {
              headers: {
                Authorization: `Bearer ${cachedUserToken}`
              }
            });

            setUser(data.data);
          } catch (err) {
            console.error(err);
          }
        } else {
          setIsLoading(false);
        }
      };

      getUser();
    }
    // only on mount
    // eslint-disable-next-line
  }, []);

  if (isLoading) return null;

  return (
    <>
      <Navbar />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={Login} />
        <AuthRoute path="/groups" component={Groups} />
      </Switch>
    </>
  );
};

export default App;
