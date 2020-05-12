import React /*, { useEffect, useState, useCallback }*/ from 'react';
// import { RouteComponentProps } from 'react-router';
import ReactEcharts from 'echarts-for-react';
import { MdArrowDropDown } from 'react-icons/md';

import { Container, GraphContainer, TextContainer, Sidemenu } from './styles';

// import api from '../../services/apiClient';

import Header from '../../components/Header';
import FrozenScreen from '../../components/FrozenScreen';

// import TextChunk from '../../services/MASA-Viewer/TextChunk';
// import TextChunkSum from '../../services/MASA-Viewer/TextChunkSum';

import ResultsText from './results';

const options = {
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      data: [820, 932, 901, 934, 1290, 1330, 1320],
      type: 'line',
    },
  ],
};

const Results: React.FC = () => {
  return (
    <>
      <Header />
      <Container>
        <GraphContainer>
          <ReactEcharts option={options} />
        </GraphContainer>

        <TextContainer>
          <div className="results-card">
            <div className="results-text">
              <pre>{ResultsText.results}</pre>
            </div>

            <div className="results-summary">
              <pre>{ResultsText.sumary}</pre>
            </div>
          </div>
        </TextContainer>
      </Container>

      <Sidemenu>
        <div className="sidemenu-container">
          <pre>{ResultsText.statistics}</pre>
        </div>

        <button type="button">
          More Information
          <MdArrowDropDown size={20} color="#333" />
        </button>
      </Sidemenu>

      <FrozenScreen isToggled={false} />
    </>
  );
};

export default Results;
