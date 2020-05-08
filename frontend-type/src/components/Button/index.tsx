import React, { ButtonHTMLAttributes } from 'react';
import { IconBaseProps } from 'react-icons';

import { Container } from './styles';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ComponentType<IconBaseProps>;
}

const Button: React.FC<ButtonProps> = ({ icon: Icon, value, ...rest }) => {
  return (
    <Container>
      <button type="button" {...rest}>
        {Icon && <Icon size={20} color="#f5f5f5" />}
        {value}
      </button>
    </Container>
  );
};

export default Button;
