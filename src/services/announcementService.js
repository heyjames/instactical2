import axios from 'axios';
// import { apiUrl } from "../config.json";

const apiEndpoint = "/announcements";

export function getAnnouncements() {
  return axios.get(apiEndpoint);
}

export async function getAnnouncement(id) {
  const { data: announcement } = await axios.get(apiEndpoint);
  return announcement.find(a => a._id === id);
}

export async function getAnnouncementsPreview() {
  const { data: announcementPreview } = await axios.get(apiEndpoint);
  return announcementPreview.sort((a, b) => (a._id < b._id) ? 1 : -1).slice(0, 4);
}

export function deleteAnnouncement(announcementId) {
  return axios.delete(apiEndpoint + "/" + announcementId);
}

export function saveAnnouncement(announcement) {
  return axios.put(apiEndpoint + "/" + announcement._id, announcement);
}

export function createAnnouncement(announcement) {
  return axios.post(apiEndpoint, announcement);
}