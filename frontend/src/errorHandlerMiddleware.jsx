export const errorHandlerMiddleware = store => next => (action) => {
  try {
    next(action);
  } catch(e) {
    console.log('error occured.', e);
  }
};
