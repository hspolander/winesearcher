export const addKr = value => {
  let onlyNums = value.replace(/[^\d]/g, '');
  if (value.length > 1 && value.indexOf(' kr') === -1) {
    onlyNums = onlyNums.slice(1);
  }
  if (!onlyNums) {
    return "";
  }

  return onlyNums + ' kr';
};

export const addMl = value => {
  let onlyNums = value.replace(/[^\d]/g, '');
  if (value.length > 1 && value.indexOf(' ml') === -1) {
    onlyNums = onlyNums.slice(1);
  }
  if (!onlyNums) {
    return "";
  }

  return onlyNums + ' ml';
};
