const parsePosts = (posts) => {
  const postsArray = [];
  posts.forEach((post) => {
    const title = post.querySelector('title').textContent;
    const description = post.querySelector('description').textContent;
    const link = post.querySelector('link').textContent;
    postsArray.push({
      title,
      description,
      link,
    });
  });

  return postsArray;
};

const parse = (data) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(data, 'application/xml');

  const error = xmlDoc.querySelector('parsererror');
  if (error) {
    console.log(error);
    return {
      parsed: false,
      errName: 'notValidRSSErr',
    };
  }
  const title = xmlDoc.querySelector('title').textContent;
  const description = xmlDoc.querySelector('description').textContent;
  const posts = parsePosts(xmlDoc.querySelectorAll('item'));
  return {
    parsed: true,
    title,
    description,
    posts,
  };
};

export default parse;
