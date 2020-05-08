import React, {
  InputHTMLAttributes,
  useRef,
  useState,
  useCallback,
} from 'react';
import { IconBaseProps } from 'react-icons';

import { Container } from './styles';

interface SelectProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ComponentType<IconBaseProps>;
}

const SelectInput: React.FC<SelectProps> = ({ icon: Icon }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  const selectRef = useRef<HTMLSelectElement>(null);

  const handleSelectFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleSelectBlur = useCallback(() => {
    setIsFocused(false);

    setIsFilled(!!selectRef.current?.value);
  }, []);

  return (
    <Container isFocused={isFocused} isFilled={isFilled}>
      <label htmlFor="lorem">lorem</label>
      <select
        ref={selectRef}
        name="lorem"
        onFocus={handleSelectFocus}
        onBlur={handleSelectBlur}
        placeholder="lorem ipsum"
      >
        {/* <option disabled selected hidden /> */}
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
      </select>
      {Icon && <Icon size={25} color="#f5f5f5" />}
    </Container>
  );
};

export default SelectInput;
