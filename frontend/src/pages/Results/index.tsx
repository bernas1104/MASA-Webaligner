import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RouteComponentProps } from 'react-router';
import { MdArrowDropDown } from 'react-icons/md';
import ReactEcharts from 'echarts-for-react';

import {
  Container,
  GraphContainer,
  TextContainer,
  Sidemenu,
  ResultsCard,
  ErrorContainer,
} from './styles';

import api from '../../services/apiClient';

import Header from '../../components/Header';
import FrozenScreen from '../../components/FrozenScreen';
import TextInput from '../../components/TextInput';
import Button from '../../components/Button';

import Alignment from '../../services/MASA-Viewer/Alignment';
import AlignmentBinaryFile from '../../services/MASA-Viewer/AlignmentBinaryFile';
import SequenceData from '../../services/MASA-Viewer/SequenceData';
import TextChunk from '../../services/MASA-Viewer/TextChunk';
import TextChunkSum from '../../services/MASA-Viewer/TextChunkSum';
import SequenceWithGaps from '../../services/MASA-Viewer/SequenceWithGaps';
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

interface ChunksProps {
  chunks: string[];
  chunkSum: string;
  min: number;
  max: number;
}

interface GraphProps {
  xAxis: number[];
  yAxis: number[];
  range: number;
}

const Origins = ['NCBI API', 'File Upload', 'Text Input'];

const Results: React.FC<ResultsProps> = (props) => {
  const chunksRef = useRef<HTMLDivElement>(null);
  const chunksSumRef = useRef<HTMLDivElement>(null);

  const [tries, setTries] = useState(1);
  const [isToggled, setIsToggled] = useState(false);

  const [alignmentData, setAlignmentData] = useState<AlignmentProps | null>(
    null,
  );
  const [alignmentInfo, setAlignmentInfo] = useState<AlignmentInfoProps | null>(
    null,
  );
  const [alignmentText, setAlignmentText] = useState<ChunksProps | null>(null);
  const [graph, setGraph] = useState<GraphProps | null>(null);
  const [resetValues, setResetValues] = useState<number[]>([]);
  const [min, setMin] = useState('');
  const [max, setMax] = useState('');

  const [render, setRender] = useState(0);
  const [errors, setErrors] = useState(0x0000);

  const binSearch = useCallback((arr, coord, low = true): number[] => {
    let start = 0;
    let end = arr.length - 1;
    let result: number[] = [];

    if (low) {
      while (start <= end) {
        const mid = Math.floor((start + end) / 2);

        if (arr[mid] >= coord) {
          end = mid - 1;

          if (arr[mid] === coord) result = [arr[mid], mid];
        } else {
          start = mid + 1;
        }
      }
    } else {
      while (start <= end) {
        const mid = Math.floor((start + end) / 2);

        if (arr[mid] <= coord) {
          start = mid + 1;

          if (arr[mid] === coord) result = [arr[mid], mid];
        } else {
          end = mid - 1;
        }
      }
    }

    return result;
  }, []);

  const hasMoreChunks = useCallback((): boolean => {
    return (
      !alignmentData?.alignment.getAlignmentWithGaps(0).isDone() &&
      !alignmentData?.alignment.getAlignmentWithGaps(1).isDone()
    );
  }, [alignmentData]);

  const getSeq0WithGaps = useCallback((): SequenceWithGaps => {
    return alignmentData?.alignment.getAlignmentWithGaps(0)!;
  }, [alignmentData]);

  const getSeq1WithGaps = useCallback((): SequenceWithGaps => {
    return alignmentData?.alignment.getAlignmentWithGaps(1)!;
  }, [alignmentData]);

  const getNextChunk = useCallback(
    (cols: number, textChunkSum: TextChunkSum): TextChunk => {
      const chunk = new TextChunk();

      if (hasMoreChunks()) {
        chunk.setStartPositions(
          getSeq0WithGaps().getCurrentPosition(),
          getSeq1WithGaps().getCurrentPosition(),
        );

        const chunk0 = getSeq0WithGaps().getNextChunk(cols);
        const chunk1 = getSeq1WithGaps().getNextChunk(cols);

        chunk.setEndPositions(
          getSeq0WithGaps().getCurrentPosition(),
          getSeq1WithGaps().getCurrentPosition(),
        );

        chunk.setChunks(chunk0, chunk1);

        const chunkScore = textChunkSum.sumChunk(chunk);
        chunk.setSuffix(`[${chunkScore}]/[${textChunkSum.getScore()}]`);
      }

      return chunk;
    },
    [getSeq0WithGaps, getSeq1WithGaps, hasMoreChunks],
  );

  const handleAdjustTextResults = useCallback(
    (event: React.MouseEvent, reset: boolean) => {
      event.preventDefault();

      setTimeout(() => {
        if (alignmentData && graph) {
          const xRange =
            reset === false
              ? [parseInt(min, 10), parseInt(max, 10)]
              : [...resetValues];

          setMin('');
          setMax('');

          if (xRange[0] > xRange[1]) {
            const tmp = xRange[1];
            xRange[0] = tmp;
          }

          const [x0, x0Coord] = binSearch(graph.xAxis, xRange[0]);
          const [x1, x1Coord] = binSearch(graph.xAxis, xRange[1], false);
          const y0 = graph.yAxis[x0Coord];
          const y1 = graph.yAxis[x1Coord];
          let offsetY0 = alignmentData.alignment.getSequenceOffset(1, y0);
          let offsetY1 = alignmentData.alignment.getSequenceOffset(1, y1) + 1;
          let offsetX0 = alignmentData.alignment.getSequenceOffset(0, x0);
          let offsetX1 = alignmentData.alignment.getSequenceOffset(0, x1) + 1;

          console.log(xRange, x0, x1, x0Coord, x1Coord, y0, y1, offsetY0, offsetY1, offsetX0, offsetX1);

          let tmp;
          if (offsetX0 > offsetX1) {
            tmp = offsetX0;
            offsetX0 = offsetX1;
            offsetX1 = tmp;
          }
          if (offsetY0 > offsetY1) {
            tmp = offsetY0;
            offsetY0 = offsetY1;
            offsetY1 = tmp;
          }
          let offset0 = Math.max(offsetY0, offsetX0);
          let offset1 = Math.max(offsetY1, offsetX1);
          if (offset0 < 0) offset0 = 0;
          if (offset1 < 0) offset1 = 0;

          const data = alignmentData;
          data.alignment = data.alignment.truncate(offset0, offset1);
          setAlignmentData({
            alignment: data.alignment,
            description: data.description,
          });
        }
      }, 500);
    },
    [alignmentData, binSearch, graph, resetValues, min, max],
  );

  const renderGraph = useCallback(() => {
    if(!graph){
      if (!alignmentInfo?.alignment.only1 && alignmentData) {
        const s0gapped = alignmentData?.alignment
          .getAlignmentWithGaps(0)
          .getSB();
        const s1gapped = alignmentData?.alignment
          .getAlignmentWithGaps(1)
          .getSB();

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
    async function fetchAlignmentInfo() {
      try {
        const response = await api.get(`alignments/${props.match.params.id}`)
        const { alignment, sequences, statistics } = response.data;

        if (alignment.only1) {
          setAlignmentInfo({
            alignment,
            sequences,
            statistics,
          });

          setRender(1);
        } else {
          const { data: binary } = await api.get(`files/bin/${props.match.params.id}`);
          const { data: fasta } = await api.get(`files/fasta/${props.match.params.id}`);

          setAlignmentInfo({
            alignment,
            sequences,
            statistics,
            binary,
            fasta,
          });
        }
      } catch (err) {
        if (err.message.includes('452')){
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
      renderGraph();

      alignmentData.alignment
        .getAlignmentWithGaps(0)
        .reset(
          alignmentData.alignment.getSequenceStartOffset(0),
          alignmentData.alignment.getSequenceEndOffset(0),
        );
      alignmentData.alignment
        .getAlignmentWithGaps(1)
        .reset(
          alignmentData.alignment.getSequenceStartOffset(1),
          alignmentData.alignment.getSequenceEndOffset(1),
        );

      const textChunkSum = new TextChunkSum(
        alignmentData.alignment.getAlignmentParams().getMatch(),
        alignmentData.alignment.getAlignmentParams().getMismatch(),
        alignmentData.alignment.getAlignmentParams().getGapOpen(),
        alignmentData.alignment.getAlignmentParams().getGapExtension(),
      );

      const chunks: string[] = [];
      while (hasMoreChunks()) {
        const chunk = getNextChunk(60, textChunkSum);
        chunks.push(chunk.getHTMLString());
      }

      setAlignmentText({
        chunks,
        chunkSum: textChunkSum.getHTMLString(),
        min: alignmentData.alignment.getSequenceStartPosition(0),
        max: alignmentData.alignment.getSequenceEndPosition(0),
      });

      setRender(2);
    }
  }, [alignmentData, getNextChunk, hasMoreChunks, renderGraph]);

  useEffect(() => {
    if (render === 2) {
      if (alignmentText) {
        if (chunksRef.current)
          chunksRef.current.innerHTML = alignmentText.chunks.join('');
        if (chunksSumRef.current)
          chunksSumRef.current.innerHTML = alignmentText.chunkSum;
      }
    }
  }, [render, alignmentText]);

  return (
    <>
      <Header />
      {render === 2 && errors === 0x0000 && (
        <Container render={render}>
          <GraphContainer>
            <ReactEcharts
              option={ChartOptions({
                xAxis: graph?.xAxis,
                yAxis: graph?.yAxis,
                range: graph?.range,
                description: alignmentData?.description,
              })}
            />
          </GraphContainer>

          <TextContainer>
            <div className="results-card">
              <div className="results-text" ref={chunksRef} />

              <div className="results-summary">
                <div className="summary" ref={chunksSumRef} />

                <div className="adjust">
                  <TextInput
                    name="min"
                    placeholder="Ex: 423"
                    value={min}
                    onChange={(event) => {setMin(event.target.value)}}
                  >
                    Inferior limit
                  </TextInput>
                  <TextInput
                    name="max"
                    placeholder="Ex: 9794"
                    value={max}
                    onChange={(event) => {setMax(event.target.value)}}
                  >
                    Superior limit
                  </TextInput>

                  <div className="submit">
                    <Button
                      type="submit"
                      value="Adjust"
                      onClick={(e) => {
                        handleAdjustTextResults(e, false);
                      }}
                    />
                    <Button
                      type="submit"
                      value="Reset"
                      onClick={(e) => {
                        handleAdjustTextResults(e, true);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </TextContainer>
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
          <h1>Error!</h1>
        </ErrorContainer>
      )}
    </>
  );
};

export default Results;
