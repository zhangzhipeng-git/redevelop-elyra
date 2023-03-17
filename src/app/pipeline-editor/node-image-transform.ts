/**
 * pipeline 的节点是有图标展示的，在elyra的pipeline编辑器中，图标是请求本地的静态资源，
 * 会发起网络请求。而本项目是请求第三方服务，为了减少不必要的请求，前端静态资源统一在本地
 * 以内联的方式引入，所以在生成的pipeline文件中，会出现image字段的图标base64编码，这使得
 * 文件内容变得很大。
 *
 * 现在有一种解决方式就是：只在节点渲染的时候使用base64编码，而保存到文件或提交给第三方服务
 * 的时候，image字段其实是不重要的，因此在pipeline文件中，可以将image定义为空，而真正渲染
 * 节点图标的时候，再通过映射关系找到base64编码去渲染图标。
 */

import { SvgRequestUrl, svgMap } from '@assets/svgs';
import Utils from '@app/util';

enum NodeSvgKey {
  SparkKubernetesOperator = 'execute-SparkKubernetesOperator-node',
  KubernetesPodOperator = 'execute-KubernetesPodOperator-node',
  Error = 'error'
}

const base64Map = new Map();
base64Map.set(
  NodeSvgKey.KubernetesPodOperator,
  Utils.svgToBase64(svgMap.get(SvgRequestUrl.Airflow))
);
base64Map.set(
  NodeSvgKey.KubernetesPodOperator,
  Utils.svgToBase64(svgMap.get(SvgRequestUrl.Airflow))
);
base64Map.set(
  NodeSvgKey.Error,
  Utils.svgToBase64(svgMap.get(SvgRequestUrl.Error))
);

/**
 * 在编辑器解析pipeline数据时需要将 image 赋值为节点图标 base64
 * @param {any} pipeline
 */
export function attachNodeImage(pipeline: any) {
  pipeline?.pipelines?.forEach((p: any) => {
    p?.nodes?.forEach((n: any) => {
      const ui_data = n?.app_data?.ui_data;
      if (typeof ui_data !== 'object') return;
      ui_data.image = base64Map.get(n.op);
      ui_data.decorations?.forEach((d: any) => {
        if (!d || d.id !== 'error') return;
        d.image = base64Map.get(NodeSvgKey.Error);
      });
    });
  });
}

/**
 * 在编辑器保存pipeline数据时，删除节点的 image
 * @param {any} pipeline
 */
export function deleteNodeImage(pipeline: any) {
  pipeline?.pipelines?.forEach((p: any) => {
    p?.nodes?.forEach((n: any) => {
      const ui_data = n?.app_data?.ui_data;
      if (typeof ui_data !== 'object') return;
      delete n.app_data.ui_data.image;
      ui_data.decorations?.forEach((d: any) => {
        if (!d || d.id !== 'error') return;
        delete d.image;
      });
    });
  });
}
