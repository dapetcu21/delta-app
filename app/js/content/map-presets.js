var ol = require('../lib/ol');
var _ = require('lodash');
var templates = require('../lib/templates');
var T = require('../translate');
var $ = require('jquery');
var TemplateUtils = require('../controllers/template-utils');
var Util = require('../util');
var venues = require('./venues');

var MapPresets = {};

MapPresets.registerPreset = function (name, preset) {
  MapPresets[name] = preset;
};

var gps2mp = Util.GPSToMercador;

var bucharestExtent = gps2mp([25.9353,44.3288,26.2717,44.5890]);
var ploiestiExtent = gps2mp([25.9490,44.8950,26.0822,44.9806]);

MapPresets.registerPreset('ploiesti', {
  layers: [ {
    type: 'tile',
    url: 'assets/maps/ploiesti',
    extent: ploiestiExtent,
    trim: true,
  } ],
  views: [ {
    minZoom: 13,
    maxZoom: 16,
    zoom: 14,
    extent: ploiestiExtent,
    switchButton: 'Pl', 
  } ],
});

MapPresets.registerPreset('bucharest', {
  layers: [ {
    type: 'tile',
    url: 'assets/maps/bucharest',
    extent: bucharestExtent,
    trim: true,
  } ],
  views: [ {
    minZoom: 11,
    maxZoom: 14,
    zoom: 12,
    extent: bucharestExtent,
    switchButton: 'Bu', 
  } ],
});

MapPresets.registerPreset('default', {
  extend: ['ploiesti', 'bucharest'],
});

MapPresets.registerPreset('venues', {
  extend: 'default',
  features: _.map(_.keys(venues), function(key) {
    var venue = venues[key];
    return {
      type: 'point',
      overlay: {
        popover: venue.title,
      },
      coords: gps2mp(venue.coords),
      name: key,
    };
  })
});

var templates = [
  templates.app.guide.arrivals,
  templates.app.guide.food,
];

var templateColors = [
  '#3366FF',
  '#ffa500',
];

MapPresets.registerPreset('all', {
  extend: ['venues'].concat(_.map(templates, function(t, idx) {
    var $el = $('<div>' + t({T: T}) + '</div>');
    var color = templateColors[idx];
    var features = TemplateUtils.setUpMapLinks($el, false);
    _.each(features, function(f) {
      f.overlay.color = color;
    });
    return {
      features: _.filter(features, function (feature) {
        return feature.name !== 'davinci';
      }),
    };
  })),
});

module.exports = MapPresets;
