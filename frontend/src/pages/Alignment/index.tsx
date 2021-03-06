import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { MdInfoOutline, MdArrowDropDown } from 'react-icons/md';
import xml2js from 'xml2js';
import * as Yup from 'yup';
import AppError from '../../errors/AppError';

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
import UploadInput from '../../components/UploadInput';
import FrozenScreen from '../../components/FrozenScreen';
import Tooltip from '../../components/Tooltip';

import apiMASA from '../../services/apiClient';
import apiNCBI from '../../services/apiNCBI';
import { useToast } from '../../hooks/ToastContext';

interface StateNames {
  [key: string]: Function;
}

interface FormDateProps {
  [key: string]: string | Blob;
}

const Alignment: React.FC = () => {
  const history = useHistory();
  const toast = useToast();

  const btnRef = useRef<HTMLButtonElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [isShowing, setIsShowing] = useState(false);

  const [extension, setExtension] = useState('');
  const [type, setType] = useState('');
  const [only1, setOnly1] = useState('');
  const [clearn, setClearN] = useState('false');
  const [block_pruning, setBlockPruning] = useState('true');
  const [complement, setComplement] = useState('0');
  const [reverse, setReverse] = useState('0');
  const [s0origin, setS0Origin] = useState('');
  const [s1origin, setS1Origin] = useState('');
  const [s0input, setS0Input] = useState<any>('');
  const [s1input, setS1Input] = useState<any>('');
  const [full_name, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [isToggled, setIsToggled] = useState(false);

  const [s0FileName, setS0FileName] = useState('');
  const [s1FileName, setS1FileName] = useState('');

  const states: StateNames = {
    extension: setExtension,
    type: setType,
    only1: setOnly1,
    clearn: setClearN,
    block_pruning: setBlockPruning,
    complement: setComplement,
    reverse: setReverse,
    s0origin: setS0Origin,
    s1origin: setS1Origin,
    s0input: setS0Input,
    s1input: setS1Input,
    full_name: setFullName,
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

  const getInputSize = useCallback(
    async (input: number, origin: string): Promise<number> => {
      let size = 0;

      switch (origin) {
        case '1': {
          try {
            const seq_id = input === 0 ? String(s0input) : String(s1input);
            const xmlSummary = await apiNCBI.get(`?db=nuccore&id=${seq_id}`);

            const xml = `<?xml version="1.0" enconding="UTF-8" ?>
                          ${xmlSummary.data}`;

            xml2js.parseString(xml, (err, result) => {
              if (err) {
                throw err;
              }

              size = result.eSummaryResult.DocSum[0].Item[8]._;
            });
          } catch (err) {
            throw new AppError('Invalid NCBI Sequence ID.');
          }
          break;
        }
        case '2': {
          if (input === 0) size = s0input.size;
          else size = s1input.size;
          break;
        }
        case '3': {
          if (input === 0) size = s0input.length;
          else size = s1input.length;
          break;
        }
        default: {
          console.log('Invalid origin option');
        }
      }

      return size;
    },
    [s0input, s1input],
  );

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
          type,
          only1,
          clearn,
          block_pruning,
          complement,
          reverse,
          s0origin,
          s1origin,
          s0input,
          s1input,
          full_name,
          email,
        };

        const s0size = await getInputSize(0, s0origin);
        const s1size = await getInputSize(1, s1origin);

        const required = s0size >= 1000000 || s1size >= 1000000;

        const schema = Yup.object().shape({
          extension: Yup.number()
            .typeError('Extension must be selected')
            .min(1)
            .max(3)
            .required('extension must select a MASA Extension'),
          type: Yup.string().matches(
            /^(local)|(global)$/g,
            'Alignment type must be selected',
          ),
          only1: Yup.boolean()
            .typeError('Stage must be selected')
            .required('must select the stages to be executed'),
          clearn: Yup.boolean().optional().default(false),
          block_puning: Yup.boolean().optional().default(true),
          complement: Yup.number().optional().min(0).max(3).default(0),
          reverse: Yup.number().optional().min(0).max(3).default(0),
          s0origin: Yup.number()
            .typeError('Sequence S0 origin must be selected')
            .min(1)
            .max(3)
            .required('s0origin must select the first sequence origin'),
          s1origin: Yup.number()
            .typeError('Sequence S1 origin must be selected')
            .min(1)
            .max(3)
            .required('s1origin must select the second sequence origin'),
          full_name: required
            ? Yup.string().required()
            : Yup.string().optional(),
          email: required
            ? Yup.string().email('must be a valid e-mail').required()
            : Yup.string().email('must be a valid e-mail').optional(),
        });

        await schema.validate(data, { abortEarly: false });

        const formData = new FormData();

        const keys = Object.keys(data);
        keys.forEach((key) => {
          formData.append(key, data[key]);
        });

        const response = await apiMASA.post('alignments', formData);

        toast.addToast({
          type: 'success',
          title: 'Alignment requested',
          description:
            'Your requested alignment has been submited and it is being processed',
        });

        history.push(`/results/${response.data.id}`);
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const { errors } = err as Yup.ValidationError;

          errors.forEach((error) => {
            if (
              error.includes('email is a required') ||
              error.includes('full_name is a required')
            ) {
              toast.addToast({
                type: 'error',
                title: 'Request Error',
                description: error.includes('email')
                  ? 'email is required for sequences bigger than 1MB'
                  : 'full name is required for sequences bigger than 1MB',
              });
            } else {
              toast.addToast({
                type: 'error',
                title: 'Request Error',
                description: error,
              });
            }
          });
        } else if (err.message === 'Invalid NCBI Sequence ID.') {
          toast.addToast({
            type: 'error',
            title: err.message,
            description:
              'One or both of the sequence IDs given are invalid. Try again',
          });
        } else if (err.response.status === 400) {
          toast.addToast({
            type: 'error',
            title: err.response.data.message,
            description:
              'There was a problem with one or both of the provided sequences. Try again',
          });
        } else {
          toast.addToast({
            type: 'error',
            title: 'Unknown Error',
            description: 'There was an unexpected error. Try again later',
          });
        }

        setIsToggled(false);
      }
    },
    [
      extension,
      type,
      only1,
      clearn,
      block_pruning,
      complement,
      reverse,
      s0origin,
      s1origin,
      s0input,
      s1input,
      full_name,
      email,
      history,
      toast,
      getInputSize,
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
                <Tooltip title="CUDAlign uses GPU to process and should be used for bigger sequences. OpenMP uses CPU and should be used for smaller sequences.">
                  <MdInfoOutline size={25} />
                </Tooltip>
                <h2>MASA Extension*</h2>
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
                <Tooltip title="Selects between using the Smith-Waterman (Local) and Needleman-Wunsch (Global) algorithms.">
                  <MdInfoOutline size={25} />
                </Tooltip>
                <h2>Alignment Type*</h2>
              </div>
              <div className="input-control">
                {[
                  ['Local', 'local'],
                  ['Global', 'global'],
                ].map((option) => (
                  <RadioInput
                    key={option[1]}
                    name="type"
                    value={option[1]}
                    label={option[0]}
                    checked={option[1] === type}
                    onClick={() => handleInput('type', option[1])}
                  />
                ))}
              </div>
            </InputConfiguration>

            <InputConfiguration>
              <div className="configuration-title">
                <Tooltip title="'Auto' will perform the complete alignment. 'Only Stage I' will generate only the similarity best score and it's position.">
                  <MdInfoOutline size={25} />
                </Tooltip>
                <h2>Stage*</h2>
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
                  <Tooltip title="If enabled, will remove all the 'N' characters.">
                    <MdInfoOutline size={25} />
                  </Tooltip>
                  <h2>ClearN</h2>
                </div>
                <div className="input-control">
                  {[
                    ['Enabled', 'true'],
                    ['Disabled', 'false'],
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
                  <Tooltip title="If enabled, will execute the 'Block Pruning' optimization.">
                    <MdInfoOutline size={25} />
                  </Tooltip>
                  <h2>Block Pruning</h2>
                </div>
                <div className="input-control">
                  {[
                    ['Enabled', 'true'],
                    ['Disabled', 'false'],
                  ].map((option) => (
                    <RadioInput
                      key={option[1]}
                      name="block_pruning"
                      value={option[1]}
                      label={option[0]}
                      checked={option[1] === block_pruning}
                      onClick={() => handleInput('block_pruning', option[1])}
                    />
                  ))}
                </div>
              </OptionalConfigurationsInput>

              <OptionalConfigurationsInput isShowing={isShowing}>
                <div className="configuration-title">
                  <Tooltip title="It substitutes any base for its complement. Can be applied to the first sequence, second or both sequences.">
                    <MdInfoOutline size={25} />
                  </Tooltip>
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
                  <Tooltip title="It reverses the first sequence, second or both sequences.">
                    <MdInfoOutline size={25} />
                  </Tooltip>
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
                  <Tooltip title="If you're requesting the alignment of big sequences, you can be warned when the results are ready.">
                    <MdInfoOutline size={25} />
                  </Tooltip>
                  <h2>Contact Information</h2>
                </div>
              </ContactTitle>

              <ContactInput>
                <TextInput
                  value={full_name}
                  onChange={(e) => handleInput('full_name', e.target.value)}
                  name="full_name"
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
                <h2>Sequence S0*</h2>

                <div className="input-type">
                  <Tooltip title="You can input a sequence with the NCBI API, upload a fasta file or write you own sequence.">
                    <MdInfoOutline size={25} />
                  </Tooltip>
                  <h3>Origin</h3>
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
                      First sequence
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
              </SequenceInput>

              <SequenceInput>
                <h2>Sequence S1*</h2>

                <div className="input-type">
                  <Tooltip title="You can input a sequence with the NCBI API, upload a fasta file or write you own sequence.">
                    <MdInfoOutline size={25} />
                  </Tooltip>
                  <h3>Origin</h3>
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
              </SequenceInput>
            </SequencesContainer>

            <Button
              marginTop={50}
              type="submit"
              value="Align Sequences"
              align="center"
            />

            <small>* required fields</small>
          </Form>
        </AlignerContainer>
      </Container>

      <FrozenScreen isToggled={isToggled} />
    </>
  );
};

export default Alignment;
