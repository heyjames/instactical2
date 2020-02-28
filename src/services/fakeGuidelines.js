import axios from 'axios';
const apiEndpoint = "http://localhost:3001/api/guidelines";

const guidelines =
  {
    _id: "1",
    content: "Objectives / Caches"
  };

// Simulate timer
async function sleep(sec) {
  return new Promise(resolve => { setTimeout(() => resolve(), sec * 1000) });
}

export function getGuidelines() {
  // await sleep(2);
  return axios.get(apiEndpoint);
}

export function saveGuidelines(guidelines) {
  // await sleep(2);
  return axios.put(apiEndpoint, guidelines);
}