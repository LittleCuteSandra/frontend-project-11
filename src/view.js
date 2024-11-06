const render = (state) => {
  const input = document.querySelector('input');
  if (!state.form.isValid) {
    input.classList.add('is-invalid');
  } else {
    input.classList.remove('is-invalid');
    input.value = '';
    input.focus();
  }
};

export default render;