import axios from 'axios';

const api = axios.create({
  baseURL: 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi',
});

export default api;
