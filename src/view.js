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

  const ulPosts = document.createElement('ul');
  ulPosts.classList.add('list-group', 'border-0', 'rounded-0');

  card.append(ulPosts);
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

const renderPosts = (posts, state) => {
  const ulPosts = document.querySelectorAll('ul')[domUlNumber.postsUl];
  ulPosts.textContent = '';
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
    button.textContent = 'Просмотр';

    li.addEventListener('click', (event) => {
      event.preventDefault();
      if (event.target.tagName === 'BUTTON') {
        setModal(post);
      }
      if (!state.ui.seenPosts.includes(post.id)) {
        state.ui.seenPosts.push(post.id);
      }
      setPostAsViewed(event.target.dataset.id);
    });

    li.append(a, button);

    ulPosts.append(li);
  });
};

const renderFeeds = (feeds) => {
  const ulFeeds = document.querySelectorAll('ul')[domUlNumber.feedsUl];
  ulFeeds.textContent = '';
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

const render = (state, i18nI) => {
  const input = document.querySelector('input');
  const feedback = document.querySelector('.feedback');
  feedback.textContent = '';
  if (!state.form.isValid) {
    input.classList.add('is-invalid');
    feedback.textContent = i18nI.t(`${state.form.error}`);
  } else {
    input.classList.remove('is-invalid');
    if (!document.querySelector('.posts').hasChildNodes()) {
      const postsCard = renderShell('Посты');
      document.querySelector('.posts').append(postsCard);
    }
    if (!document.querySelector('.feeds').hasChildNodes()) {
      const feedsCard = renderShell('Фиды');
      document.querySelector('.feeds').append(feedsCard);
    }
    renderPosts(state.posts, state);
    renderFeeds(state.feeds);
    console.log(state);
    input.value = '';
    input.focus();
  }
};

export default render;
