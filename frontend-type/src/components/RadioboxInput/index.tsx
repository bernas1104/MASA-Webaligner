import React, {
  InputHTMLAttributes,
  useState,
  useCallback,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';

import { Container, OutterCircle, InnerCircle } from './styles';

interface RadioboxProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  value: string;
}

interface RadioboxRef {
  checked: boolean | undefined;
}

const CheckboxInput: React.RefForwardingComponent<
  RadioboxRef,
  RadioboxProps
> = ({ name, value, ...rest }, inputRef) => {
  const radioRef = useRef<HTMLInputElement>(null);

  const [isChecked, setIsChecked] = useState(false);

  const handleClick = useCallback(() => {
    setIsChecked(!isChecked);
  }, [isChecked]);

  useImperativeHandle(inputRef, () => ({
    checked: radioRef.current?.checked,
  }));

  return (
    <Container isChecked={isChecked}>
      <label htmlFor={name} role="presentation" onClick={handleClick}>
        <div className="radio-container">
          <OutterCircle />
          <InnerCircle isChecked={isChecked} />
          <input
            ref={radioRef}
            type="radio"
            name={name}
            value={value}
            {...rest}
          />
          <div className="radio-hover" />
        </div>

        <div className="label-container">{value}</div>
      </label>
    </Container>
  );
};

export default forwardRef(CheckboxInput);
