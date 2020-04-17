import axios from 'axios';

const apiEndpoint = "http://localhost:3001/api/blogposts";

export async function getBlogPosts() {
  const { data } = await axios.get(apiEndpoint);
  return data.sort((a, b) => (a._id < b._id) ? 1 : -1);
}

export async function getBlogPost(id) {
  const { data } = await axios.get(apiEndpoint);
  let result = await data.find(a => a.slug == id);
  return result;
}

export async function getBlogPreview() {
  const { data } = await axios.get(apiEndpoint);
  return data.sort((a, b) => (a._id < b._id) ? 1 : -1).slice(0, 2);
}

export function deleteBlogPost(blogPostSlug) {
  return axios.delete(apiEndpoint + "/" + blogPostSlug);
}

export function saveBlogPost(blogPost) {
  return axios.put(apiEndpoint + "/" + blogPost.slug, blogPost);
}

export function createBlogPost(blogPost) {
  return axios.post(apiEndpoint, blogPost);
}

export async function getFeaturedPost() {
  const { data } = await axios.get(apiEndpoint);
  return data.find(post => post.featured === "1");
}