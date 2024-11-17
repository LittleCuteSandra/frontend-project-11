import onChange from 'on-change';
import i18next from 'i18next';
import * as yup from 'yup';
import axios from 'axios';

import render from './view.js';
import resources from './locale/index.js';
import parse from './parser.js';

const loadingStatus = {
  LOADING: 'loading',
  READY: 'ready',
};

const validateURL = (url, addedURL) => {
  let schema = yup.object({
    url: yup.string().url().required().notOneOf(addedURL),
  });
  return schema.validate({ url });
};

const createi18nInstance = () => {
  const i18nInstance = i18next.createInstance();
  i18nInstance.init({
    lng: 'ru',
    debug: false,
    resources,
  });
  return i18nInstance;
};

const createErri18nInstance = () => {
  yup.setLocale({
    mixed: {
      default: 'unknownErr',
    },
    string: {
      url: 'notValidLinkErr',
      required: 'emptyFieldErr',
      notOneOf: 'existRSSErr',
    },
  });
};

const getFeed = (feedsLength, parseData, url) => {
  return {
    id: feedsLength + 1,
    title: parseData.title,
    description: parseData.description,
    url,
  };
};

const getPosts = (parseData, state) => {
  return parseData.map((post, index) => {
    const id = state.posts.length + index + 1;
    const feedID = state.feeds.length + 1;
    return { id, ...post, feedID };
  });
};

const updatePosts = (state, interval = 5000) => {
  setTimeout(() => {
    const promises = state.feeds.map(({ url }) => axios.get(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}&disableCache=true`)
      .then((response) => {
        const parseFeedData = parse(response.data.contents).posts;
        const statePostsID = state.posts.map(({ id }) => id);
        const posts = getPosts(parseFeedData, state);
        const newPosts = posts.filter(({ id }) => statePostsID.includes(id));
        state.posts = [...state.posts, ...newPosts];
      })
      .catch((err) => console.log(err))
    );
    Promise.all(promises)
      .finally(() => updatePosts(state));
  }, interval);
};

const runApp = () => {
  const state = {
    feeds: [],
    posts: [],
    form: {
      validStatus: '',
      feedback: '',
    },
    loadingProcess: {
      status: '',
    },
    ui: {
      seenPosts: [],
    },
  };

  const i18nextInstance = createi18nInstance();
  createErri18nInstance();

  const watchedState = onChange(state, (path, value) => {
    render(state, i18nextInstance, path, value);
  });

  const form = document.querySelector('form');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    watchedState.loadingProcess.status = loadingStatus.LOADING;
    const formData = new FormData(event.target);
    const url = formData.get('url');
    const addedFeeds = state.feeds.map((feed) => feed.url);
    validateURL(url, addedFeeds)
      .then(() => axios.get(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}&disableCache=true`))
      .then((response) => {
        const parseData = parse(response.data.contents);
        if (!parseData.parsed) {
          watchedState.form.validStatus = 'not valid';
          watchedState.form.feedback = parseData.errName;
        } else {
          const feed = getFeed(state.feeds.length, parseData, url);
          const posts = getPosts(parseData.posts, state);
          watchedState.feeds.push(feed);
          watchedState.posts = [...state.posts, ...posts];
          watchedState.form.validStatus = 'valid';
          watchedState.form.feedback = 'successRSS';
        }
        watchedState.loadingProcess.status = loadingStatus.READY;
        updatePosts(state);
      })
      .catch((err) => {
        watchedState.form.validStatus = 'not valid';
        switch (err.name) {
          case 'AxiosError':
            watchedState.form.feedback = 'networkErr';
            break;
          case 'ValidationError':
            if (err.errors[0] === 'notValidLinkErr') {
              watchedState.form.feedback = 'notValidLinkErr';
            } else {
              watchedState.form.feedback = 'existRSSErr';
            }
            break;
          default:
            watchedState.form.feedback = 'unknownErr';
            break;
        }
        watchedState.loadingProcess.status = loadingStatus.READY;
      });
  });
};

export default runApp();
