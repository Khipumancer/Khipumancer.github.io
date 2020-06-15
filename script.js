! function() {
  // ==== on load ====
  window.addEventListener('load', function() {
    "use strict";
    var faces, localTransform = [];
    // ==== init script ====
    var screen = ge1doot.screen.init("screen", null, true);
    var pointer = screen.pointer.init({
      move: function() {
        if (pointer.drag.y > 270) pointer.drag.y = 270;
        if (pointer.drag.y < -270) pointer.drag.y = -270;
      }
    });
    faces = document.getElementById("scene").getElementsByTagName("img");
    // ==== Easing ====
    function Ease(speed, val) {
      this.speed = speed;
      this.target = val;
      this.value = val;
    }
    Ease.prototype.ease = function(target) {
      this.value += (target - this.value) * this.speed;
    }
    // ==== camera ====
    var camera = {
      angle: {
        x: 0,
        y: 0,
        ease: {
          x: 0,
          y: 0
        }
      },
      pos: {
        x: 0,
        z: 0
      },
      vel: {
        x: 0.1,
        z: 0.1
      },
      fov: new Ease(0.01, 300),
      move: function() {
        this.angle.y = -(this.angle.ease.y += (pointer.drag.x - this.angle.ease.y) * 0.06) / 3;
        this.angle.x = (this.angle.ease.x += (pointer.drag.y - this.angle.ease.x) * 0.06) / 3;
        this.fov.ease(pointer.active ? 300 : 500);
        var a = this.angle.y * Math.PI / 180;
        var x = -Math.sin(a) * this.vel.x;
        var z = Math.cos(a) * this.vel.z;
        this.pos.x += x;
        this.pos.z += z;
        if (pointer.active) {
          if ((this.pos.x > 190 && x > 0) || (this.pos.x < -190 && x < 0)) this.vel.x *= 0.9;
          else {
            if (this.vel.x < 0.1) this.vel.x = 1;
            if (this.vel.x < 5) this.vel.x *= 1.1;
          }
          if ((this.pos.z > 190 && z > 0) || (this.pos.z < -190 && z < 0)) this.vel.z *= 0.9;
          else {
            if (this.vel.z < 0.1) this.vel.z = 1;
            if (this.vel.z < 5) this.vel.z *= 1.1;
          }
        } else {
          this.vel.x *= 0.9;
          this.vel.z *= 0.9;
        }
        a = Math.cos(this.angle.x * Math.PI / 180);
        var mx = -(1 * Math.cos((this.angle.y - 90) * Math.PI / 180) * a) * (500 - this.fov.value * 0.5);
        var mz = -(1 * Math.sin((this.angle.y - 90) * Math.PI / 180) * a) * (500 - this.fov.value * 0.5);
        var my = Math.sin(this.angle.x * Math.PI / 180) * 200;
        return "perspective(" + this.fov.value + "px) rotateX(" + this.angle.x + "deg) " + "rotateY(" + this.angle.y + "deg) translateX(" + (this.pos.x + mx) + "px) translateY(" + my + "px) translateZ(" + (this.pos.z + mz) + "px)";
      }
    }
    // ==== init faces ====
    for (var i = 0, n = faces.length; i < n; i++) {
      var elem = faces[i];
      var s = elem.getAttribute("data-transform");
      elem.style.transform = s;
      elem.style.webkitTransform = s;
      elem.style.visibility = "visible";
      localTransform.push(s);
    }
    // ==== main loop ====
    function run() {
      requestAnimationFrame(run);
      var globalcamera = camera.move();
      // ==== anim faces ====
      for (var i = 0, elem; elem = faces[i]; i++) {
        var s = globalcamera + localTransform[i];
        elem.style.transform = s;
        elem.style.webkitTransform = s;
      }
    }
    // ==== start animation ====
    requestAnimationFrame(run);
  }, false);
}();

/**"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var main;
var Main = /** @class  (function () {
    function Main() {
        var _this = this;
        var interval = function () {
            _this.enterFrame();
        };
        var resize = function () {
            _this.resize();
        };
        this._viewManager = new ViewManager();
        window.addEventListener('resize', resize);
        var fps = 60 / 1000;
        setInterval(interval, fps);
    }
    Main.prototype.enterFrame = function () {
        this._viewManager.enterFrame();
    };
    Main.prototype.resize = function () {
        this._viewManager.resize();
    };
    return Main;
}());
var ViewManager = /** @class  (function () {
    function ViewManager() {
        //
        this._dragPointList = [];
        var svg = document.getElementById("svg");
        var lineLayer = document.createElementNS("http://www.w3.org/2000/svg", "g");
        svg.appendChild(lineLayer);
        this._pointLayer
            = document.createElementNS("http://www.w3.org/2000/svg", "g");
        svg.appendChild(this._pointLayer);
        //
        this._lineManager = new LineManager(lineLayer);
        this.resize();
    }
    ViewManager.prototype.enterFrame = function () {
        
        this._lineManager.enterFrame();
        var n = this._movePointList.length;
        for (var i = 0; i < n; i++) {
            var movePoint = this._movePointList[i];
            movePoint.enterFrame();
        }
    };
    ViewManager.prototype.resize = function () {
        var n = this._dragPointList.length;
        for (var i = 0; i < n; i++) {
            var dragPoint = this._dragPointList[i];
            dragPoint.remove();
        }
        //this._dragPointList = [];
        this._movePointList = [];
        //
        this._lineManager.removeAll();
        //
        this.setPoints();
    };
    //
    ViewManager.prototype.setPoints = function () {
        var _this = this;
        var handler = function (eventData) {
            _this.mouseDown(eventData);
        };
        this._movePointList = [];
        this._dragPointList = [];
        var dragPoint;
        var svg = document.getElementById("svg");
        var width = document.body.clientWidth;
        var height = document.body.clientHeight;
        ViewManager.countX = Math.floor((width - 500) / ViewManager.DISTANCE);
        ViewManager.countY = Math.floor((height - 400) / ViewManager.DISTANCE);
        var marginX = 50 + (width - (ViewManager.countX * ViewManager.DISTANCE)) * 0.5;
        var marginY = (height - (ViewManager.countY * ViewManager.DISTANCE)) * 0.5;
        svg.setAttribute("width", width.toString());
        svg.setAttribute("height", height.toString());
        var n = ViewManager.countX * ViewManager.countY;
        for (var i = 0; i < n; i++) {
            if (Math.floor(i / ViewManager.countX) == 0 || Math.floor(i / ViewManager.countX) == ViewManager.countY - 1 || i % ViewManager.countX == 0 || i % ViewManager.countX == ViewManager.countX - 1) {
                dragPoint = new PinPoint(this._pointLayer);
                dragPoint.x = marginX + ViewManager.DISTANCE * (i % ViewManager.countX);
                dragPoint.y = marginY + ViewManager.DISTANCE * Math.floor(i / ViewManager.countX);
            }
            else {
                dragPoint = new MovePoint(this._pointLayer);
                if (dragPoint instanceof MovePoint) {
                    this._movePointList.push(dragPoint);
                }
                dragPoint.x = 10 - 20 * Math.random() + marginX + ViewManager.DISTANCE * (i % ViewManager.countX);
                dragPoint.y = 10 - 20 * Math.random() + marginY + ViewManager.DISTANCE * Math.floor(i / ViewManager.countX);
            }
            dragPoint.addListener("mousedown", handler);
            this._dragPointList.push(dragPoint);
        }
        var left;
        var right;
        var top;
        var bottom;
        n = this._dragPointList.length;
        for (var i = 0; i < n; i++) {
            dragPoint = this._dragPointList[i];
            if (Math.floor(i / ViewManager.countX) != 0) {
                top = this._dragPointList[i - ViewManager.countX];
            }
            if (Math.floor(i / ViewManager.countX) != ViewManager.countY - 1) {
                bottom = this._dragPointList[i + ViewManager.countX];
            }
            if (i % ViewManager.countX != ViewManager.countX - 1) {
                right = this._dragPointList[i + 1];
            }
            if (i / ViewManager.countY != 0) {
                left = this._dragPointList[i - 1];
            }
            dragPoint.setPoints(top, bottom, right, left);
        }
        //Line
        this._lineManager.setPointList(this._dragPointList);
    };
    ViewManager.prototype.mouseDown = function (eventData) {
        var _this = this;
        var mouseup = function () {
            window.removeEventListener("mouseup", mouseup);
            window.removeEventListener("mousemove", mousemove);
            _this.mouseUp();
        };
        var mousemove = function (e) {
            _this.mousemoveHandler(e);
        };
        this._dragPoint = eventData.dragPoint;
        this._preX = eventData.mouseX;
        this._preY = eventData.mouseY;
        window.addEventListener("mouseup", mouseup);
        window.addEventListener("mousemove", mousemove);
    };
    ViewManager.prototype.mouseUp = function () {
        this._dragPoint.mouseUp();
    };
    ViewManager.prototype.mousemoveHandler = function (e) {
        var dx = e.screenX - this._preX;
        var dy = e.screenY - this._preY;
        this._dragPoint.x += dx;
        this._dragPoint.y += dy;
        this._preX = e.screenX;
        this._preY = e.screenY;
    };
    ViewManager.DISTANCE = screen.availWidth / 30;
    return ViewManager;
}());
var LineManager = /** @class  (function () {
    function LineManager(g) {
        this._lineList = [];
        this._layer = g;
    }
    LineManager.prototype.enterFrame = function () {
        this.draw();
    };
    LineManager.prototype.setPointList = function (pointList) {
        this._lineList = [];
        var n = pointList.length - 1;
        for (var i = 0; i < n; i++) {
            if (i % ViewManager.countY != ViewManager.countY - 1) {
                var startPoint = pointList[i];
                var endPoint = pointList[i + 1];
                //  let line: LineObject = new LineObject(this._layer, startPoint, endPoint);
                // lineObject.draw(this._layer, startPoint, 1000);
                /*  let line: LineObject = new LineObject(this._layer, ViewManager.countY, endPoint);
                    this.line;
            }
        }
        n = pointList.length - ViewManager.countX;
        for (var i = 0; i < n; i++) {
            var startPoint = pointList[i];
            var endPoint = pointList[i + ViewManager.countX];
            var line = new LineObject(this._layer, startPoint, endPoint);
            this._lineList.push(line);
        }
        this.draw();
    };
    LineManager.prototype.removeAll = function () {
        var n = this._lineList.length;
        for (var i = 0; i < n; i++) {
            var line = this._lineList[i];
            line.remove();
        }
        this._lineList = [];
    };
    LineManager.prototype.draw = function () {
        var n = this._lineList.length;
        for (var i = 0; i < n; i++) {
            var line = this._lineList[i];
            line.draw();
        }
    };
    return LineManager;
}());
var LineObject = /** @class  (function () {
    function LineObject(g, startPoint, endPoint) {
        this._g = g;
        this._path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        this._path.setAttribute("stroke", "#FFF");
        this._path.setAttribute("fill", "none");
        this._path.setAttribute("stroke-width", "8");
        this._path.setAttribute("stroke-linejoin", "round");
        this._path.setAttribute("pointer-events", "none");
        this._g.appendChild(this._path);
        this._startPoint = startPoint;
        this._endPoint = endPoint;
        this.draw();
    }
    LineObject.prototype.remove = function () {
        this._g.removeChild(this._path);
    };
    LineObject.prototype.draw = function () {
        var value = "M " + this._startPoint.x + "," + this._startPoint.y + " L " + this._endPoint.x + "," + this._endPoint.y + " Z";
        this._path.setAttribute("d", value);
    };
    return LineObject;
}());
//https://gist.github.com/eitanavgil/1c7f6e442476948ea7230523c2919bfe
var Dispatcher = /** @class  (function () {
    function Dispatcher() {
        this.events = {};
    }
    Dispatcher.prototype.addListener = function (event, callback) {
        // Create the event if not exists
        if (this.events[event] === undefined) {
            this.events[event] = {
                listeners: []
            };
        }
        this.events[event].listeners.push(callback);
    };
    Dispatcher.prototype.removeListener = function (event, callback) {
        // Check if this event not exists
        if (this.events[event] === undefined) {
            return false;
        }
        this.events[event].listeners = this.events[event].listeners.filter(function (listener) {
            return listener.toString() !== callback.toString();
        });
    };
    Dispatcher.prototype.dispatch = function (event, data) {
        // Check if this event not exists
        if (this.events[event] === undefined) {
            return false;
        }
        this.events[event].listeners.forEach(function (listener) {
            listener(data);
        });
    };
    return Dispatcher;
}());
var DragPoint = /** @class  (function (_super) {
    __extends(DragPoint, _super);
    function DragPoint(g) {
        var _this = _super.call(this) || this;
        _this._x = 0;
        _this._y = 0;
        _this._isMouseDown = false;
        _this._g = g;
        var mousedown = function (e) {
            _this.mouseDownHandler(e);
        };
        _this._circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        _this._circle.setAttributeNS(null, "cx", "0");
        _this._circle.setAttributeNS(null, "cy", "0");
        _this._circle.setAttributeNS(null, "r", "10");
        _this._circle.addEventListener("mousedown", mousedown);
        _this._g.appendChild(_this._circle);
        return _this;
    }
    Object.defineProperty(DragPoint.prototype, "isMouseDown", {
        get: function () {
            return this._isMouseDown;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DragPoint.prototype, "y", {
        get: function () {
            return this._y;
        },
        set: function (value) {
            this._y = value;
            this._circle.setAttributeNS(null, "cy", this._y.toString());
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DragPoint.prototype, "x", {
        get: function () {
            return this._x;
        },
        set: function (value) {
            this._x = value;
            this._circle.setAttributeNS(null, "cx", this._x.toString());
        },
        enumerable: true,
        configurable: true
    });
    DragPoint.prototype.enterFrame = function () {
    };
    DragPoint.prototype.setPoints = function (top, bottom, right, left) {
        if (top === void 0) { top = null; }
        if (bottom === void 0) { bottom = null; }
        if (right === void 0) { right = null; }
        if (left === void 0) { left = null; }
        if (top) {
            this._topPoint = top;
        }
        if (bottom) {
            this._bottomPoint = bottom;
        }
        if (right) {
            this._rightPoint = right;
        }
        if (left) {
            this._leftPoint = left;
        }
    };
    DragPoint.prototype.remove = function () {
        this._g.removeChild(this._circle);
        this._topPoint = null;
        this._bottomPoint = null;
        this._rightPoint = null;
        this._leftPoint = null;
    };
    DragPoint.prototype.mouseDown = function () {
    };
    DragPoint.prototype.mouseUp = function () {
        this._isMouseDown = false;
    };
    DragPoint.prototype.mouseDownHandler = function (e) {
        this._isMouseDown = true;
        var eventData = new EventData();
        eventData.dragPoint = this;
        eventData.mouseX = e.screenX;
        eventData.mouseY = e.screenY;
        this.dispatch("mousedown", eventData);
    };
    return DragPoint;
}(Dispatcher));
var PinPoint = /** @class  (function (_super) {
    __extends(PinPoint, _super);
    function PinPoint(g) {
        var _this = _super.call(this, g) || this;
        _this._circle.setAttributeNS(null, "fill", "#CCC");
        return _this;
    }
    PinPoint.prototype.enterFrame = function () {
        _super.prototype.enterFrame.call(this);
    };
    return PinPoint;
}(DragPoint));
var MovePoint = /** @class (function (_super) {
    __extends(MovePoint, _super);
    function MovePoint(g) {
        var _this = _super.call(this, g) || this;
        _this.K = 0.00001;
        _this.U = 0.0001;
        _this._vx = 0;
        _this._vy = 0;
        _this._circle.setAttributeNS(null, "fill", "#CCC");
        return _this;
    }
    MovePoint.prototype.enterFrame = function () {
        _super.prototype.enterFrame.call(this);
        var dx;
        var dy;
        if (!this.isMouseDown) {
            if (this._leftPoint) {
                dx = this._leftPoint.x - this.x;
                this._vx += dx * this.K - this.U * this._vx;
                this.x += this._vx;
                dy = this._leftPoint.y - this.y;
                this._vy += dy * this.K - this.U * this._vy;
                this.y += this._vy;
            }
            if (this._rightPoint) {
                dx = this._rightPoint.x - this.x;
                this._vx += dx * this.K - this.U * this._vx;
                this.x += this._vx;
                dy = this._rightPoint.y - this.y;
                this._vy += dy * this.K - this.U * this._vy;
                this.y += this._vy;
            }
            if (this._topPoint) {
                dx = this._topPoint.x - this.x;
                this._vx += dx * this.K - this.U * this._vx;
                this.x += this._vx;
                dy = this._topPoint.y - this.y;
                this._vy += dy * this.K - this.U * this._vy;
                this.y += this._vy;
            }
            if (this._bottomPoint) {
                dx = this._bottomPoint.x - this.x;
                this._vx += dx * this.K - this.U * this._vx;
                this.x += this._vx;
                dy = this._bottomPoint.y - this.y;
                this._vy += dy * this.K - this.U * this._vy;
                this.y += this._vy;
            }
        }
    };
    return MovePoint;
}(DragPoint));
var EventData = /** @class  (function () {
    function EventData() {
    }
    return EventData;
}());
window.addEventListener("load", function () {
    main = new Main();
});-->
/*particlesJS("particles-js", {"particles":{"number":{"value":595,"density":{"enable":true,"value_area":6084.19526099531}},"color":{"value":"#ffffff"},"shape":{"type":"circle","stroke":{"width":3,"color":"#fcfc79"},"polygon":{"nb_sides":5},"image":{"src":"img/github.svg","width":100,"height":100}},"opacity":{"value":0.19169382329163306,"random":false,"anim":{"enable":false,"speed":1,"opacity_min":0.1,"sync":false}},"size":{"value":3,"random":true,"anim":{"enable":false,"speed":40,"size_min":0.1,"sync":false}},"line_linked":{"enable":true,"distance":83.3451405615796,"color":"#ffffff","opacity":1,"width":0.833451405615796},"move":{"enable":true,"speed":3.333805622463184,"direction":"bottom","random":false,"straight":true,"out_mode":"bounce","bounce":false,"attract":{"enable":true,"rotateX":1750.2479517931715,"rotateY":7084.336947734266}}},"interactivity":{"detect_on":".count-particles","events":{"onhover":{"enable":true,"mode":"repulse"},"onclick":{"enable":true,"mode":"push"},"resize":true},"modes":{"grab":{"distance":400,"line_linked":{"opacity":1}},"bubble":{"distance":400,"size":40,"duration":2,"opacity":8,"speed":3},"repulse":{"distance":84.45945945945938,"duration":0.4},/*"push":{"particles_nb":4},"remove":{"particles_nb":2}}},"retina_detect":true});var count_particles, stats, update; stats = new Stats; stats.setMode(0); stats.domElement.style.position = 'absolute'; stats.domElement.style.left = '0px'; stats.domElement.style.top = '0px'; document.body.appendChild(stats.domElement); count_particles = document.querySelector('.js-count-particles'); update = function() { stats.begin(); stats.end(); if (window.pJSDom[0].pJS.particles && window.pJSDom[0].pJS.particles.array) { count_particles.innerText = window.pJSDom[0].pJS.particles.array.length; } requestAnimationFrame(update); }; requestAnimationFrame(update);;*/
