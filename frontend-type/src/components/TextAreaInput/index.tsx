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

interface PlaceholdersType {
  [key: string]: string;
}

const TextAreaInput: React.FC<TextAreaProps> = ({
  name,
  icon: Icon,
  children,
  ...rest
}) => {
  const placeholders: PlaceholdersType = {
    message: 'Ex: Hi, my name is John Doe and I have a question...',
  };

  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleInputFocus = useCallback((): void => {
    setIsFocused(true);

    if (inputRef.current?.value === '')
      inputRef.current?.setAttribute('placeholder', placeholders[name]);
  }, [placeholders, name]);

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
