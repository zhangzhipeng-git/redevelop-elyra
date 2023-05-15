// ip 主机名映射
import { Widget } from '@rjsf/core';
import { useState } from 'react';

type HostConf = {
  ip: string;
  hostName: string[];
}[];

/**
 * hostConf 组件
 * @param props
 */
export const HostConfWidget: Widget = props => {
  const [hostConf, setHostConf] = useState(
    JSON.parse(props?.value || '[{"ip":"","hostName":[""]}]') as HostConf
  );

  function handleHostConf(v: any) {
    props.formContext.onHandleHostConf?.({
      propertyID: props.id.split('_').pop(),
      v
    });
  }

  function ipOnChange(index: number, value: string) {
    hostConf[index].ip = value;
    setHostConf(hostConf);
    handleHostConf(hostConf);
  }
  function domainOnChange(index1: number, index2: number, value: string) {
    hostConf[index1].hostName[index2] = value;
    setHostConf(hostConf);
    handleHostConf(hostConf);
  }
  function addIpDomain() {
    hostConf.push({
      ip: '',
      hostName: ['']
    });
    setHostConf(hostConf);
    handleHostConf(hostConf);
  }
  function deleteIpDomain(index: number) {
    hostConf.splice(index, 1);
    setHostConf(hostConf);
    handleHostConf(hostConf);
  }
  function addDomain(index: number) {
    hostConf[index].hostName.push('');
    setHostConf(hostConf);
    handleHostConf(hostConf);
  }
  function deleteDomain(index1: number, index2: number) {
    hostConf[index1].hostName.splice(index2, 1);
    setHostConf(hostConf);
    handleHostConf(hostConf);
  }

  return (
    <div id={props.id} className={'my-widget-wrapper nets'}>
      {hostConf &&
        hostConf.map((item, index) => {
          return (
            <div className={'net'} key={index}>
              <div className={'ip-domain'}>
                <div className={'ip'}>
                  ip：
                  <input
                    className={'form-control'}
                    type="text"
                    value={item.ip}
                    onChange={e => ipOnChange(index, e.target.value)}
                  />
                </div>
                <div className={'domain'}>
                  {item.hostName.map((hostname, idx) => {
                    return (
                      <div className={'domain-wrap'} key={idx}>
                        域名：
                        <input
                          className={'form-control'}
                          type="text"
                          value={hostname}
                          onChange={e =>
                            domainOnChange(index, idx, e.target.value)
                          }
                        />
                        <a className="add" onClick={() => addDomain(index)}>
                          <svg
                            className="icon"
                            viewBox="0 0 1024 1024"
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                            p-id="13861"
                            width="16"
                            height="16"
                          >
                            <path
                              d="M863.328262 481.340895l-317.344013 0.099772L545.984249 162.816826c0-17.664722-14.336138-32.00086-32.00086-32.00086s-31.99914 14.336138-31.99914 32.00086l0 318.400215-322.368714-0.17718c-0.032684 0-0.063647 0-0.096331 0-17.632039 0-31.935493 14.239806-32.00086 31.904529-0.096331 17.664722 14.208843 32.031824 31.871845 32.095471l322.59234 0.17718 0 319.167424c0 17.695686 14.336138 32.00086 31.99914 32.00086s32.00086-14.303454 32.00086-32.00086L545.982529 545.440667l317.087703-0.099772c0.063647 0 0.096331 0 0.127295 0 17.632039 0 31.935493-14.239806 32.00086-31.904529S880.960301 481.404542 863.328262 481.340895z"
                              fill="#575B66"
                              p-id="13862"
                            ></path>
                          </svg>
                        </a>
                        {idx !== 0 && (
                          <a
                            className="remove"
                            onClick={() => deleteDomain(index, idx)}
                          >
                            <svg
                              className="icon"
                              viewBox="0 0 1024 1024"
                              version="1.1"
                              xmlns="http://www.w3.org/2000/svg"
                              p-id="14819"
                              width="16"
                              height="16"
                            >
                              <path
                                d="M863.74455 544.00086 163.424056 544.00086c-17.664722 0-32.00086-14.336138-32.00086-32.00086s14.336138-32.00086 32.00086-32.00086l700.320495 0c17.695686 0 31.99914 14.336138 31.99914 32.00086S881.440237 544.00086 863.74455 544.00086z"
                                fill="#575B66"
                                p-id="14820"
                              ></path>
                            </svg>
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              <button
                className="jp-mod-styled jp-mod-warn"
                onClick={() => deleteIpDomain(index)}
              >
                {'移除'}
              </button>
            </div>
          );
        })}
      <div>
        <button
          className="jp-mod-styled jp-mod-reject"
          onClick={() => addIpDomain()}
        >
          {'添加'}
        </button>
      </div>
    </div>
  );
};
