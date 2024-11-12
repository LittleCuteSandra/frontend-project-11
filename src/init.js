import onChange from 'on-change';
import i18next from 'i18next';
import * as yup from 'yup';
import axios from 'axios';

import render from './view.js';
import resources from './locale/index.js';
import parse from './parser.js';

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

const runApp = () => {
  const state = {
    feeds: [],
    posts: [],
    form: {
      isValid: true,
      error: '',
    },
    loadingProcess: { // состояние процесса загрузки
      status: '', // success, fail, loading
    },
    ui: {
      seenPosts: [],
    },
  };

  const i18nextInstance = createi18nInstance();
  createErri18nInstance();

  const watchedState = onChange(state, () => {
    render(state, i18nextInstance);
  });

  const form = document.querySelector('form');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target); // formData содержит данные из формы, которая была отправлена
    const url = formData.get('url');
    const addedFeeds = state.feeds.map((feed) => feed.url);
    validateURL(url, addedFeeds)
      .then(() => axios.get(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}&disableCache=true`))
      .then((response) => {
        const parseData = parse(response.data.contents);
        if (!parseData.parsed) {
          watchedState.form.error = parseData.errName;
          watchedState.form.isValid = false;
        } else {
          const feed = {
            id: state.feeds.length + 1,
            title: parseData.title,
            description: parseData.description,
            url: url,
          };
          const posts = parseData.posts.map((post, index) => {
            const id = state.posts.length + index + 1;
            const feedID = state.feeds.length + 1;
            return { id, ...post, feedID };
          });
          watchedState.feeds.push(feed);
          watchedState.posts = [...state.posts, ...posts];
          watchedState.form.isValid = true;
        }
      })
      .catch((err) => {
        watchedState.form.isValid = false;
        switch (err.name) {
          case 'AxiosError':
            watchedState.form.error = 'networkErr';
            break;
          case 'ValidationError':
            if (err.errors[0] === 'notValidLinkErr') {
              watchedState.form.error = 'notValidLinkErr';
            } else {
              watchedState.form.error = 'existRSSErr';
            }
            break;
          default: 
            watchedState.form.error = 'unknownErr';
            break;
        }
      });
  });
};

export default runApp();
