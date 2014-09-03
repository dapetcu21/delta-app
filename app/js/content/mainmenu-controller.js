var util = require('util');
var MenuController = require('../controllers/menu-controller');
var MapController = require('../controllers/map-controller');
var Famous = require('../shims/famous');
var templates = require('../lib/templates');
var TemplateController = require('../controllers/template-controller');
var MapSplitController = require('../controllers/mapsplit-controller');
var MasterController = require('../controllers/master-controller');
var TimerController = require('../controllers/timer-controller');
var T = require('../translate');

function MainMenuController(options) {
  options = options || {};

  options.buttonDescriptors = {
    schedule: {
      title: 'Schedule',
      viewController: function () {
        return new MasterController({
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
          mapOptions: {
            preset: 'venues',
          },
          backIcon: 'fa-home',
        });
      },
    },
    open: {
      title: '',
      viewController: function () {
        return new TemplateController({
          template: templates.app.open.index,
          title: 'Open',
          backIcon: 'fa-home',
        });
      },
    },
    people: {
      title: 'Team',
      viewController: function () {
        return new MasterController({
          template: templates.app.people.index,
          title: 'Team',
          backIcon: 'fa-home',
        });
      },
    },
    timer: {
      title: 'Timer',
      viewController: function () {
        return new TimerController({
          title: 'Timer',
          backIcon: 'fa-home',
        });
      },
    },
    guide: {
      title: 'Travel guide',
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
          preset: 'all',
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
