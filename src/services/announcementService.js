
import axios from 'axios';

const apiEndpoint = "http://localhost:3001/api/announcements";

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

export function addAnnouncement() {

}

// export function getAnnouncements() {
//   return announcements;
// }

// export function saveAnnouncement(announcement) {
//   let announcementInDb = announcements.find(a => a._id === announcement._id || {});
//   announcementInDb.content = announcement.announcement;

//   if (!announcementInDb._id) {
//     announcementInDb._id = Date.now().toString();
//     announcements.push(announcementInDb);
//   }

//   return announcementInDb;
// }

// export function getAnnouncement(id) {
//   return announcements.find(a => a._id === id)
// }

// export function getAnnouncementsPreview() {
//   return announcements.slice(0, 3);
// }