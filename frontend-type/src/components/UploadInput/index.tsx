import React, { useRef } from 'react';

import { Container } from './styles';

const UploadInput: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Container>
      <input ref={inputRef} type="file" name="lorem" />
      <button
        type="button"
        onClick={() => {
          inputRef.current?.click();
        }}
      >
        Upload File
      </button>
      <span>LoremIpsum.fasta</span>
    </Container>
  );
};

export default UploadInput;
