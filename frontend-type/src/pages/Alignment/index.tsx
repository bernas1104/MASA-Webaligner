import React, { useState, useCallback } from 'react';
import { MdInfoOutline, MdArrowDropDown } from 'react-icons/md';

import Header from '../../components/Header';
import {
  Container,
  Title,
  AlignerContainer,
  Form,
  InputConfiguration,
  OptionalConfigurationsTitle,
  OptionalContainer,
  OptionalConfigurationsInput,
  ContactContainer,
  ContactTitle,
  ContactInput,
} from './styles';

import Button from '../../components/Button';
import RadioInput from '../../components/RadioInput';
import TextInput from '../../components/TextInput';

const Alignment: React.FC = () => {
  const [isShowing, setIsShowing] = useState(false);

  const [extension, setExtension] = useState('');
  const [only1, setOnly1] = useState('');
  const [clearn, setClearN] = useState('');
  const [blockPruning, setBlockPruning] = useState('');
  const [complement, setComplement] = useState('');
  const [reverse, setReverse] = useState('');

  const handleExtension = useCallback((value: string) => {
    setExtension(value);
  }, []);

  const handleOnly1 = useCallback((value: string) => {
    setOnly1(value);
  }, []);

  const handleClearN = useCallback((value: string) => {
    setClearN(value);
  }, []);

  const handleBlockPruning = useCallback((value: string) => {
    setBlockPruning(value);
  }, []);

  const handleComplement = useCallback((value: string) => {
    setComplement(value);
  }, []);

  const handleReverse = useCallback((value: string) => {
    setReverse(value);
  }, []);

  return (
    <>
      <Header />
      <Container>
        <Title>MASA Aligner</Title>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam auctor
          maximus nisl et aliquam. Mauris interdum aliquam erat, id vestibulum
          lectus laoreet non.
        </p>

        <AlignerContainer>
          <Form>
            <InputConfiguration>
              <div className="configuration-title">
                <MdInfoOutline size={25} />
                <h2>MASA Extension</h2>
              </div>
              <div className="input-control">
                {[
                  ['CUDAlign', '1'],
                  ['MASA-Open-MP', '2'],
                  ['Auto', '3'],
                ].map((option) => (
                  <RadioInput
                    key={option[1]}
                    name="extension"
                    value={option[1]}
                    label={option[0]}
                    checked={option[1] === extension}
                    onClick={() => handleExtension(option[1])}
                  />
                ))}
              </div>
            </InputConfiguration>

            <InputConfiguration>
              <div className="configuration-title">
                <MdInfoOutline size={25} />
                <h2>Stages</h2>
              </div>
              <div className="input-control">
                {[
                  ['Auto', 'false'],
                  ['Only Stage I', 'true'],
                ].map((option) => (
                  <RadioInput
                    key={option[1]}
                    name="only1"
                    value={option[1]}
                    label={option[0]}
                    checked={option[1] === only1}
                    onClick={() => handleOnly1(option[1])}
                  />
                ))}
              </div>
            </InputConfiguration>

            <OptionalConfigurationsTitle isShowing={isShowing}>
              <div className="optional-configuration-title">
                <h2>Optional Configuration</h2>
                <button type="button" onClick={() => setIsShowing(!isShowing)}>
                  <MdArrowDropDown size={25} color="#007715" />
                </button>
              </div>
            </OptionalConfigurationsTitle>

            <OptionalContainer isShowing={isShowing}>
              <OptionalConfigurationsInput isShowing={isShowing}>
                <div className="configuration-title">
                  <MdInfoOutline size={25} />
                  <h2>ClearN</h2>
                </div>
                <div className="input-control">
                  {[
                    ['True', 'false'],
                    ['False', 'true'],
                  ].map((option) => (
                    <RadioInput
                      key={option[1]}
                      name="clearn"
                      value={option[1]}
                      label={option[0]}
                      checked={option[1] === clearn}
                      onClick={() => handleClearN(option[1])}
                    />
                  ))}
                </div>
              </OptionalConfigurationsInput>

              <OptionalConfigurationsInput isShowing={isShowing}>
                <div className="configuration-title">
                  <MdInfoOutline size={25} />
                  <h2>Block Pruning</h2>
                </div>
                <div className="input-control">
                  {[
                    ['Enabled', 'false'],
                    ['Disabled', 'true'],
                  ].map((option) => (
                    <RadioInput
                      key={option[1]}
                      name="blockPruning"
                      value={option[1]}
                      label={option[0]}
                      checked={option[1] === blockPruning}
                      onClick={() => handleBlockPruning(option[1])}
                    />
                  ))}
                </div>
              </OptionalConfigurationsInput>

              <OptionalConfigurationsInput isShowing={isShowing}>
                <div className="configuration-title">
                  <MdInfoOutline size={25} />
                  <h2>Complement</h2>
                </div>
                <div className="input-control">
                  {[
                    ['Only s0', '1'],
                    ['Only s1', '2'],
                    ['Both sequences', '3'],
                  ].map((option) => (
                    <RadioInput
                      key={option[1]}
                      name="complement"
                      value={option[1]}
                      label={option[0]}
                      checked={option[1] === complement}
                      onClick={() => handleComplement(option[1])}
                    />
                  ))}
                </div>
              </OptionalConfigurationsInput>

              <OptionalConfigurationsInput isShowing={isShowing}>
                <div className="configuration-title">
                  <MdInfoOutline size={25} />
                  <h2>Reverse</h2>
                </div>
                <div className="input-control">
                  {[
                    ['Only s0', '1'],
                    ['Only s1', '2'],
                    ['Both sequences', '3'],
                  ].map((option) => (
                    <RadioInput
                      key={option[1]}
                      name="reverse"
                      value={option[1]}
                      label={option[0]}
                      checked={option[1] === reverse}
                      onClick={() => handleReverse(option[1])}
                    />
                  ))}
                </div>
              </OptionalConfigurationsInput>
            </OptionalContainer>

            <ContactContainer>
              <ContactTitle>
                <div className="configuration-title">
                  <MdInfoOutline size={25} />
                  <h2>Contact Information</h2>
                </div>
              </ContactTitle>

              <ContactInput>
                <TextInput name="name">Your name</TextInput>
                <TextInput name="email">Your email</TextInput>
              </ContactInput>
            </ContactContainer>

            <Button
              marginTop={50}
              type="submit"
              value="Align Sequences"
              onClick={(e) => e.preventDefault()}
            />
          </Form>
        </AlignerContainer>
      </Container>
    </>
  );
};

export default Alignment;
