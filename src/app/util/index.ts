export default class Utils {
  /**
   * 将svg字符串转为 base64 编码
   * @param svgString svg 字符串
   */
  static svgToBase64 = (svgString: string): string =>
    `data:image/svg+xml;base64,${window.btoa(svgString)}`;

  /** 克隆对象 */
  static clone = (o: any) => JSON.parse(JSON.stringify(o));

  /**
   * 将base64转为blob
   * @param base64 base64 字符串
   */
  static base64toBlob = (base64: string, type?: string) => {
    if (!base64) return new Blob();
    if (base64.indexOf(',') > -1) {
      const arr = base64.split(',');
      type = arr[0]?.match(/:(.*?);/)?.[1];
      base64 = base64.split(',')[1];
    }
    let bstr = window.atob(base64);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type });
  };
}
