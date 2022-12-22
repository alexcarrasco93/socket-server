"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphicData = void 0;
class GraphicData {
    constructor() {
        this.months = ['january', 'february', 'march', 'april'];
        this.values = [1, 2, 3, 4];
    }
    static get instance() {
        return this._instance || (this._instance = new this());
    }
    getGraphicData() {
        return this.values;
    }
    changeValue(month, value) {
        month = month.toLowerCase().trim();
        for (const i in this.months) {
            if (this.months[i] === month) {
                this.values[i] += value;
            }
        }
        return this.getGraphicData();
    }
}
exports.GraphicData = GraphicData;
