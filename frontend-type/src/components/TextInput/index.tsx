import React, {
  useRef,
  useState,
  InputHTMLAttributes,
  useCallback,
} from 'react';
import { IconBaseProps } from 'react-icons';

import { Container } from './styles';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  icon?: React.ComponentType<IconBaseProps>;
}

const TextInput: React.FC<InputProps> = ({
  name,
  placeholder = '',
  icon: Icon,
  children,
  onChange,
  ...rest
}) => {
  const [isFilled, setIsFilled] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const inputLabel = useRef<HTMLLabelElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputFocus = useCallback((): void => {
    setIsFocused(true);

    if (inputRef.current?.value === '')
      inputRef.current?.setAttribute('placeholder', placeholder);
  }, [placeholder]);

  const handleInputBlur = useCallback((): void => {
    setIsFocused(false);

    if (inputRef.current?.value === '')
      inputRef.current?.removeAttribute('placeholder');

    setIsFilled(!!inputRef.current?.value);
  }, []);

  return (
    <Container isFilled={isFilled} isFocused={isFocused}>
      <label ref={inputLabel} htmlFor={name}>
        {children}
      </label>
      <input
        ref={inputRef}
        id={name}
        type="text"
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        onChange={onChange}
        {...rest}
      />
      {Icon && <Icon size={25} color="#f5f5f5" />}
    </Container>
  );
};

export default TextInput;
