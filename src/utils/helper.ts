export class Helper {
  static getYear() {
    const date = new Date();
    return date.getUTCFullYear();
  }
  static isSet(value: any) {
    return value != undefined && value != null;
  }
  static isNullOrEmpty(value: any) {
    return !this.isSet(value) || value === '';
  }
  static formatString(str: string, ...args: any[]) {
    if (!str) return '';
    if (!args || args.length === 0) return str;
    const strToFormat = str;

    return strToFormat.replace(/{\d+}/g, (match) => {
      const index = parseInt(match.replace('{', '').replace('}', ''));
      return args[index];
    });
  }
}
