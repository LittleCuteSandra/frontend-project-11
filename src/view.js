const renderPosts = () => {

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
    renderPosts();
    input.value = '';
    input.focus();
  }
};

export default render;

//el.classList.toggle("class") проверяет наличие класса. Если класс есть — удаляет его, если нет — добавляет