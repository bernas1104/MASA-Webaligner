import React, { useRef, InputHTMLAttributes } from 'react';

import { Container } from './styles';

interface UploadInputProps extends InputHTMLAttributes<HTMLInputElement> {
  filename: string;
}

const UploadInput: React.FC<UploadInputProps> = ({
  name,
  filename,
  onChange,
  ...rest
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Container>
      <input
        ref={inputRef}
        type="file"
        name={name}
        onChange={onChange}
        {...rest}
      />
      <button
        type="button"
        onClick={() => {
          inputRef.current?.click();
        }}
      >
        Upload File
      </button>
      <span>{filename || 'No file chosen'}</span>
    </Container>
  );
};

export default UploadInput;
