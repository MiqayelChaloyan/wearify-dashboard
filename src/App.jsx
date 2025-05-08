import React, { useLayoutEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

import ProtectedRoute from './layout';

// Auth pages
import SignIn from './pages/auth/signIn';

// SignIn pages
import ResponsiveDrawer from './pages/dashboard/main';

import { PAGES } from './constants/pages';


const Wrapper = ({ children }) => {
  const location = useLocation();

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);

  return children;
};

function App() {
  return (
    <Wrapper>
      <Routes>
        <Route path={PAGES.SIGN_IN} element={<SignIn />} />
        {/* <Route path={PAGES.RESET_PASSWORD} element={<ResetPassword />} /> */}
        <Route
          path={PAGES.MAIN}
          element={
            <ProtectedRoute>
              <ResponsiveDrawer />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Wrapper>
  );
};

export default App;
