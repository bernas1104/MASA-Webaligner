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
  const chunksRef = useRef<HTMLDivElement>(null);
  const chunksSumRef = useRef<HTMLDivElement>(null);

  const [tries, setTries] = useState(0);
  const [isToggled, setIsToggled] = useState(false);

  const [alignmentData, setAlignmentData] = useState<AlignmentProps | null>(
    null,
  );
  const [alignmentInfo, setAlignmentInfo] = useState<AlignmentInfoProps | null>(
    null,
  );
  const [alignmentText, setAlignmentText] = useState<ChunksProps | null>(null);
  const [graph, setGraph] = useState<GraphProps | null>(null);
  const [min, setMin] = useState('');
  const [max, setMax] = useState('');

  const [render, setRender] = useState(0);

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
    const { id } = routeProps.match.params;

    api.get(`alignments-exist/${id}`).then((response) => {
      const {
        data: { exists },
      } = response;

      if (exists) setTries(0);
      else {
        console.log('ERROR: 0x0001');
      }
    });
  }, [props]);

  useEffect(() => {
    async function fetchAlignment(id: string): Promise<void> {
      const {
        data: { alignment, sequences },
      } = await api.get(`alignments/${id}`);

      const { only1 } = alignment;

      if (only1) {
        setAlignmentInfo({
          alignment,
          sequences,
        });
      } else {
        const { data: binary } = await api.get(`files/bin/${id}`);

        const { data: fasta } = await api.get(`files/fasta/${id}`);

        setAlignmentInfo({
          alignment,
          sequences,
          binary,
          fasta,
        });
      }
    }

    const routeProps = props;
    const { id } = routeProps.match.params;

    api.get(`alignments-ready/${id}`).then((response) => {
      const {
        data: { isReady },
      } = response;

      if (isReady) {
        fetchAlignment(id);
      } else {
        setTimeout(() => {
          setTries(tries + 1);
        }, 5000 * tries);
      }
    });
  }, [props, tries]);

  useEffect(() => {
    if (alignmentInfo && alignmentInfo.binary) {
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

      alignment
        .getAlignmentWithGaps(0)
        .reset(
          alignment.getSequenceStartOffset(0),
          alignment.getSequenceEndOffset(0),
        );
      alignment
        .getAlignmentWithGaps(1)
        .reset(
          alignment.getSequenceStartOffset(1),
          alignment.getSequenceEndOffset(1),
        );

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

      setAlignmentData({
        alignment,
        description,
      });
    }
  }, [alignmentInfo]);

  useEffect(() => {
    if (alignmentData) {
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
    if (!alignmentInfo?.alignment.only1 && alignmentData) {
      const s0gapped = alignmentData?.alignment.getAlignmentWithGaps(0).getSB();
      const s1gapped = alignmentData?.alignment.getAlignmentWithGaps(1).getSB();

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
                ? xAxis.push((x += 1))
                : xAxis.push((x -= 1));
              alignmentData?.alignment.getDir(1) === 1
                ? yAxis.push((y += 1))
                : yAxis.push((y -= 1));
            } else if (s0gapped[i] !== '-' && s1gapped[i] !== '-') {
              alignmentData?.alignment.getDir(0) === 1
                ? xAxis.push((x += 1))
                : xAxis.push((x -= 1));
              alignmentData?.alignment.getDir(1) === 1
                ? yAxis.push((y += 1))
                : yAxis.push((y -= 1));
            } else if (s0gapped[i] === '-') {
              xAxis.push(x);
              alignmentData?.alignment.getDir(1) === 1
                ? yAxis.push((y += 1))
                : yAxis.push((y -= 1));
            } else {
              alignmentData?.alignment.getDir(0) === 1
                ? xAxis.push((x += 1))
                : xAxis.push((x -= 1));
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
        if (chunksRef.current)
          chunksRef.current.innerHTML = alignmentText?.chunks.join('')!;
        if (chunksSumRef.current)
          chunksSumRef.current.innerHTML = alignmentText?.chunkSum!;
      }
    }
  }, [alignmentText, alignmentInfo, alignmentData]);

  useEffect(() => {
    console.log(min, max);
  }, [min, max]);

  return (
    <>
      <Header />
      {render === 2 && (
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

                <form>
                  <TextInput
                    name="min"
                    value={min}
                    onChange={(e) => setMin(e.target.value)}
                    placeholder="Ex: 423"
                  >
                    Inferior limit
                  </TextInput>
                  <TextInput
                    name="max"
                    value={max}
                    onChange={(e) => setMax(e.target.value)}
                    placeholder="Ex: 9794"
                  >
                    Superior limit
                  </TextInput>
                  <Button
                    type="submit"
                    value="Adjust"
                    onClick={(e) => e.preventDefault()}
                  />
                </form>
              </div>
            </div>
          </TextContainer>
        </Container>
      )}

      {render === 1 && (
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
              <pre>{ResultsText.stageIResults}</pre>
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

      {render === 0 && <FrozenScreen isToggled={render === 0} />}
    </>
  );
};

export default Results;
