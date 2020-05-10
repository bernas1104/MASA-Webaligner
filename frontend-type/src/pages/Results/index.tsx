import React from 'react';

import { Container } from './styles';

import Header from '../../components/Header';

const Results: React.FC = () => {
  return (
    <>
      <Header />
      <Container>
        <h1>Hello, results!</h1>
      </Container>
    </>
  );
};

export default Results;
