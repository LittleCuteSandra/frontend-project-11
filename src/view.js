const domUlNumber = {
  postsUl: 0,
  feedsUl: 1,
};

const renderShell = (title) => {
  const card = document.createElement('div');
  card.classList.add('card', 'border-0');

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  const h2 = document.createElement('h2');
  h2.classList.add('card-title', 'h4');
  h2.textContent = title;
  cardBody.append(h2);

  card.prepend(cardBody);

  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');

  card.append(ul);
  return card;
};

const setModal = (post) => {
  document.querySelector('h5').textContent = post.title;
  document.querySelector('.modal-body').textContent = post.description;
  document.querySelector('a.full-article').setAttribute('href', `${post.link}`);
};

const setPostAsViewed = (id) => {
  const a = document.querySelector(`a[data-id="${id}"]`);
  a.classList.remove('fw-bold');
  a.classList.add('fw-normal', 'link-secondary');
};

const renderPosts = (posts, seenPosts, i18nI) => {
  document.querySelector('.posts').innerHTML = '';

  const postsCard = renderShell(i18nI.t('titlePosts'));
  document.querySelector('.posts').append(postsCard);

  const ulPosts = document.querySelectorAll('ul')[domUlNumber.postsUl];
  posts.forEach((post) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

    const a = document.createElement('a');
    a.setAttribute('href', `${post.link}`);
    a.classList.add('fw-bold');
    a.dataset.id = post.id;
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
    a.textContent = post.title;

    const button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    button.dataset.id = post.id;
    button.dataset.bsToggle = 'modal';
    button.dataset.bsTarget = '#modal';
    button.textContent = i18nI.t('titleView');

    button.addEventListener('click', (event) => {
      setModal(post);
      if (!seenPosts.includes(post.id)) {
        seenPosts.push(post.id);
      }
      setPostAsViewed(event.target.dataset.id);
    });

    a.addEventListener('click', (event) => {
      if (!seenPosts.includes(post.id)) {
        seenPosts.push(post.id);
      }
      setPostAsViewed(event.target.dataset.id);
    });

    li.append(a, button);

    ulPosts.append(li);

    if (seenPosts.includes(post.id)) {
      setPostAsViewed(post.id);
    }
  });
};

const renderFeeds = (feeds, i18nI) => {
  document.querySelector('.feeds').innerHTML = '';

  const feedsCard = renderShell(i18nI.t('titleFeeds'));
  document.querySelector('.feeds').append(feedsCard);

  const ulFeeds = document.querySelectorAll('ul')[domUlNumber.feedsUl];
  feeds.forEach((feed) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'border-0', 'border-end-0');

    const h3 = document.createElement('h3');
    h3.classList.add('h6', 'm-0');
    h3.textContent = feed.title;

    const p = document.createElement('p');
    p.classList.add('m-0', 'small', 'text-black-50');
    p.textContent = feed.description;

    li.append(h3, p);

    ulFeeds.append(li);
  });
};

const formValidityProcess = (value, input, feedback) => {
  switch (value) {
    case 'not valid':
      input.classList.add('is-invalid');
      feedback.classList.add('text-danger');
      feedback.classList.remove('text-success');
      break;
    case 'valid':
      input.classList.remove('is-invalid');
      feedback.classList.remove('text-danger');
      feedback.classList.add('text-success');
      input.value = '';
      input.focus();
      break;
    default:
      break;
  }
};

const formloadingProcess = (value, feedback, input) => {
  //const addButton = document.querySelector('button[type="submit"]');
  const addButton = document.querySelectorAll('button')[3];
  switch (value) {
    case 'loading':
      feedback.textContent = '';
      input.setAttribute('readonly', 'true');
      addButton.classList.add('disabled');
      input.classList.remove('is-invalid');
      break;
    case 'ready':
      input.removeAttribute('readonly');
      addButton.classList.remove('disabled');
      break;
    default:
      break;
  }
};

const render = (state, i18nI, path, value) => {
  const input = document.querySelector('input');
  const feedback = document.querySelector('.feedback');
  switch (path) {
    case 'loadingProcess.status':
      formloadingProcess(value, feedback, input);
      if (value === 'ready') {
        formValidityProcess(state.form.validStatus, input, feedback);
        feedback.textContent = i18nI.t(`${state.form.feedback}`);
      }
      break;
    case 'posts':
      renderPosts(state.posts, state.ui.seenPosts, i18nI);
      break;
    case 'feeds':
      renderPosts(state.posts, state.ui.seenPosts, i18nI);
      renderFeeds(state.feeds, i18nI);
      break;
    default:
      break;
  }
};

export default render;
