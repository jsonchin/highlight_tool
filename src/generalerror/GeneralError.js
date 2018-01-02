function generalError() {
  const ui = DocumentApp.getUi();
  ui.alert('Something went wrong', 'Please refresh the document, restart the internet browser, and/or restart the internet and try your action again.', ui.ButtonSet.OK);
}
