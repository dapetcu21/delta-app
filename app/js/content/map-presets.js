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
  } ],
});


MapPresets.registerPreset('venues', {
  extend: ['ploiesti', 'bucharest'],
  features: _.map(_.keys(venues), function(key) {
    var venue = venues[key]
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
];

var templateTitles = [
];

var templateColors = [
];

MapPresets.registerPreset('all', {
  extend: ['venues'].concat(_.map(templates, function(t, idx) {
    var $el = $('<div>' + t({T: T}) + '</div>');
    var color = templateColors[idx];
    var features = TemplateUtils.setUpMapLinks($el, false);
    _.each(features, function(f) {
      f.overlay.color = color;
      f.overlay.click = function() {
        //this is the map surface
        this.emit('navigateToTemplate', {
          template: t,
          title: templateTitles[idx]
        });
      };
    });
    return {
      features: features,
    };
  })),
});

module.exports = MapPresets;
