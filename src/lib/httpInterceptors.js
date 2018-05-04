const applyHttpInterceptors = (...interceptors) => fn => {
  for (let ic of interceptors) {
    fn = ic(fn);
  }
  return fn;
};

const httpTime = () => target => {
  return (...args) => {
    let startTime = new Date();
    return target.apply(null, args).then(
      res => {
        console.log("finish executing......", new Date() - startTime);
        return res;
      },
      err => {
        console.log("finish executing......", new Date() - startTime);
        return Promise.reject(err);
      }
    );
  };
};

export { applyHttpInterceptors, httpTime };
