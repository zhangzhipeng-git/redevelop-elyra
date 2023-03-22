export default class Utils {
  private static _unique = 0;
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

  /** 防抖，直接塞进要执行的函数体，前提是fn是不可变的！，否则防抖不生效 */
  static debounceExecute(
    fn: any,
    args: any[],
    debounceTime: number,
    immediate: boolean = false,
    ctx?: object | null
  ) {
    if (immediate && !fn.immediate) {
      fn();
      fn.immediate = true;
      return;
    }
    clearTimeout(fn.timer);
    fn.timer = setTimeout(() => {
      fn.apply(ctx, args);
    }, debounceTime);
  }

  /**
   * 将数组或对象的空值移除
   * @param o 数组或对象
   */
  static removeNullValues(o: any) {
    if (Array.isArray(o)) {
      const newArr: any[] = [];
      o.forEach(v => {
        if (v == null || v === '') return;
        newArr.push(this.removeNullValues(v));
      });
      return newArr;
    }
    if (typeof o === 'object') {
      Object.keys(o).forEach((k: string) => {
        const v = o[k];
        if (v == null || o === '') return delete o[k];
        o[k] = this.removeNullValues(v);
      });
      return o;
    }
    return o;
  }

  static shortUUID(prefix = ''): string {
    const time = Date.now();
    const random = Math.floor(Math.random() * 1000000000);
    this._unique++;
    return prefix + '_' + random + this._unique + String(time);
  }
}
