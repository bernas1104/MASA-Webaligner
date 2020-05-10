import React, {
  TextareaHTMLAttributes,
  useCallback,
  useState,
  useRef,
} from 'react';
import { IconBaseProps } from 'react-icons';

import { Container } from './styles';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  icon?: React.ComponentType<IconBaseProps>;
}

const TextAreaInput: React.FC<TextAreaProps> = ({
  name,
  placeholder = '',
  icon: Icon,
  children,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);

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
      <label htmlFor={name}>{children}</label>
      <textarea
        ref={inputRef}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        name={name}
        cols={30}
        rows={5}
        {...rest}
      />
      {Icon && <Icon size={25} color="#f5f5f5" />}
    </Container>
  );
};

export default TextAreaInput;
