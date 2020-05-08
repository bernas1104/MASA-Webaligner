import React from 'react';

import { Container } from './styles';

const CheckboxInput: React.FC = () => {
  return (
    <Container>
      <label htmlFor="lorem">Lorem Ipsum</label>
      <input type="checkbox" name="lorem" />
    </Container>
  );
};

export default CheckboxInput;
