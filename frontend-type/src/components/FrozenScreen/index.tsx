import React, { HTMLAttributes } from 'react';

import { Container } from './styles';

interface FrozenScreenProps extends HTMLAttributes<HTMLDivElement> {
  isToggled: boolean;
}

const FrozenScreen: React.FC<FrozenScreenProps> = ({ isToggled, ...rest }) => (
  <Container isToggled={isToggled} {...rest} />
);

export default FrozenScreen;
