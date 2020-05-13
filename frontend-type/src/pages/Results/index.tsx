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

import ResultsText from './results';
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
  binary?: {
    data: Buffer[];
    type: string;
  };
  fasta?: {
    s0file: string;
    s1file: string;
  };
  stage1?: {
    bestScoreInformation: {
      bestPosition: number[];
      bestScore: number;
    };
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

const Results: React.FC<ResultsProps> = (props) => {
  const minmax = [1, 1];

  const chunksRef = useRef<HTMLDivElement>(null);
  const chunksSumRef = useRef<HTMLDivElement>(null);

  const [tries, setTries] = useState(0);
  const [isToggled, setIsToggled] = useState(false);

  const [id, setId] = useState('');
  const [alignmentData, setAlignmentData] = useState<AlignmentProps | null>(
    null,
  );
  const [alignmentInfo, setAlignmentInfo] = useState<AlignmentInfoProps | null>(
    null,
  );
  const [alignmentText, setAlignmentText] = useState<ChunksProps | null>(null);
  const [graph, setGraph] = useState<GraphProps | null>(null);
  const [resetValues, setResetValues] = useState<number[]>([]);

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

  useEffect(() => {
    if (chunksRef.current && chunksSumRef.current) {
      chunksRef.current.innerHTML = '';
      chunksSumRef.current.innerHTML = '';
    }

    const routeProps = props;
    const { id: alignmentId } = routeProps.match.params;

    api.get(`alignments-exist/${alignmentId}`).then((response) => {
      const {
        data: { exists },
      } = response;

      if (exists) setId(alignmentId);
      else setErrors(0x0001);
    });
  }, [props]);

  useEffect(() => {
    async function fetchAlignment(): Promise<void> {
      const {
        data: { alignment, sequences },
      } = await api.get(`alignments/${id}`);

      const { only1 } = alignment;

      if (only1) {
        const { data: stage1 } = await api.get(`files/stage-i/${id}`);

        console.log(stage1);

        setAlignmentInfo({
          alignment,
          sequences,
          stage1,
        });
        setRender(1);
      } else {
        try {
          const { data: binary } = await api.get(`files/bin/${id}`);

          try {
            const { data: fasta } = await api.get(`files/fasta/${id}`);

            setAlignmentInfo({
              alignment,
              sequences,
              binary,
              fasta,
            });
          } catch (err) {
            setErrors(0x0004);
          }
        } catch (err) {
          setErrors(0x0002);
        }
      }
    }

    if (id !== '') {
      api.get(`alignments-ready/${id}`).then((response) => {
        const {
          data: { isReady },
        } = response;

        if (isReady) {
          fetchAlignment();
        } else {
          setTimeout(() => {
            setTries(tries + 1);
          }, 5000 * tries);
        }
      });
    }
  }, [id, tries]);

  useEffect(() => {
    if (alignmentInfo) {
      if (!alignmentInfo.alignment.only1 && alignmentInfo.binary) {
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
    }
  }, [alignmentData, getNextChunk, hasMoreChunks]);

  useEffect(() => {
    if (graph === null) {
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

          setRender(2);
        }
      }
    }
  }, [alignmentText, alignmentInfo, alignmentData, graph]);

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

  const handleAdjustTextResults = useCallback(
    (event: React.MouseEvent, reset: boolean) => {
      event.preventDefault();

      setTimeout(() => {
        if (alignmentData && graph) {
          const xRange = reset === false ? minmax : [...resetValues];

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
    [alignmentData, binSearch, graph, resetValues, minmax],
  );

  useEffect(() => {
    console.log(alignmentInfo?.stage1?.bestScoreInformation.bestPosition);
  }, [alignmentInfo]);

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
                    onChange={(event) => {
                      const value = parseInt(event.target.value, 10);

                      if (
                        value <
                        alignmentData?.alignment.getSequenceStartPosition(0)!
                      ) {
                        minmax[0] = alignmentData?.alignment.getSequenceStartPosition(
                          0,
                        )!;
                      } else if (
                        value >
                        alignmentData?.alignment.getSequenceEndPosition(0)!
                      ) {
                        minmax[0] = alignmentData?.alignment.getSequenceEndPosition(
                          0,
                        )!;
                      } else {
                        minmax[0] = value;
                      }
                    }}
                  >
                    Inferior limit
                  </TextInput>
                  <TextInput
                    name="max"
                    placeholder="Ex: 9794"
                    onChange={(event) => {
                      const value = parseInt(event.target.value, 10);

                      if (value < minmax[0]) {
                        const tmp = minmax[0];
                        minmax[1] = tmp;
                      } else if (
                        value > minmax[0] &&
                        value <
                          alignmentData?.alignment.getSequenceEndPosition(0)!
                      ) {
                        minmax[1] = value;
                      } else {
                        minmax[1] = alignmentData?.alignment.getSequenceEndPosition(
                          0,
                        )!;
                      }
                    }}
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
            AF133821.1 HIV-1 isolate MB2059 from Kenya, complete genome
            <br />
            vs.
            <br />
            AY352275.1 HIV-1 isolate SF33 from USA, complete genome
          </h2>

          <div className="cards">
            <ResultsCard className="m-r25">
              <h3>Global Statistics</h3>
              <hr />
              <pre>{ResultsText.globalStatistics}</pre>
            </ResultsCard>

            <ResultsCard className="m-l25">
              <h3>Stage I Results</h3>
              <hr />
              <pre>{alignmentInfo?.stage1?.bestScoreInformation.bestScore}</pre>
            </ResultsCard>
          </div>
        </Container>
      )}

      {render === 2 && (
        <Sidemenu isToggled={isToggled}>
          <div className="sidemenu-container">
            <pre>{ResultsText.statistics}</pre>
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
      {errors !== 0x0000 && <h1 style={{ fontSize: 100 }}>ERROR</h1>}
    </>
  );
};

export default Results;
