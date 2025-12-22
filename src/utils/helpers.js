export function renderLoading(
  isLoading,
  btn,
  buttonText = "Save",
  loadingText = "Saving..."
) {
  if (isLoading) {
    btn.textContent = loadingText;
  } else {
    btn.textContent = buttonText;
  }
}

export function handleSubmit(request, evt, loadingText = "Saving...") {
  evt.preventDefault();

  const submitBtn = evt.submitter;
  const initialText = submitBtn.textContent;

  renderLoading(true, submitBtn, initialText, loadingText);

  request()
    .then(() => {
      evt.target.reset();
    })
    .catch(console.error)
    .finally(() => {
      renderLoading(false, submitBtn, initialText);
    });
}
