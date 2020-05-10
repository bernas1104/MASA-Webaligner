import React from 'react';

import { Container } from './styles';

const UploadInput: React.FC = () => {
  return (
    <Container>
      <input type="file" name="lorem" />
      <button type="button">Upload File</button>
      <span>LoremIpsum.fasta</span>
    </Container>
  );
};

export default UploadInput;
