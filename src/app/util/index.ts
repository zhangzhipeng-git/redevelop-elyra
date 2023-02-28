export default class Utils {
  /**
   * 将svg字符串转为 base64 编码
   * @param svgString svg 字符串
   */
  static svgToBase64 = (svgString: string): string =>
    `data:image/svg+xml;base64,${window.btoa(svgString)}`;
}
