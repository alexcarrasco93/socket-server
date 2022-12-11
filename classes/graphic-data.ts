export class GraphicData {
  private static _instance: GraphicData;

  private months = ['january', 'february', 'march', 'april'];
  private values = [1, 2, 3, 4];

  private constructor() {}

  public static get instance() {
    return this._instance || (this._instance = new this());
  }

  getGraphicData() {
    return this.values;
  }

  changeValue(month: string, value: number) {
    month = month.toLowerCase().trim();

    for (const i in this.months) {
      if (this.months[i] === month) {
        this.values[i] += value;
      }
    }

    return this.getGraphicData();
  }
}
