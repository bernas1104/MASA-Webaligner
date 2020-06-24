import React, {
  useRef,
  useState,
  HTMLAttributes,
  useEffect,
  useCallback,
} from 'react';

import { Container } from './styles';

import Alignment from '../../../../services/MASA-Viewer/Alignment';
import SequenceWithGaps from '../../../../services/MASA-Viewer/SequenceWithGaps';
import TextChunk from '../../../../services/MASA-Viewer/TextChunk';
import TextChunkSum from '../../../../services/MASA-Viewer/TextChunkSum';

import Button from '../../../../components/Button';
import TextInput from '../../../../components/TextInput';
import { useToast } from '../../../../hooks/ToastContext';

interface TextResultsProps extends HTMLAttributes<HTMLDivElement> {
  alignment?: Alignment;
  resetValues: number[];
  graph: {
    xAxis: number[];
    yAxis: number[];
    range: number;
  } | null;
}

interface ChunksProps {
  chunks: string[];
  chunkSum: string;
}

const TextResults: React.FC<TextResultsProps> = ({
  alignment,
  resetValues,
  graph,
}) => {
  const { addToast } = useToast();

  const chunksRef = useRef<HTMLDivElement>(null);
  const chunksSumRef = useRef<HTMLDivElement>(null);

  const [alignmentData, setAlignmentData] = useState<Alignment | undefined>(
    alignment,
  );
  const [alignmentText, setAlignmentText] = useState<ChunksProps | null>(null);
  const [min, setMin] = useState('');
  const [max, setMax] = useState('');
  const [downloadChunks, setDownloadChunks] = useState<string[]>([]);
  const [downloadChunkSum, setDownloadChunkSum] = useState<string>('');

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
      !alignmentData?.getAlignmentWithGaps(0).isDone() &&
      !alignmentData?.getAlignmentWithGaps(1).isDone()
    );
  }, [alignmentData]);

  const getSeq0WithGaps = useCallback((): SequenceWithGaps => {
    return alignmentData?.getAlignmentWithGaps(0)!;
  }, [alignmentData]);

  const getSeq1WithGaps = useCallback((): SequenceWithGaps => {
    return alignmentData?.getAlignmentWithGaps(1)!;
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

      const nroMin = Number(min);
      const nroMax = Number(max);

      let error = false;

      if (!reset) {
        if (
          nroMin < resetValues[0] ||
          nroMin > nroMax ||
          nroMax > resetValues[1]
        ) {
          error = true;

          addToast({
            type: 'error',
            title: 'Adjustment Error',
            description: `Make sure the limits are between ${resetValues[0]} and ${resetValues[1]}, and the inferior limit is smaller than the superior limit`,
          });
        }
      }

      if (!error) {
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
            let offsetY0 = alignmentData.getSequenceOffset(1, y0);
            let offsetY1 = alignmentData.getSequenceOffset(1, y1) + 1;
            let offsetX0 = alignmentData.getSequenceOffset(0, x0);
            let offsetX1 = alignmentData.getSequenceOffset(0, x1) + 1;

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

            let data = alignmentData;
            data = data.truncate(offset0, offset1);
            setAlignmentData(data);
          }
        }, 500);
      }
    },
    [alignmentData, binSearch, graph, resetValues, min, max, addToast],
  );

  const handleDownloadResults = useCallback(() => {
    const element = document.createElement('a');
    const file = new Blob(
      [`${downloadChunks.join('\n')}\n\n${downloadChunkSum}`],
      {
        type: 'text/plain;charset=utf-8',
      },
    );
    element.href = URL.createObjectURL(file);
    element.download = 'results.txt';
    document.body.appendChild(element);
    element.click();
  }, [downloadChunks, downloadChunkSum]);

  useEffect(() => {
    if (alignmentData) {
      alignmentData
        .getAlignmentWithGaps(0)
        .reset(
          alignmentData.getSequenceStartOffset(0),
          alignmentData.getSequenceEndOffset(0),
        );
      alignmentData
        .getAlignmentWithGaps(1)
        .reset(
          alignmentData.getSequenceStartOffset(1),
          alignmentData.getSequenceEndOffset(1),
        );

      const textChunkSum = new TextChunkSum(
        alignmentData.getAlignmentParams().getMatch(),
        alignmentData.getAlignmentParams().getMismatch(),
        alignmentData.getAlignmentParams().getGapOpen(),
        alignmentData.getAlignmentParams().getGapExtension(),
      );

      const chunks: string[] = [];
      const dChunks: string[] = [];
      while (hasMoreChunks()) {
        const chunk = getNextChunk(60, textChunkSum);
        chunks.push(chunk.getHTMLString());
        dChunks.push(chunk.getTextString());
      }

      setAlignmentText({
        chunks,
        chunkSum: textChunkSum.getHTMLString(),
      });

      setDownloadChunks(dChunks);
      setDownloadChunkSum(textChunkSum.getTextString());
    }
  }, [alignmentData, getNextChunk, hasMoreChunks]);

  useEffect(() => {
    if (alignmentText) {
      if (chunksRef.current)
        chunksRef.current.innerHTML = alignmentText.chunks.join('');
      if (chunksSumRef.current)
        chunksSumRef.current.innerHTML = alignmentText.chunkSum;
    }
  }, [alignmentText]);

  return (
    <Container>
      <div className="results-card">
        <div className="results-text" ref={chunksRef} />

        <div className="results-summary">
          <div className="summary" ref={chunksSumRef} />

          <div className="adjust">
            <TextInput
              name="min"
              placeholder="Ex: 423"
              value={min}
              onChange={(event) => {
                setMin(event.target.value);
              }}
            >
              Inferior limit
            </TextInput>
            <TextInput
              name="max"
              placeholder="Ex: 9794"
              value={max}
              onChange={(event) => {
                setMax(event.target.value);
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

        <Button
          value="Download results"
          onClick={() => handleDownloadResults()}
        />
      </div>
    </Container>
  );
};

export default TextResults;
