var util = require('util');
var MenuController = require('./menu-controller');
var MapController = require('./map-controller');
var Famous = require('../shims/famous');
var templates = require('../lib/templates');
var TemplateController = require('./template-controller');
var MasterController = require('./master-controller');
var MapSplitController = require('./mapsplit-controller');

function MainMenuController(options) {
  options = options || {};

  options.buttonDescriptors = {
    schedule: {
      title: 'Schedule',
      viewController: function () {
        return new TemplateController({
          template: templates.app.schedule.index,
          title: 'Schedule',
          backIcon: 'fa-home',
        });
      },
    },
    venues: {
      title: 'Venues',
      viewController: function () {
        return new MapSplitController({
          template: templates.app.venues.index,
          title: 'Venues',
          backIcon: 'fa-home',
        });
      },
    },
    open: {
      title: 'Open',
      viewController: function () {
        return new TemplateController({
          template: templates.app.open.index,
          title: 'Open',
          backIcon: 'fa-home',
        });
      },
    },
    people: {
      title: 'People',
      viewController: function () {
        return new MasterController({
          template: templates.app.people.index,
          title: 'People',
          backIcon: 'fa-home',
        });
      },
    },
    timer: {
      title: 'Timer',
      viewController: function () {
        return new TemplateController({
          template: templates.app.timer.index,
          title: 'Timer',
          backIcon: 'fa-home',
        });
      },
    },
    guide: {
      title: 'Helpful Info',
      viewController: function () {
        return new TemplateController({
          template: templates.app.guide.index,
          title: 'Helpful Info',
          backIcon: 'fa-home',
        });
      },
    },
    maps: {
      title: 'Maps',
      viewController: function () {
        return new MapController({
          backIcon: 'fa-home',
        });
      },
    },
    settings: {
      viewController: function () {
        return new TemplateController({
          template: templates.app.settings.index,
          settings: {
            animations: {
              get: Famous.AnimationToggle.get,
              set: Famous.AnimationToggle.set,
            },
          },
          title: 'Settings',
          backIcon: 'fa-home',
        });
      },
    }
  };

  options.buttonLayout = [
    ['schedule', 'venues'],
    ['open', 'people'],
    ['timer', 'guide'],
    ['maps']
  ];

  options.title = 'ARGO Open';

  MenuController.call(this, options);
}
util.inherits(MainMenuController, MenuController);

module.exports = MainMenuController;
