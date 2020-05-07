import React, { useRef, useState } from 'react';

import { Container, Icon } from './styles';
import './styles.scss';

const TextInput: React.FC = () => {
  const [field, setField] = useState('');

  const inputLabel = useRef<HTMLLabelElement>(null);

  function handleFocus(): void {
    inputLabel.current?.classList.add('label-focus');
  }

  function handleBlur(): void {
    if (field === '') {
      inputLabel.current?.classList.remove('label-focus');
    }
  }

  return (
    <Container>
      <label ref={inputLabel} htmlFor="lorem">
        Lorem Ipsum
      </label>
      <input
        id="lorem"
        type="text"
        onFocus={() => handleFocus()}
        onBlur={() => handleBlur()}
        onChange={(event) => setField(event.target.value)}
        value={field}
      />
      <Icon size={25} color="#f5f5f5" />
    </Container>
  );
};

export default TextInput;
