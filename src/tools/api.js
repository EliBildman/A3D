import axios from 'axios';
import { headstoSpawners } from './translation';
import io from 'socket.io-client';

const api_url =
  process.env.REACT_APP_STAGE === 'dev'
    ? process.env.REACT_APP_API_DEBUG
    : process.env.REACT_APP_API_URL;

export const getHeads = async () => {
  const actionsRes = await axios.get(`${api_url}/actions`);
  const eventsRes = await axios.get(`${api_url}/events`);

  const actionHeads = actionsRes.data;
  const eventHeads = eventsRes.data;

  return headstoSpawners(actionHeads, eventHeads);
};

export const getPage = async (ind) => {
  const ret = await axios.get(`${api_url}/api/page?ind=${ind}`);
  const page = ret.data;
  return page;
};

export const savePage = async (page) => {
  return axios.post(`${api_url}/api/page`, {
    type: 'UPDATE',
    ind: page.ind,
    page,
  });
};

export const sendPageInfo = (info) => {};

export const getSocket = () => {
  return io(api_url);
};
