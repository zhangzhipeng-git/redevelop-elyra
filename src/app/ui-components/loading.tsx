import Spin from 'antd/lib/spin';
import ReactDOM from 'react-dom';
import { StyleProvider } from '@ant-design/cssinjs';

interface LoadingProps {
  selector?: string | Element;
  tip?: string;
  delay?: number;
}

export function useMask() {
  let node: Element | null = null;
  let wrap: HTMLDivElement;

  function mask({ selector = '', tip = '', delay = 0 }: LoadingProps = {}) {
    if (typeof selector === 'string') node = document.querySelector(selector)!;
    else node = selector;
    if (!node) return;

    if (!wrap) {
      wrap = document.createElement('div');
      wrap.style.cssText =
        'display:inline-block;position:absolute;left:50%;top:50%;transform:translate(-50%, -50%);';
    } else {
      node.removeChild(wrap);
    }

    ReactDOM.render(
      <StyleProvider hashPriority="high">
        <Spin tip={tip} delay={delay} />
      </StyleProvider>,
      wrap
    );
    node.appendChild(wrap);
  }

  function unmask() {
    if (!wrap) return;
    ReactDOM.unmountComponentAtNode(wrap);
    if (!node) return;
    node.removeChild(wrap);
    wrap = null as any;
  }
  return {
    mask,
    unmask
  };
}

export class Loading {
  props;
  mask: any;
  unmask: any;
  constructor(props?: LoadingProps) {
    this.props = props;
    Object.assign(useMask());
  }
  launch() {
    this.mask(this.props);
  }
  resolve() {
    this.unmask();
  }
}
