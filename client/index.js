import needle from 'needle';
import { oauth } from '../oauth/index.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const packageJson = require('../package.json');
needle.defaults({user_agent: `${packageJson.name}/${packageJson.version}`});

const auth = (method, url, options, body) => {
  try {
    Reflect.getPrototypeOf(options);
  } catch (e) {
    return {};
  }

  options.headers = options.headers || {};
  if (options.oauth) {
    options.headers.authorization = oauth(url, method, options, options.json
? {}
: body);
  } else if (options.bearer) {
    options.headers.authorization = `Bearer ${options.bearer}`;
  }

  return options;
};

const get = ({url, ...options}) => {
  const method = 'GET';
  options.options = auth(method, url, options.options);
  return needle(method, url, null, options.options);
};

const del = ({url, ...options}) => {
  const method = 'DELETE';
  options.options = auth(method, url, options.options);
  return needle(method, url, null, options.options);
};

const post = ({url, body = {}, ...options}) => {
  const method = 'POST';
  options.options = auth(method, url, options.options, body);
  return needle(method, url, body, options.options);
};

const put = ({url, body = {}, ...options}) => {
  const method = 'PUT';
  options.options = auth(method, url, options.options, body);
  return needle(method, url, body, options.options);
};

export { get, del, post, put };
