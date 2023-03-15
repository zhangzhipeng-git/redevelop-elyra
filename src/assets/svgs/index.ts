import kubeflowSvg from './kubeflow.svg';
import airflowSvg from './airflow.svg';

import pipelineflowSvg from './pipeline-flow.svg';
import notebookSvg from './notebook.svg';
import pythonSvg from './python.svg';
import rLogoSvg from './r-logo.svg';

const svgMap = new Map();
svgMap.set(svgKey.KUBEFLOW, kubeflowSvg);
svgMap.set(svgKey.AIRFLOW, airflowSvg);
svgMap.set(svgKey.PIPELINE, pipelineflowSvg);
svgMap.set(svgKey.NOTEBOOK, notebookSvg);
svgMap.set(svgKey.PYTHON, pythonSvg);
svgMap.set(svgKey.R, rLogoSvg);

const enum svgKey {
  KUBEFLOW = '/static/elyra/kubeflow.svg',
  AIRFLOW = '/static/elyra/airflow.svg',
  PIPELINE = '/static/elyra/pipeline-flow.svg',
  NOTEBOOK = '/static/elyra/notebook.svg',
  PYTHON = '/static/elyra/python.svg',
  R = '/static/elyra/r-logo.svg'
}

export { svgKey, svgMap };
