import React, { useState, useEffect, useCallback } from 'react';
import { RouteComponentProps } from 'react-router';
import { MdArrowDropDown } from 'react-icons/md';
import ReactEcharts from 'echarts-for-react';

import {
  Container,
  GraphContainer,
  NoGraphRenderedError,
  Sidemenu,
  ResultsCard,
  ErrorContainer,
} from './styles';

import api from '../../services/apiClient';

import Header from '../../components/Header';
import FrozenScreen from '../../components/FrozenScreen';
import TextResults from './components/TextResults';

import Alignment from '../../services/MASA-Viewer/Alignment';
import AlignmentBinaryFile from '../../services/MASA-Viewer/AlignmentBinaryFile';
import SequenceData from '../../services/MASA-Viewer/SequenceData';
import AlignmentUtils from '../../services/MASA-Viewer/AlignmentUtils';

import ChartOptions from './ChartOptions';

type ResultsProps = RouteComponentProps<{
  id: string;
}>;

interface AlignmentInfoProps {
  alignment: {
    blockPruning: boolean;
    clearn: boolean;
    complement: number;
    email: string | null;
    extension: number;
    fullName: string | null;
    id: string;
    only1: boolean;
    reverse: number;
  };
  sequences: {
    alignment_id: string;
    edge: string;
    file: string;
    id: string;
    origin: number;
    size: number;
  }[];
  statistics: {
    names: string[];
    globalStatistics: string[];
    stageIStatistics: string[];
  };
  binary?: {
    data: Buffer[];
    type: string;
  };
  fasta?: {
    s0file: string;
    s1file: string;
  };
}

interface AlignmentProps {
  alignment: Alignment;
  description: string[];
}

interface GraphProps {
  xAxis: number[];
  yAxis: number[];
  range: number;
}

const Origins = ['NCBI API', 'File Upload', 'Text Input'];

const Results: React.FC<ResultsProps> = (props) => {
  const [tries, setTries] = useState(1);
  const [isToggled, setIsToggled] = useState(false);

  const [alignmentData, setAlignmentData] = useState<AlignmentProps | null>(
    null,
  );
  const [alignmentInfo, setAlignmentInfo] = useState<AlignmentInfoProps | null>(
    null,
  );
  const [renderGraph, setRenderGraph] = useState(true);
  const [graph, setGraph] = useState<GraphProps | null>(null);
  const [resetValues, setResetValues] = useState<number[]>([]);

  const [render, setRender] = useState(0);
  const [errors, setErrors] = useState(0x0000);

  const buildGraphData = useCallback(() => {
    if (!graph) {
      if (!alignmentInfo?.alignment.only1 && alignmentData) {
        const s0gapped = alignmentData?.alignment
          .getAlignmentWithGaps(0)
          .getSB();
        const s1gapped = alignmentData?.alignment
          .getAlignmentWithGaps(1)
          .getSB();

        if (s0gapped.length >= 1000000 || s1gapped.length >= 1000000)
          setRenderGraph(false);

        if (s0gapped && s1gapped) {
          const xAxis = [];
          const yAxis = [];
          for (
            let i = 0,
              x = alignmentData?.alignment.getSequenceStartPosition(0),
              y = alignmentData?.alignment.getSequenceStartPosition(1);
            i < s0gapped.length;
            i += 1
          ) {
            if (x && y) {
              if (s0gapped[i] === s1gapped[i]) {
                alignmentData?.alignment.getDir(0) === 1
                  ? xAxis.push(x++)
                  : xAxis.push(x--);
                alignmentData?.alignment.getDir(1) === 1
                  ? yAxis.push(y++)
                  : yAxis.push(y--);
              } else if (s0gapped[i] !== '-' && s1gapped[i] !== '-') {
                alignmentData?.alignment.getDir(0) === 1
                  ? xAxis.push(x++)
                  : xAxis.push(x--);
                alignmentData?.alignment.getDir(1) === 1
                  ? yAxis.push(y++)
                  : yAxis.push(y--);
              } else if (s0gapped[i] === '-') {
                xAxis.push(x);
                alignmentData?.alignment.getDir(1) === 1
                  ? yAxis.push(y++)
                  : yAxis.push(y--);
              } else {
                alignmentData?.alignment.getDir(0) === 1
                  ? xAxis.push(x++)
                  : xAxis.push(x--);
                yAxis.push(y);
              }
            }
          }

          setGraph({
            xAxis,
            yAxis,
            range: s0gapped.length,
          });
        }
      }
    }
  }, [alignmentData, alignmentInfo, graph]);

  useEffect(() => {
    async function fetchAlignmentInfo(): Promise<void> {
      try {
        const response = await api.get(`alignments/${props.match.params.id}`);
        const { alignment, sequences, statistics } = response.data;

        if (alignment.only1) {
          setAlignmentInfo({
            alignment,
            sequences,
            statistics,
          });

          setRender(1);
        } else {
          const { data: binary } = await api.get(
            `files/bin/${props.match.params.id}`,
          );
          const { data: fasta } = await api.get(
            `files/fasta/${props.match.params.id}`,
          );

          setAlignmentInfo({
            alignment,
            sequences,
            statistics,
            binary,
            fasta,
          });
        }
      } catch (err) {
        if (err.message.includes('452')) {
          setTimeout(() => {
            setTries(tries + 1);
          }, 5000 * tries);
        } else setErrors(0x0001);
      }
    }

    fetchAlignmentInfo();
  }, [props, tries]);

  useEffect(() => {
    if (alignmentInfo) {
      if (alignmentInfo.binary) {
        const alignment = AlignmentBinaryFile.read(
          Buffer.from(alignmentInfo.binary.data),
        );

        if (alignmentInfo && alignmentInfo.fasta) {
          alignment
            .getAlignmentParams()
            .getSequences()[0]
            .setData(
              new SequenceData({
                file: alignmentInfo.fasta.s0file,
                modifiers: alignment
                  .getAlignmentParams()
                  .getSequences()[0]
                  .getModifiers(),
              }),
            );

          alignment
            .getAlignmentParams()
            .getSequences()[1]
            .setData(
              new SequenceData({
                file: alignmentInfo.fasta.s1file,
                modifiers: alignment
                  .getAlignmentParams()
                  .getSequences()[1]
                  .getModifiers(),
              }),
            );
        }

        const description: string[] = [];
        description.push(
          alignment
            .getAlignmentParams()
            .getSequence(0)
            .getInfo()
            .getDescription(),
        );
        description.push(
          alignment
            .getAlignmentParams()
            .getSequence(1)
            .getInfo()
            .getDescription(),
        );

        setResetValues([
          alignment.getSequenceStartPosition(0),
          alignment.getSequenceEndPosition(0),
        ]);

        setAlignmentData({
          alignment,
          description,
        });
      }
    }
  }, [alignmentInfo]);

  useEffect(() => {
    if (alignmentData) {
      buildGraphData();
      setRender(2);
    }
  }, [alignmentData, buildGraphData]);

  return (
    <>
      <Header />
      {render === 2 && errors === 0x0000 && (
        <Container render={render}>
          <GraphContainer>
            {renderGraph && (
              <ReactEcharts
                option={ChartOptions({
                  xAxis: graph?.xAxis,
                  yAxis: graph?.yAxis,
                  range: graph?.range,
                  description: alignmentData?.description,
                })}
              />
            )}
            {!renderGraph && (
              <NoGraphRenderedError>
                <h1>No Graph Available</h1>
                <p>
                  The requested alignment is too big to safelly render a graph.
                </p>
              </NoGraphRenderedError>
            )}
          </GraphContainer>

          <TextResults
            alignment={alignmentData?.alignment}
            resetValues={resetValues}
            graph={graph}
          />
        </Container>
      )}

      {render === 1 && errors === 0x000 && (
        <Container render={render}>
          <h2>
            {alignmentInfo?.statistics.names[0]}
            <br />
            vs.
            <br />
            {alignmentInfo?.statistics.names[1]}
          </h2>

          <div className="cards">
            <ResultsCard className="m-r25">
              <h3>Global Statistics</h3>
              <hr />
              {alignmentInfo?.statistics.globalStatistics.map((line, i = 0) => (
                <p key={i++}>{line}</p>
              ))}
            </ResultsCard>

            <ResultsCard className="m-l25">
              <h3>Stage I Results</h3>
              <hr />
              {alignmentInfo?.statistics.stageIStatistics.map((line, i = 0) => (
                <p key={i++}>{line}</p>
              ))}
            </ResultsCard>
          </div>
        </Container>
      )}

      {render === 2 && (
        <Sidemenu isToggled={isToggled}>
          <div className="sidemenu-container">
            <h3>Alignment Information</h3>
            <br />
            <pre>{alignmentInfo?.statistics.names[0]}</pre>
            <pre>
              Type:
              {` ${Origins[alignmentInfo?.sequences[0].origin! - 1]}`}
            </pre>
            <pre>Alignment: N/A</pre>
            <pre>
              Size:
              {AlignmentUtils.formatSequenceSize(
                alignmentInfo?.sequences[0].size!,
              )}
            </pre>

            <br />

            <pre>{alignmentInfo?.statistics.names[1]}</pre>
            <pre>
              Type:
              {` ${Origins[alignmentInfo?.sequences[1].origin! - 1]}`}
            </pre>
            <pre>Alignment: N/A</pre>
            <pre>
              Size:
              {AlignmentUtils.formatSequenceSize(
                alignmentInfo?.sequences[1].size!,
              )}
            </pre>

            <br />
            <br />

            <h3>Global Statistics</h3>
            <br />
            {alignmentInfo?.statistics.globalStatistics.map((line, i = 0) => (
              <pre key={i++}>{line}</pre>
            ))}

            <br />
            <br />

            <h3>Stage I Statistics</h3>
            <br />
            {alignmentInfo?.statistics.stageIStatistics.map((line, i = 0) => (
              <pre key={i++}>{line}</pre>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              setIsToggled(!isToggled);
            }}
          >
            More Information
            <MdArrowDropDown size={20} color="#333" />
          </button>
        </Sidemenu>
      )}

      {render === 0 && errors === 0x0000 && (
        <FrozenScreen isToggled={render === 0} />
      )}

      {errors !== 0x0000 && (
        <ErrorContainer>
          <h1>
            OPS
            <span>!</span>
          </h1>
          <p>
            There was an error while rendering your results. Try refreshing the
            page.
          </p>
          <p>
            If the error persists, request a new alignment or contact our team.
          </p>
        </ErrorContainer>
      )}
    </>
  );
};

export default Results;
