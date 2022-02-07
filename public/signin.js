const signinForm = document.forms.signinForm;

signinForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const { method, action } = event.target;
  let response;
  try {
    response = await fetch(action, {
      method,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: event.target.name.value,
        password: event.target.password.value,
      }),
    });
  } catch (err) {
    return failSignin(event.target, err.message);
  }
  if (response.status !== 200) {
    const data = await response.json();
    console.log('response ststus code', response.status);
    return failSignin(event.target, data.err);
  }
  return window.location.assign('/private');
});

// Очищаем кастомные сообщения об ошибках при новом вводе
signinForm?.addEventListener('input', (event) => {
  event.target.setCustomValidity('');
  event.target.checkValidity();
});

/**
 * Выдает ошибку при неверной аутентификации
 * @param {HTMLFormElement} signinForm Форма входа
 */
function failSignin(signinForm, err) {
  signinForm.name.setCustomValidity(`Ошибка  авторизации. ${err}`);
  signinForm.name.reportValidity();
  setTimeout(() => {signinForm.name.setCustomValidity('')}, 2000)
  ;
}
