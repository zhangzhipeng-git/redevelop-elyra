import Spin from 'antd/lib/spin';
import ReactDOM from 'react-dom';

interface LoadingProps {
  selector?: string | Element;
  tip?: string;
  delay?: number;
}

let node: Element | null = null;
let wrap: HTMLDivElement;
export function mask({
  selector = '#pipeline-eidtor-wrapper',
  tip = '',
  delay = 500
}: LoadingProps = {}) {
  if (typeof selector === 'string') node = document.querySelector(selector)!;
  else node = selector;

  if (!wrap) {
    wrap = document.createElement('div');
    wrap.style.cssText =
      'display:inline-block;position:absolute;left:50%;top:50%;transform:translate(-50%, -50%);';
  }

  ReactDOM.render(<Spin tip={tip} delay={delay} />, wrap);
  node.appendChild(wrap);
}

export function unmask() {
  if (!wrap) return;
  ReactDOM.unmountComponentAtNode(wrap);
  if (!node) return;
  node.removeChild(wrap);
}

export interface Loading {
  launch(p?: LoadingProps): void;
  resolve(): void;
}

export class Loading {
  props;
  constructor(props?: LoadingProps) {
    this.props = props;
  }
  launch() {
    mask(this.props);
  }
  resolve() {
    unmask();
  }
}
