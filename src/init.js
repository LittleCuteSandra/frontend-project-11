import onChange from 'on-change';
//import i18next from 'i18next';
import * as yup from 'yup';

import render from './view.js';

const validateURL = (url, addedURL) => {
  let schema = yup.object({
    url: yup.string().url().required().notOneOf(addedURL),
  });
  return schema.validate({ url });
};

const runApp = () => {
  const state = {
    feeds: [], // фиды
    posts: [], // посты
    form: { // состояние формы
      isValid: true,
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

  // создание экземпляра i18next
  //const i18nextInstance = i18next.createInstance();
  //await i18nextInstance.init({
    //lng: 'ru',
    //resources: /* переводы */
  //});


  const watchedState = onChange(state, () => {
    render(state);
  });

  const form = document.querySelector('form');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target); // formData содержит данные из формы, которая была отправлена
    const url = formData.get('url');
    const addedFeeds = state.feeds.map((feed) => feed.url);
    validateURL(url, addedFeeds)
      .then(() => {
        watchedState.feeds.push({url: url});
        watchedState.form.isValid = true;
      })
      .catch((error) => {
        watchedState.form.isValid = false;
      });
  });
};

export default runApp();
