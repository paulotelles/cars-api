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
}
