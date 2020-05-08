import React, { InputHTMLAttributes } from 'react';

import { Container, OutterCircle, InnerCircle } from './styles';

interface RadioboxProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
}

const CheckboxInput: React.FC<RadioboxProps> = ({
  name,
  value,
  checked,
  onClick,
  ...rest
}) => {
  return (
    <Container onClick={onClick}>
      <label htmlFor={name}>
        <div className="radio-container">
          <OutterCircle />
          <InnerCircle isChecked={checked} />
          <input
            type="radio"
            name={name}
            value={value}
            checked={checked}
            readOnly
            {...rest}
          />
          <div className="radio-hover" />
        </div>

        <div className="label-container">{value}</div>
      </label>
    </Container>
  );
};

export default CheckboxInput;
