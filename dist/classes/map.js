"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Map = void 0;
class Map {
    constructor() {
        this.markers = {
            '1': {
                id: '1',
                name: 'Alex',
                lng: -75.75512993582937,
                lat: 45.349977429009954,
                color: '#dd8fee',
            },
            '2': {
                id: '2',
                name: 'Joseph',
                lng: -75.75195645527508,
                lat: 45.351584045823756,
                color: '#790af0',
            },
            '3': {
                id: '3',
                name: 'Range',
                lng: -75.75900589557777,
                lat: 45.34794635758547,
                color: '#19884b',
            },
        };
    }
    getMarkers() {
        return this.markers;
    }
    addMarker(marker) {
        this.markers[marker.id] = marker;
    }
    deleteMarker(id) {
        delete this.markers[id];
        return this.getMarkers();
    }
    moveMarker(marker) {
        this.markers[marker.id].lng = marker.lng;
        this.markers[marker.id].lat = marker.lat;
    }
}
exports.Map = Map;
