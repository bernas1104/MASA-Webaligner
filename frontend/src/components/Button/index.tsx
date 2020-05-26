import React, { ButtonHTMLAttributes } from 'react';
import { IconBaseProps } from 'react-icons';

import { Container } from './styles';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ComponentType<IconBaseProps>;
  marginTop?: number;
  align?: string;
}

const Button: React.FC<ButtonProps> = ({
  icon: Icon,
  marginTop = 0,
  value,
  align,
  ...rest
}) => {
  return (
    <Container marginTop={marginTop} align={align}>
      <button type="button" {...rest}>
        {Icon && <Icon size={20} color="#f5f5f5" />}
        {value}
      </button>
    </Container>
  );
};

export default Button;
