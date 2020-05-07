import styled from 'styled-components';
import { MdPerson } from 'react-icons/md';

export const Container = styled.div`
  border: 1px solid #f5f5f5;
  border-radius: 5px;
  position: relative;

  padding: 8px 16px;
  padding-right: 32px;

  display: flex;
  align-items: center;
  transition: border-color 0.2s;
  -webkit-transition: border-color 0.2s;

  &:hover {
    border-color: rgba(245, 245, 245, 0.5);
  }

  input {
    flex: 1;
    width: 100%;
    border: none !important;
    margin-left: 10px !important;
    color: #f5f5f5;

    transition: opacity 0.2s;
    -webkit-transition: opacity 0.2s;
  }

  label {
    position: absolute;
    left: 32px;
    top: 16px;
    z-index: 10;
    display: inline-block;

    transition: all 0.2s;
  }
`;

export const Icon = styled(MdPerson)`
  display: inline-block;
  margin: 0;
  /*position: absolute;
  bottom: 16px;
  right: 36px;*/
`;
