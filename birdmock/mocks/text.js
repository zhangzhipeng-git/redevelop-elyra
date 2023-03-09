var fs = require('fs');
var path = require('path');
var resolve = p => path.resolve(__dirname, p);
module.exports = {
  '/static/elyra/airflow.svg': () => {
    return fs.readFileSync(resolve('./assets/airflow.svg'));
  },
  '/static/elyra/kubeflow.svg': () => {
    return fs.readFileSync(resolve('./assets/kubeflow.svg'));
  },
  '/static/elyra/pipeline-flow.svg': () => {
    return fs.readFileSync(resolve('./assets/pipeline-flow.svg'));
  },
  '/static/elyra/notebook.svg': () => {
    return fs.readFileSync(resolve('./assets/notebook.svg'));
  },
  '/static/elyra/python.svg': () => {
    return fs.readFileSync(resolve('./assets/python.svg'));
  },
  '/static/elyra/r-logo.svg': () => {
    return fs.readFileSync(resolve('./assets/r-logo.svg'));
  }
};
