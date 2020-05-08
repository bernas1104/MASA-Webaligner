import React from 'react';

import Header from '../../components/Header';
import { Container } from './styles';

const Alignment: React.FC = () => {
  return (
    <>
      <Header />
      <Container>
        <h1>Hello, Alignments!</h1>
      </Container>
    </>
  );
};

export default Alignment;
