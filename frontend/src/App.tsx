import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import Global from './styles/global';
import Routes from './routes';

import AppProvider from './hooks';

function App(): JSX.Element {
  return (
    <>
      <BrowserRouter>
        <AppProvider>
          <Routes />
          <Global />
        </AppProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
