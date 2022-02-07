const signupForm = document.forms.signupForm;
signupForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const { method, action } = event.target;
  let response;
  try {
    response = await fetch(action, {
      method,
      credentials: 'include',
      mode: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: event.target.name.value,
        email: event.target.email.value,
        password: event.target.password.value,
      }),
    });
  } catch (err) {
    console.error('CATCH ERR', err);
    return failSignup(event.target, err.message);
  }
  if (response.status !== 200) {
    console.log('response.status :', response.status);
    const data = await response.json()
    console.log('data err: ', data.err);

    return failSignup(event.target, data.err);
  }
  return window.location.assign('/private');
});

// Очищаем кастомные сообщения об ошибках при новом вводе
signupForm?.addEventListener('input', (event) => {

  event.target.setCustomValidity('');
  event.target.checkValidity();
});

/**
 * Выдает ошибку при неверной регистрации
 * @param {HTMLFormElement} signupForm Форма регистрации
 */
function failSignup(signupForm, err) {
  signupForm.name.setCustomValidity(`Ошибка регистрации. Ошибка: ${err}`);
  signupForm.name.reportValidity();
  setTimeout(() => {signupForm.name.setCustomValidity('')}, 4000)
}
