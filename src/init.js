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
    feeds: [], // фиды
    posts: [], // посты
    form: { // состояние формы
      isValid: true,
      error: '',
    },
    loadingProcess: { // состояние процесса загрузки
      status: '', // success, fail, loading
      //errors: ['Имя не заполнено', 'Адрес имеет неверный формат'],
      // validationState: 'invalid' // или valid
    },
    ui: { // состояние интерфейса
      seenPosts: [],
    },
  };

  const i18nextInstance = createi18nInstance();
  createErri18nInstance();

  const watchedState = onChange(state, (path, value) => {
    //if (path === 'registrationForm.state') {
      //if (value === 'invalid') {
        // Отрисовка ошибок, хранящихся где-то в состоянии
        // watchedState.registrationForm.errors
      //}
    //}
    // РАЗГРУЗИТЬ РЕНДЕР, ЧТОБЫ ОН КАЖДЫЙ РАЗ ВСЮ СТРАНИЦУ НЕ РЕНДЕРИЛ, А ТОЛЬКО НУЖНЫЕ КУСКИ
    // можно передавать в рендер часть, которая изменилась(её название), и в функции рендера сделать разделение на изменение этих кусков
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
        const feed = {
          id: state.feeds.length + 1,
          title: parseData.title,
          description: parseData.description,
        };
        const posts = parseData.posts.map((post, index) => {
          const id = state.posts.length + index + 1;
          const feedID = state.feeds.length + 1;
          return { id, ...post, feedID };
        });
        watchedState.feeds.push(feed);
        watchedState.posts = [...state.posts, ...posts];
        watchedState.form.isValid = true;
      })
      .catch((err) => {
        watchedState.form.isValid = false;
        console.log(err);
        //watchedState.form.error = err.errors[0];
      });
  });
};

export default runApp();
