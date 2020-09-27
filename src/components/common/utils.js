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
  if (e.keyCode === key) return callback();
  
  return;
}

export function sortByOrderArray(columnName, order) {
  return ((a, b) => {
    if (a[columnName].length === 0 && b[columnName].length === 0) {
      return;
    }

    let result = null;
    if (a[columnName].length < b[columnName].length) {
      result = -1 * order;
    } else {
      result = 1 * order;
    }
    
    return result
  });
}

export function sortByOrder(columnName, order) {
  return ((a, b) => {
    if (a[columnName] === b[columnName]) {
      return;
    }

    let result = null;
    if (a[columnName] < b[columnName]) {
      result = -1 * order;
    } else {
      result = 1 * order;
    }
    
    return result
  });
}