import React, {
  useRef,
  useState,
  useCallback,
  SelectHTMLAttributes,
} from 'react';
import { IconBaseProps } from 'react-icons';

import { Container } from './styles';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  icon?: React.ComponentType<IconBaseProps>;
  label: string;
  options: string[];
}

const SelectInput: React.FC<SelectProps> = ({
  icon: Icon,
  name = '',
  label,
  options,
  value,
  onChange,
}) => {
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
      <label htmlFor={name}>{label}</label>
      <select
        ref={selectRef}
        name={name}
        onFocus={handleSelectFocus}
        onBlur={handleSelectBlur}
        value={value}
        onChange={onChange}
      >
        // eslint-disable-next-line jsx-a11y/control-has-associated-label
        <option value="" disabled hidden />
        {options.map((option) => (
          <option value={option} key={option}>
            {option}
          </option>
        ))}
      </select>
      {Icon && <Icon size={25} color="#333" />}
    </Container>
  );
};

export default SelectInput;
