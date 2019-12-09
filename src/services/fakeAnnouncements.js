
import axios from 'axios';

// const announcements = [
//   {
//     _id: "1",
//     pinned: "1",
//     createdAt: "2019-01-23 21:49:25.085",
//     content: "Server is constantly undergoing changes (especially the difficulty e.g. bot count among other things). Check back occasionally. Especially after mod tools are released.",
//     author: "James"
//   },
//   {
//     _id: "2",
//     pinned: "2",
//     createdAt: "2019-01-23 21:49:25.085",
//     content: "Public XP Server is online.",
//     author: "James"
//   },
//   {
//     _id: "3",
//     pinned: "0",
//     createdAt: "2019-01-23 21:49:25.085",
//     content: "Updated guidelines, removed idle player kick, removed \"wave\" system (doesn't scale with player count), and added the TeamSpeak server. Use the same IP as the Dallas server in your TeamSpeak bookmarks and ask me for the password.",
//     author: "James"
//   },
//   {
//     _id: "4",
//     pinned: "0",
//     createdAt: "2019-01-23 21:49:25.085",
//     content: "Updated guidelines.",
//     author: "James"
//   },
//   {
//     _id: "5",
//     pinned: "0",
//     createdAt: "2019-01-23 21:49:25.085",
//     content: "Updated guidelines 2.",
//     author: "James"
//   },
//   {
//     _id: "6",
//     pinned: "0",
//     createdAt: "2019-01-23 21:49:25.085",
//     content: "Updated guidelines 3.",
//     author: "James"
//   }
// ];
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
  return announcementPreview.slice(0, 2);
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