import kubeflowSvg from './kubeflow.svg';
import airflowSvg from './airflow.svg';

import pipelineflowSvg from './pipeline-flow.svg';
import notebookSvg from './notebook.svg';
import pythonSvg from './python.svg';
import rLogoSvg from './r-logo.svg';

import sparkSvg from './spark.svg';
import k8sSvg from './k8s.svg';

import errorSvg from './error.svg';

const enum SvgRequestUrl {
  Kubeflow = '/static/elyra/kubeflow.svg',
  Airflow = '/static/elyra/airflow.svg',
  Pipeline = '/static/elyra/pipeline-flow.svg',
  Notebook = '/static/elyra/notebook.svg',
  Python = '/static/elyra/python.svg',
  R = '/static/elyra/r-logo.svg',
  K8s = '/static/elyra/k8s.svg',
  Spark = '/static/elyra/spark.svg',
  Error = '/static/elyra/error.svg'
}

const svgMap = new Map();
svgMap.set(SvgRequestUrl.Kubeflow, kubeflowSvg);
svgMap.set(SvgRequestUrl.Airflow, airflowSvg);
svgMap.set(SvgRequestUrl.Pipeline, pipelineflowSvg);
svgMap.set(SvgRequestUrl.Notebook, notebookSvg);
svgMap.set(SvgRequestUrl.Python, pythonSvg);
svgMap.set(SvgRequestUrl.R, rLogoSvg);
svgMap.set(SvgRequestUrl.K8s, k8sSvg);
svgMap.set(SvgRequestUrl.Spark, sparkSvg);
svgMap.set(SvgRequestUrl.Error, errorSvg);

export { SvgRequestUrl, svgMap };
