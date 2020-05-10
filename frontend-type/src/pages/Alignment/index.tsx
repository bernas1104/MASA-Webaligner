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
  SequencesContainer,
  SequenceInput,
} from './styles';

import Button from '../../components/Button';
import RadioInput from '../../components/RadioInput';
import TextInput from '../../components/TextInput';
import TextAreaInput from '../../components/TextAreaInput';
import SelectInput from '../../components/SelectInput';
import UploadInput from '../../components/UploadInput';

interface StateNames {
  [key: string]: Function;
}

const edges: string[] = ['1', '2', '3', '+', '*'];

const Alignment: React.FC = () => {
  const [isShowing, setIsShowing] = useState(false);

  const [extension, setExtension] = useState('');
  const [only1, setOnly1] = useState('');
  const [clearn, setClearN] = useState('');
  const [blockPruning, setBlockPruning] = useState('');
  const [complement, setComplement] = useState('');
  const [reverse, setReverse] = useState('');
  const [s0origin, setS0Origin] = useState('');
  const [s1origin, setS1Origin] = useState('');
  // const [s0input, setS0Input] = useState('');
  // const [s1input, setS1Input] = useState('');
  // const [s0edge, setS0Edge] = useState('');
  // const [s1edge, setS1Edge] = useState('');

  const states: StateNames = {
    extension: setExtension,
    only1: setOnly1,
    clearn: setClearN,
    blockPruning: setBlockPruning,
    complement: setComplement,
    reverse: setReverse,
    s0origin: setS0Origin,
    s1origin: setS1Origin,
  };

  const handleInput = useCallback(
    (name: string, value: string) => {
      states[name](value);
    },
    [states],
  );

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
                    onClick={() => handleInput('extension', option[1])}
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
                    onClick={() => handleInput('only1', option[1])}
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
                      onClick={() => handleInput('clearn', option[1])}
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
                      onClick={() => handleInput('blockPruning', option[1])}
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
                      onClick={() => handleInput('complement', option[1])}
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
                      onClick={() => handleInput('reverse', option[1])}
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
                <TextInput name="name" placeholder="Ex: John Doe">
                  Your name
                </TextInput>
                <TextInput name="email" placeholder="Ex: johndoe@gmail.com">
                  Your email
                </TextInput>
              </ContactInput>
            </ContactContainer>

            <SequencesContainer>
              <SequenceInput>
                <h2>Sequence S0</h2>

                <div className="input-type">
                  <MdInfoOutline size={25} />
                  <h3>Type</h3>
                </div>

                <div className="radio-type">
                  {[
                    ['NCBI API', '1'],
                    ['File Upload', '2'],
                    ['Text Input', '3'],
                  ].map((option) => (
                    <RadioInput
                      key={option[1]}
                      name="s0origin"
                      value={option[1]}
                      label={option[0]}
                      checked={option[1] === s0origin}
                      onClick={() => handleInput('s0origin', option[1])}
                    />
                  ))}
                </div>

                <div className="sequence-input">
                  {s0origin === '1' && (
                    <TextInput name="s0input" placeholder="Ex: AF133821.1">
                      Second sequence
                    </TextInput>
                  )}

                  {s0origin === '2' && <UploadInput />}

                  {s0origin === '3' && (
                    <TextAreaInput
                      name="s0input"
                      placeholder={'Ex: >Sequence Name\nAGGCCTAATTATGNACCAT'}
                    >
                      Your second sequence
                    </TextAreaInput>
                  )}
                </div>

                <div className="input-edge">
                  <div className="edge-title">
                    <MdInfoOutline size={25} color="#007715" />
                    <h3>Edge</h3>
                  </div>

                  <SelectInput
                    icon={MdArrowDropDown}
                    options={edges}
                    label="Edge of first sequence"
                    name="s0edge"
                  />
                </div>
              </SequenceInput>

              <SequenceInput>
                <h2>Sequence S1</h2>

                <div className="input-type">
                  <MdInfoOutline size={25} />
                  <h3>Type</h3>
                </div>

                <div className="radio-type">
                  {[
                    ['NCBI API', '1'],
                    ['File Upload', '2'],
                    ['Text Input', '3'],
                  ].map((option) => (
                    <RadioInput
                      key={option[1]}
                      name="s1origin"
                      value={option[1]}
                      label={option[0]}
                      checked={option[1] === s1origin}
                      onClick={() => handleInput('s1origin', option[1])}
                    />
                  ))}
                </div>

                <div className="sequence-input">
                  {s1origin === '1' && (
                    <TextInput name="s1input" placeholder="Ex: AY352275.1">
                      Second sequence
                    </TextInput>
                  )}

                  {s1origin === '2' && <UploadInput />}

                  {s1origin === '3' && (
                    <TextAreaInput
                      name="s1input"
                      placeholder={'Ex: >Sequence Name\nTGGCCGAAATTANGNACCNN'}
                    >
                      Your second sequence
                    </TextAreaInput>
                  )}
                </div>

                <div className="input-edge">
                  <div className="edge-title">
                    <MdInfoOutline size={25} color="#007715" />
                    <h3>Edge</h3>
                  </div>

                  <SelectInput
                    icon={MdArrowDropDown}
                    options={edges}
                    label="Edge for the second sequence"
                    name="s1edge"
                  />
                </div>
              </SequenceInput>
            </SequencesContainer>

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
