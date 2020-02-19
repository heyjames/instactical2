
import axios from 'axios';

const apiEndpoint = "http://localhost:3001/api/blogposts";

export function getBlogPosts() {
  return axios.get(apiEndpoint);
}

export async function getBlogPost(id) {
  const { data } = await axios.get(apiEndpoint);
  return data.find(a => a.slug == id);
  // let result = data.find(a => a.slug == id);
  // return result;
}

export async function getBlogPreview() {
  const { data } = await axios.get(apiEndpoint);
  return data.sort((a, b) => (a._id < b._id) ? 1 : -1).slice(0, 2);
}

export function deleteBlogPost(blogPostSlug) {
  // console.log("OVER HERE!")
  // console.log(apiEndpoint + "/" + blogPostSlug);
  return axios.delete(apiEndpoint + "/" + blogPostSlug);
}

export function saveBlogPost(blogPost) {
  // console.log(blogPost);
  return axios.put(apiEndpoint + "/" + blogPost.slug, blogPost);
}

export function createBlogPost(blogPost) {
  return axios.post(apiEndpoint, blogPost);
}

export async function getFeaturedPost() {
  const { data } = await axios.get(apiEndpoint);
  // console.log(data.find(post => post.featured === "1"));
  return data.find(post => post.featured === "1");
}