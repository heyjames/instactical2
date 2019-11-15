const blogPosts = [
  {
    _id: "1",
    createdAt: "2019-01-23 21:49:25.085",
    featured: "1",
    title: "Launch day!",
    content: "<p>Started this at the beginning of the month to fill a niche play style in Sandstorm. It was a good way to improve my web dev skills, support the game, and just bring several passions of mine together.</p><p>I encountered several issues and I chose to cut a couple features, but the important things are here. I'm going to re-do the entire site now that I know what it should look like, what I want to implement, what I need to learn, etc. I'll just take my time on version 2.</p>",
    author: "James",
    img: "/posts/launch.png",
    label: "Launch Day!",
    slug: "launch-day"
  },
  {
    _id: "2",
    createdAt: "2019-01-23 21:49:25.085",
    featured: "0",
    title: "Server Info",
    content: "<p>They will automatically check to see if it's running every single minute and will restart itself if it ever crashes.</p><p>Since the server seems to \"age\" (sluggish performance, stutters, rubber-banding after a few hours), I made a script to restart the server several times in 24 hours. It will only restart if the server is empty, otherwise it will check to restart at the next best available time when no one is playing. Bash scripting was interesting with multiple ways of doing one thing, but it's so satisfying to see the server \"take care of itself.\"</p><p>Periodic display of rules in the chat is also supported.</p><p>I also made other improvements that help me easily start, stop, restart server and log these events. They run on Linux, and each one currently costs $10/month.</p>",
    author: "James",
    img: "/posts/server-info.png",
    label: "Server Info",
    slug: "server-info"
  },
  {
    _id: "3",
    createdAt: "2019-01-23 21:49:25.085",
    featured: "0",
    title: "Dallas Hiatus",
    content: "<p>The player activity in the private server is nonexistent (which is completely fine) while we're still in the early stages of this community--especially with the game's dwindling player count as players patiently wait for the February patch to resolve the game's major issues.</p><p>So, hearing about #chilokids from Philip DeFranco, a news commentator on YouTube, I decided to put Dallas's server cost towards this charity instead.</p><p>Dallas will return when I feel the time is appropriate.</p>",
    author: "James",
    img: "/posts/dallas-hiatus.png",
    label: "Dallas Hiatus",
    slug: "dallas-hiatus"
  },
  {
    _id: "4",
    createdAt: "2019-01-23 21:49:25.085",
    featured: "0",
    title: "Dallas Server Returns",
    content: "<p>Dallas server is being brought back to replace the San Francisco server. This way, the ping from anyone in the US will be no greater than 90ms. Without mod support and limited server configuration options, it's difficult to keep the enjoyment factor up, so I might shut down all servers until then.</p>",
    author: "James",
    img: "/posts/dallas-returns.png",
    label: "Dallas Returns",
    slug: "dallas-returns"
  }
];

export function getBlogPosts() {
  return blogPosts.sort((a, b) => (a._id < b._id) ? 1 : -1);
}

export function getBlogPreview() {
  return blogPosts.sort((a, b) => (a._id < b._id) ? 1 : -1).slice(0, 3);
}

export function getBlogPost(slug) {
  // console.log("1: " + slug)
  return blogPosts.find(p => p.slug === slug);
}

export function getFeaturedPost() {
  return blogPosts.find(post => post.featured === "1");
}