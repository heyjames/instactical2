import axios from 'axios';

const apiEndpoint = "http://localhost:3001/api/users";

// // Alternative method to get current user object
// export function getUser() {
//   return axios.get(apiEndpoint + "/" + "profile");
// }

// export function saveAbout(about) {
//   return axios.put(apiEndpoint, about);
// }

export function register(user) {
  return axios.post(apiEndpoint, {
    email: user.username,
    password: user.password,
    name: user.name
  });
}