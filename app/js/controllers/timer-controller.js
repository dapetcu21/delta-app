var TitleBarController = require('./titlebar-controller');
var util = require('util');
var Famous = require('../shims/famous');
var cordova = require('../shims/cordova');
var _ = require('lodash');
var $ = require('jquery');
var templates = require('../lib/templates');

function TimerController(options) {
  options = options || {};
  options.rightBarButton = this.makeRightButton;
  options.duration = 8 * 60 * 1000;
  options.durations = [8 * 60 * 1000, 4 * 60 * 1000];
  TitleBarController.call(this, options);
  this.loadState();
}
util.inherits(TimerController, TitleBarController);

TimerController.prototype.buildContentTree = function (parentNode) {
  var self = this;

  var container = new Famous.ContainerSurface({
    size: [undefined, undefined],
  });

  Famous.FastClick(container, function () {
    self.toggleTimer();
  });

  var timerText = new Famous.Surface({
    size: [true, true],
    classes: ['timer-text'],
  });

  self.timerText = timerText;

  self.circleModifier = new Famous.StateModifier({
    align: [0.5, 0.5],
    origin: [0.5, 0.5],
  });

  self.circle = new Famous.Surface({
    classes: ['timer-circle'],
    content: templates.timer(),
  });

  container.add(self.circleModifier).add(self.circle);

  container.add(new Famous.StateModifier({
    align: [0.5, 0.5],
    origin: [0.5, 0.5],
    transform: Famous.Transform.inFront,
  })).add(timerText);

  container.on('deploy', function () {
    self.deploy();
  });

  container.on('recall', function () {
    self.recall();
  });


  function onResize() {
    var w = window.innerWidth;
    var h = window.innerHeight - 44;
    if (cordova.present && cordova.iOS7App) {
      h -= 20;
    }
    if (h < w) {
      w = h;
    }

    self.circleModifier.setSize([w, w]);
  }

  self.on('deploy', function() {
    self.setTimerState();
    Famous.Engine.on('resize', onResize);
  });

  self.on('recall', function() {
    self.setTimerState();
    Famous.Engine.removeListener('resize', onResize);
  });

  onResize();

  self.render(true);

  parentNode.add(container);
};

TimerController.prototype.loadState = function () {
  var self = this;
  try {
    self.startTime = parseInt(window.localStorage.timerStartTime);
    if (isNaN(self.startTime)) {
      self.startTime = null;
    }
    var dur = parseInt(window.localStorage.timerDuration);
    if (!isNaN(dur)) {
      self.options.duration = dur;
    }
  } catch (ex) {
  }
  self.setTimerState();
};

TimerController.prototype.saveState = function () {
  var self = this;
  try {
    if (self.startTime) {
      window.localStorage.timerStartTime = self.startTime.toString();
    } else {
      delete window.localStorage.timerStartTime;
    }
    window.localStorage.timerDuration = self.options.duration.toString();
  } catch (ex) {
  }
};

TimerController.prototype.toggleTimer = function () {
  var self = this;
  if (self.startTime) {
    self.startTime = null;
  } else {
    self.startTime = Date.now();
  }
  self.saveState();
  self.setTimerState();
  self.render();
};

TimerController.parseTime = function (interval, places) {
  places = places || 3;

  function toStr(nr) {
    if (nr < 10) {
      return '0' + nr.toString();
    } else {
      return nr.toString();
    }
  }

  var oi = interval;
  interval = Math.abs(interval);

  interval = Math.floor(interval/10);
  var r = '';
  if (places >= 3) {
    r = '.' + toStr(interval % 100);
  }
  interval = Math.floor(interval/100);
  if (places >= 2) {
    r = ':' + toStr(interval % 60) + r;
  }
  interval = Math.floor(interval/60);
  r = interval + r;
  if (oi < 0) {
    r = '-' + r;
  }
  return r;
};

TimerController.prototype.setTimerState = function () {
  var self = this;
  var state = (self.startTime && self._deployed);

  function tick() {
    self.render();
  }

  if (state !== self.timerState) {
    self.timerState = state;
    if (state) {
      self.tickCallback = Famous.Timer.setInterval(tick, 50);
    } else {
      Famous.Timer.clear(self.tickCallback);
    }
  }
};

TimerController.prototype.goToNextDuration = function () {
  var v = this.options.durations;
  var index = v.indexOf(this.options.duration);
  this.options.duration = v[(index + 1) % v.length];
  this.updateRightButton();
  this.saveState();
  this.render();
};

TimerController.prototype.updateRightButton = function () {
  if (this.rightButton) {
    this.rightButton.setContent(TimerController.parseTime(this.options.duration, 1));
  }
};

TimerController.prototype.makeRightButton = function () {
  var icon = new Famous.Surface({
    classes: ['title-button', 'title-button-duration'],
    size: [true, true],
  });

  this.rightButton = icon;
  this.updateRightButton();

  Famous.FastClick(icon, this.goToNextDuration.bind(this));

  return TitleBarController.createTitleBarButton(1, icon);
};

function renderProgress(progress)
{
    $el = $('.timer-circle .loader');
    $el.css('transform', 'scaleX(' + ((progress > 0) ? '-1' : '1') + ')');
    progress = Math.abs(progress * 100);
    if (progress > 100) {
      progress = 100;
    }
    var angle;
    if(progress<25){
        angle = -90 + (progress/100)*360;
        $el.find(".animate-0-25-b").css("transform","rotate("+angle+"deg)");
        $el.find(".animate-25-50-b, .animate-50-75-b, .animate-75-100-b").css("transform","rotate(-90deg)");
    }
    else if(progress>=25 && progress<50){
        angle = -90 + ((progress-25)/100)*360;
        $el.find(".animate-0-25-b").css("transform","rotate(0deg)");
        $el.find(".animate-25-50-b").css("transform","rotate("+angle+"deg)");
        $el.find(".animate-50-75-b, .animate-75-100-b").css("transform","rotate(-90deg)");
    }
    else if(progress>=50 && progress<75){
        angle = -90 + ((progress-50)/100)*360;
        $el.find(".animate-25-50-b, .animate-0-25-b").css("transform","rotate(0deg)");
        $el.find(".animate-50-75-b").css("transform","rotate("+angle+"deg)");
        $el.find(".animate-75-100-b").css("transform","rotate(-90deg)");
    }
    else if(progress>=75 && progress<=100){
        angle = -90 + ((progress-75)/100)*360;
        $el.find(".animate-50-75-b, .animate-25-50-b, .animate-0-25-b")
                                              .css("transform","rotate(0deg)");
        $el.find(".animate-75-100-b").css("transform","rotate("+angle+"deg)");
    }
}

TimerController.prototype.render = function (forced) {
  var self = this;
  forced = forced || false;
  var started = !!self.startTime;
  var elapsed = started ? Date.now() - self.startTime : 0;
  var remaining = self.options.duration - elapsed;
  var progress = remaining / self.options.duration;

  if (started || forced) {
    self.timerText.setContent(TimerController.parseTime(remaining));
    renderProgress(progress);
  }

  var color = 'idle';
  if (started) {
    if (progress > 7/8) {
      color = 'early';
    } else if (progress > 1/2) {
      color = 'beginning';
    } else if (progress > 1/8) {
      color = 'ending';
    } else {
      color = 'late';
    }
  }

  self.circle.setClasses(['timer-circle', 'timer-' + color]);
};


module.exports = TimerController;
