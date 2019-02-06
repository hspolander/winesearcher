const errorHandlerMiddleware = () => next => (action) => {
  try {
    next(action);
  } catch (e) {
    console.log('error occured.', e);
  }
};

export default errorHandlerMiddleware;
