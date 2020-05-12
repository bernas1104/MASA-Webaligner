import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { MdInfoOutline, MdArrowDropDown } from 'react-icons/md';
import * as Yup from 'yup';

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
import FrozenScreen from '../../components/FrozenScreen';

import api from '../../services/apiClient';

interface StateNames {
  [key: string]: Function;
}

interface FormDateProps {
  [key: string]: string | Blob;
}

const edges: string[] = ['1', '2', '3', '+', '*'];

const Alignment: React.FC = () => {
  const history = useHistory();

  const btnRef = useRef<HTMLButtonElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [isShowing, setIsShowing] = useState(false);

  const [extension, setExtension] = useState('');
  const [only1, setOnly1] = useState('');
  const [clearn, setClearN] = useState('false');
  const [blockPruning, setBlockPruning] = useState('true');
  const [complement, setComplement] = useState('0');
  const [reverse, setReverse] = useState('0');
  const [s0origin, setS0Origin] = useState('');
  const [s1origin, setS1Origin] = useState('');
  const [s0input, setS0Input] = useState('');
  const [s1input, setS1Input] = useState('');
  const [s0edge, setS0Edge] = useState('');
  const [s1edge, setS1Edge] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [isToggled, setIsToggled] = useState(false);

  const [s0FileName, setS0FileName] = useState('');
  const [s1FileName, setS1FileName] = useState('');

  const states: StateNames = {
    extension: setExtension,
    only1: setOnly1,
    clearn: setClearN,
    blockPruning: setBlockPruning,
    complement: setComplement,
    reverse: setReverse,
    s0origin: setS0Origin,
    s1origin: setS1Origin,
    s0input: setS0Input,
    s1input: setS1Input,
    s0edge: setS0Edge,
    s1edge: setS1Edge,
    fullName: setFullName,
    email: setEmail,
  };

  useEffect(() => {
    setS0Input('');
    setS0FileName('');
  }, [s0origin]);

  useEffect(() => {
    setS1Input('');
    setS1FileName('');
  }, [s1origin]);

  const handleInput = useCallback(
    (field: string, value: string | File) => {
      states[field](value);
    },
    [states],
  );

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();

      setIsToggled(true);

      try {
        const data: FormDateProps = {
          extension,
          only1,
          clearn,
          blockPruning,
          complement,
          reverse,
          s0origin,
          s1origin,
          s0input,
          s1input,
          s0edge,
          s1edge,
          fullName,
          email,
        };

        const schema = Yup.object().shape({
          extension: Yup.number()
            .min(1)
            .max(3)
            .required('extension must select a MASA Extension'),
          only1: Yup.boolean().required(
            'only1 must select the stages to be executed',
          ),
          clearn: Yup.boolean().optional().default(false),
          blockPuning: Yup.boolean().optional().default(true),
          complement: Yup.number().optional().min(0).max(3).default(0),
          reverse: Yup.number().optional().min(0).max(3).default(0),
          s0origin: Yup.number()
            .min(1)
            .max(3)
            .required('s0origin must select the first sequence origin'),
          s1origin: Yup.number()
            .min(1)
            .max(3)
            .required('s1origin must select the second sequence origin'),
          s0edge: Yup.string()
            .matches(/^[1|2|3|+|*]$/g)
            .required('s0edge must be one of: 1, 2, 3, +, *'),
          s1edge: Yup.string()
            .matches(/^[1|2|3|+|*]$/g)
            .required('s1edge must be one of: 1, 2, 3, +, *'),
          fullName: Yup.string().optional(),
          email: Yup.string().email().optional(),
        });

        await schema.validate(data, { abortEarly: false });

        const formData = new FormData();

        const keys = Object.keys(data);
        keys.forEach((key) => {
          formData.append(key, data[key]);
        });

        const response = await api.post('alignments', formData);

        history.push(`/results/${response.data.alignment.id}`);
      } catch (err) {
        setIsToggled(false);
        console.log(err);
      }
    },
    [
      extension,
      only1,
      clearn,
      blockPruning,
      complement,
      reverse,
      s0origin,
      s1origin,
      s0input,
      s1input,
      s0edge,
      s1edge,
      fullName,
      email,
      history,
    ],
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
          <Form ref={formRef} onSubmit={handleSubmit}>
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
              <div
                className="optional-configuration-title"
                role="presentation"
                onClick={() => btnRef.current?.click()}
              >
                <h2>Optional Configuration</h2>
                <button
                  ref={btnRef}
                  type="button"
                  onClick={() => setIsShowing(!isShowing)}
                >
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
                    ['True', 'true'],
                    ['False', 'false'],
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
                    ['Enabled', 'true'],
                    ['Disabled', 'false'],
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
                <TextInput
                  value={fullName}
                  onChange={(e) => handleInput('fullName', e.target.value)}
                  name="fullName"
                  placeholder="Ex: John Doe"
                >
                  Your name
                </TextInput>
                <TextInput
                  value={email}
                  onChange={(e) => handleInput('email', e.target.value)}
                  name="email"
                  placeholder="Ex: johndoe@gmail.com"
                >
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
                    <TextInput
                      value={s0input}
                      name="s0input"
                      placeholder="Ex: AF133821.1"
                      onChange={(e) => handleInput('s0input', e.target.value)}
                    >
                      Second sequence
                    </TextInput>
                  )}

                  {s0origin === '2' && (
                    <UploadInput
                      filename={s0FileName}
                      name="s0input"
                      onChange={(e) => {
                        if (e.target.files) {
                          setS0FileName(e.target.files[0].name);
                          handleInput('s0input', e.target.files[0]);
                        }
                      }}
                    />
                  )}

                  {s0origin === '3' && (
                    <TextAreaInput
                      value={s0input}
                      name="s0input"
                      placeholder={'Ex: >Sequence Name\nAGGCCTAATTATGNACCAT'}
                      onChange={(e) => handleInput('s0input', e.target.value)}
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
                    value={s0edge}
                    onChange={(e) => handleInput('s0edge', e.target.value)}
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
                    <TextInput
                      value={s1input}
                      onChange={(e) => handleInput('s1input', e.target.value)}
                      name="s1input"
                      placeholder="Ex: AY352275.1"
                    >
                      Second sequence
                    </TextInput>
                  )}

                  {s1origin === '2' && (
                    <UploadInput
                      filename={s1FileName}
                      onChange={(e) => {
                        if (e.target.files) {
                          setS1FileName(e.target.files[0].name);
                          handleInput('s1input', e.target.files[0]);
                        }
                      }}
                    />
                  )}

                  {s1origin === '3' && (
                    <TextAreaInput
                      value={s1input}
                      onChange={(e) => handleInput('s1input', e.target.value)}
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
                    value={s1edge}
                    onChange={(e) => handleInput('s1edge', e.target.value)}
                  />
                </div>
              </SequenceInput>
            </SequencesContainer>

            <Button
              marginTop={50}
              type="submit"
              value="Align Sequences"
              align="center"
            />
          </Form>
        </AlignerContainer>
      </Container>

      <FrozenScreen isToggled={isToggled} />
    </>
  );
};

export default Alignment;
