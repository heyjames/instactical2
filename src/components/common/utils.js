export function focusElement(elementId, ms) {
  const elementToFocus = document.getElementById(elementId);

  setTimeout(() => {
    elementToFocus.focus();
  }, ms);
}
  
export function pause(seconds) {
  return new Promise(resolve => {
      setTimeout(() => { resolve() }, seconds * 1000);
  });
}

export function onKeyPress(e, key, callback) {
  if (e.key === key) return callback();
  
  return;

  // if (e.charCode === 13) {
  //   console.log("Your char code is 13");
  // }
}