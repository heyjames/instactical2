export function focusElement(elementId, ms) {
  const elementToFocus = document.getElementById(elementId);

  setTimeout(() => {
    elementToFocus.focus();
  }, ms);
}

export function handleKeyPress(e) {
  if (e.key === "Enter") {
    this.handleSave(e);
  }
}