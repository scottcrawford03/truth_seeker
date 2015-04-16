/* jshint ignore:start */

/* jshint ignore:end */

define('truth-seeker-ember/adapters/application', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].RESTAdapter.extend({
    namespace: "api/v1"
  });

});
define('truth-seeker-ember/app', ['exports', 'ember', 'ember/resolver', 'ember/load-initializers', 'truth-seeker-ember/config/environment'], function (exports, Ember, Resolver, loadInitializers, config) {

  'use strict';

  Ember['default'].MODEL_FACTORY_INJECTIONS = true;

  var App = Ember['default'].Application.extend({
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix,
    Resolver: Resolver['default']
  });

  loadInitializers['default'](App, config['default'].modulePrefix);

  exports['default'] = App;

});
define('truth-seeker-ember/components/truth-map', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    classNames: ["map-canvas"],
    markers: [],

    selectedTruth: "",

    insertMap: (function () {
      var container = this.$()[0];

      var options = {
        center: new window.google.maps.LatLng(this.get("latitude"), this.get("longitude")),
        zoom: 4,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: this.styles,
        zoomControl: true,
        zoomControlOptions: {
          style: google.maps.ZoomControlStyle.MEDIUM,
          position: google.maps.ControlPosition.LEFT_CENTER
        },
        mapTypeControl: false,
        scaleControl: true,
        streetViewControl: true };

      this.set("map", new window.google.maps.Map(container, options));
      this.renderTruths();
    }).on("didInsertElement"),

    renderTruths: function renderTruths() {
      var _this = this;

      this.get("markers").forEach(function (marker) {
        marker.setMap(null);
      });
      this.get("truths").forEach(function (truth) {
        _this.placeTruthMarker(truth);
      });
    },

    updateTruths: (function () {
      var markers = this.get("markers");
      var truths = this.get("truths");
      this.renderTruths();
    }).observes("truths"),

    placeTruthMarker: function placeTruthMarker(truth) {
      var icon = {
        url: "/assets/images/" + this.get("category").toLowerCase() + ".png",
        scaledSize: new google.maps.Size(25, 30),
        origin: null,
        anchor: null };

      var marker = new google.maps.Marker({
        position: new window.google.maps.LatLng(truth.get("lat"), truth.get("long")),
        map: this.get("map"),
        title: truth.get("text"),
        animation: google.maps.Animation.DROP,
        icon: icon,
        truth: truth,
        component: this
      });

      marker.addListener("click", function () {
        this.component.set("selectedTruth", truth);
      });
      this.markers.pushObject(marker);
    },

    styles: [{
      featureType: "water",
      elementType: "all",
      stylers: [{
        color: "#758074"
      }, {
        visibility: "on"
      }]
    }, {
      featureType: "landscape.man_made",
      elementType: "all",
      stylers: [{
        hue: "#007F1E"
      }, {
        saturation: 100
      }, {
        lightness: -72
      }, {
        visibility: "on"
      }]
    }, {
      featureType: "landscape.natural",
      elementType: "all",
      stylers: [{
        hue: "#00C72E"
      }, {
        saturation: 100
      }, {
        lightness: -59
      }, {
        visibility: "on"
      }]
    }, {
      featureType: "road",
      elementType: "all",
      stylers: [{
        hue: "#002C0A"
      }, {
        saturation: 100
      }, {
        lightness: -87
      }, {
        visibility: "on"
      }]
    }, {
      featureType: "poi",
      elementType: "all",
      stylers: [{
        hue: "#00A927"
      }, {
        saturation: 100
      }, {
        lightness: -58
      }, {
        visibility: "on"
      }]
    }]
  });

});
define('truth-seeker-ember/components/truth-post', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({

    hidden: false,

    actions: {
      doSomething: function doSomething() {
        this.toggleProperty("hidden");
      }
    }
  });

});
define('truth-seeker-ember/controllers/truth', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({
    needs: "truth",

    searchTerm: "",

    category: (function () {
      return this.get("model.firstObject.category");
    }).property("model"),

    matchingPosts: (function () {
      return this.get("model");
    }).property("model"),

    defaultPost: (function () {
      return this.get("model.firstObject");
    }).property("model"),

    isElvis: (function () {
      return this.get("model.firstObject.category") === "Elvis";
    }).property("model"),

    isUFO: (function () {
      return this.get("model.firstObject.category") === "UFO";
    }).property("model"),

    isTupac: (function () {
      return this.get("model.firstObject.category") === "Tupac";
    }).property("model"),

    isGhost: (function () {
      return this.get("model.firstObject.category") === "Ghost";
    }).property("model"),

    isBigfoot: (function () {
      return this.get("model.firstObject.category") === "Bigfoot";
    }).property("model") });

});
define('truth-seeker-ember/initializers/app-version', ['exports', 'truth-seeker-ember/config/environment', 'ember'], function (exports, config, Ember) {

  'use strict';

  var classify = Ember['default'].String.classify;
  var registered = false;

  exports['default'] = {
    name: "App Version",
    initialize: function initialize(container, application) {
      if (!registered) {
        var appName = classify(application.toString());
        Ember['default'].libraries.register(appName, config['default'].APP.version);
        registered = true;
      }
    }
  };

});
define('truth-seeker-ember/initializers/export-application-global', ['exports', 'ember', 'truth-seeker-ember/config/environment'], function (exports, Ember, config) {

  'use strict';

  exports.initialize = initialize;

  function initialize(container, application) {
    var classifiedName = Ember['default'].String.classify(config['default'].modulePrefix);

    if (config['default'].exportApplicationGlobal && !window[classifiedName]) {
      window[classifiedName] = application;
    }
  }

  ;

  exports['default'] = {
    name: "export-application-global",

    initialize: initialize
  };

});
define('truth-seeker-ember/models/post', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].Model.extend({
    category: DS['default'].attr("string"),
    provider: DS['default'].attr("string"),
    text: DS['default'].attr("string"),
    lat: DS['default'].attr("number"),
    long: DS['default'].attr("number"),
    image: DS['default'].attr("string")
  });

});
define('truth-seeker-ember/models/truth', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].Model.extend({
    name: DS['default'].attr("string"),
    description: DS['default'].attr("string"),
    falsity: DS['default'].attr("string"),
    truth: DS['default'].attr("string"),
    post: DS['default'].hasMany("post")
  });

});
define('truth-seeker-ember/router', ['exports', 'ember', 'truth-seeker-ember/config/environment'], function (exports, Ember, config) {

  'use strict';

  var Router = Ember['default'].Router.extend({
    location: config['default'].locationType
  });

  exports['default'] = Router.map(function () {
    this.resource("truths", { path: "/" }, function () {
      this.resource("truth", { path: ":truth_name" });
    });
  });

});
define('truth-seeker-ember/routes/truth', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    model: function model(params) {
      return this.store.find("post", { category_name: params.truth_name });
    }
  });

});
define('truth-seeker-ember/routes/truths', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    model: function model() {
      return $.getJSON("/api/v1/categories").then(function (data) {
        return data.categories.map(function (category) {
          return category;
        });
      });
    }
  });

});
define('truth-seeker-ember/templates/application', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, 0);
        content(env, morph0, context, "outlet");
        return fragment;
      }
    };
  }()));

});
define('truth-seeker-ember/templates/components/truth-map', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","col-md-push-1 map-canvas");
        var el2 = dom.createTextNode(" ");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(fragment,2,2,contextualElement);
        content(env, morph0, context, "yield");
        return fragment;
      }
    };
  }()));

});
define('truth-seeker-ember/templates/components/truth-post', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
        var morph1 = dom.createMorphAt(fragment,2,2,contextualElement);
        dom.insertBoundary(fragment, 0);
        content(env, morph0, context, "post.provider");
        content(env, morph1, context, "post.text");
        return fragment;
      }
    };
  }()));

});
define('truth-seeker-ember/templates/truth', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("h3");
          dom.setAttribute(el1,"class","text-center");
          var el2 = dom.createTextNode("Elvis Has Not Left the Building");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("p");
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("span");
          dom.setAttribute(el2,"class","bold");
          var el3 = dom.createTextNode("What they want you to believe:");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode(" Elvis died on August 16, 1977. The coroner claimed he passed away from cardiac arrhythmia, possibly caused by an overdose of prescription pills.\n      ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("p");
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("span");
          dom.setAttribute(el2,"class","bold");
          var el3 = dom.createTextNode("The truth:");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode(" Elvis has been spotted by numerous witnesses since his alleged death. Several of his friends are still in contact with him. And if he hadn't known he was going to die, he would have ordered some sparkly gold suits for his concert tour--but he didn't.\n      ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("h3");
          dom.setAttribute(el1,"class","text-center");
          var el2 = dom.createTextNode("Bigfoot Walks Among Us");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("p");
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("span");
          dom.setAttribute(el2,"class","bold");
          var el3 = dom.createTextNode("What they want you to believe:");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode(" Some people just have\n        big feet and like to wander around the woods in ape costumes. It’s perfectly\n        normal!\n      ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("p");
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("span");
          dom.setAttribute(el2,"class","bold");
          var el3 = dom.createTextNode("The truth:");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode(" Between centuries of sightings, video\n        footage, footprints left in the mud, and the possibility that Bigfoot can\n        slip in and out of the space/time continuum, how can he not be real?\n      ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child2 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("h3");
          dom.setAttribute(el1,"class","text-center");
          var el2 = dom.createTextNode("UFOs are Not Just Weather Balloons");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("p");
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("span");
          dom.setAttribute(el2,"class","bold");
          var el3 = dom.createTextNode("What they want you to believe:");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode(" We are alone in\n        this universe. Very, very alone.\n      ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("p");
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("span");
          dom.setAttribute(el2,"class","bold");
          var el3 = dom.createTextNode("The truth:");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode(" Aliens have been flying their\n        spaceships around our planet since the beginning of time. Maybe your\n        neighbor is an alien, as part of some student exchange problem?\n      ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child3 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("h3");
          dom.setAttribute(el1,"class","text-center");
          var el2 = dom.createTextNode("Ghosts...Did You Hear That?");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("p");
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("span");
          dom.setAttribute(el2,"class","bold");
          var el3 = dom.createTextNode("What they want you to believe:");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode(" That wisp of\n        something you saw, or that voice you heard calling out in the night can easily\n        be explained by your imagination, or the howling wind.\n      ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("p");
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("span");
          dom.setAttribute(el2,"class","bold");
          var el3 = dom.createTextNode("The truth:");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode(" Some people are restless, some have\n        post-mortem agendas, and some are just in denial that they ever died at\n        all. Feel that drop in temperature? See that light flicker? They're heeeerrreee!\n      ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child4 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("h3");
          dom.setAttribute(el1,"class","text-center");
          var el2 = dom.createTextNode("Tupac: Still Livin' the Thug Life");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("p");
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("span");
          dom.setAttribute(el2,"class","bold");
          var el3 = dom.createTextNode("What they want you to believe:");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode(" Tupac Shakur was shot\n        on September 7, 1996, and passed away in Las Vegas a week later from internal\n        bleeding.\n      ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("p");
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("span");
          dom.setAttribute(el2,"class","bold");
          var el3 = dom.createTextNode("The truth:");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode(" Alive and well in Cuba, and probably still\n        making albums and recording footage that is later compiled into holograms to\n        be played at music festivals.\n      ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child5 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("img");
          dom.setAttribute(el2,"class","selected-image");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("h4");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, concat = hooks.concat, attribute = hooks.attribute, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element2 = dom.childAt(fragment, [1]);
          var element3 = dom.childAt(element2, [1]);
          var attrMorph0 = dom.createAttrMorph(element3, 'src');
          var morph0 = dom.createMorphAt(dom.childAt(element2, [3]),0,0);
          attribute(env, attrMorph0, element3, "src", concat(env, [get(env, context, "selectedTruth.image")]));
          content(env, morph0, context, "selectedTruth.text");
          return fragment;
        }
      };
    }());
    var child6 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("img");
          dom.setAttribute(el2,"class","selected-image");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("h4");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, concat = hooks.concat, attribute = hooks.attribute, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element0 = dom.childAt(fragment, [1]);
          var element1 = dom.childAt(element0, [1]);
          var attrMorph0 = dom.createAttrMorph(element1, 'src');
          var morph0 = dom.createMorphAt(dom.childAt(element0, [3]),0,0);
          attribute(env, attrMorph0, element1, "src", concat(env, [get(env, context, "defaultPost.image")]));
          content(env, morph0, context, "defaultPost.text");
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","row");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","col-xs-9 text-left bios");
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","col-xs-3 text-left truth-posts");
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, inline = hooks.inline, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element4 = dom.childAt(fragment, [0]);
        var element5 = dom.childAt(element4, [1]);
        var morph0 = dom.createMorphAt(element5,1,1);
        var morph1 = dom.createMorphAt(element5,3,3);
        var morph2 = dom.createMorphAt(element5,4,4);
        var morph3 = dom.createMorphAt(element5,5,5);
        var morph4 = dom.createMorphAt(element5,6,6);
        var morph5 = dom.createMorphAt(element5,7,7);
        var morph6 = dom.createMorphAt(dom.childAt(element4, [3]),1,1);
        inline(env, morph0, context, "truth-map", [], {"latitude": "37.8282", "longitude": "-98.5795", "defaultTruth": get(env, context, "currentPost"), "truths": get(env, context, "matchingPosts"), "category": get(env, context, "category"), "selectedTruth": get(env, context, "selectedTruth")});
        block(env, morph1, context, "if", [get(env, context, "isElvis")], {}, child0, null);
        block(env, morph2, context, "if", [get(env, context, "isBigfoot")], {}, child1, null);
        block(env, morph3, context, "if", [get(env, context, "isUFO")], {}, child2, null);
        block(env, morph4, context, "if", [get(env, context, "isGhost")], {}, child3, null);
        block(env, morph5, context, "if", [get(env, context, "isTupac")], {}, child4, null);
        block(env, morph6, context, "if", [get(env, context, "selectedTruth")], {}, child5, child6);
        return fragment;
      }
    };
  }()));

});
define('truth-seeker-ember/templates/truths', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      var child0 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.11.0",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("    ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1,"class","category-image-container");
            var el2 = dom.createTextNode("\n      ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("img");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n    ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, get = hooks.get, concat = hooks.concat, attribute = hooks.attribute;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var element0 = dom.childAt(fragment, [1, 1]);
            var attrMorph0 = dom.createAttrMorph(element0, 'class');
            var attrMorph1 = dom.createAttrMorph(element0, 'src');
            attribute(env, attrMorph0, element0, "class", concat(env, [get(env, context, "category.name"), "-image category-image"]));
            attribute(env, attrMorph1, element0, "src", concat(env, ["/assets/images/", get(env, context, "category.name"), ".png"]));
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 1,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement, blockArguments) {
          var dom = env.dom;
          var hooks = env.hooks, set = hooks.set, get = hooks.get, block = hooks.block;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
          dom.insertBoundary(fragment, null);
          dom.insertBoundary(fragment, 0);
          set(env, context, "category", blockArguments[0]);
          block(env, morph0, context, "link-to", ["truth", get(env, context, "category.name")], {}, child0, null);
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("          ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("h1");
          dom.setAttribute(el1,"id","title");
          var el2 = dom.createTextNode("TRUTH SEEKER");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n          ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("h4");
          dom.setAttribute(el1,"id","tagline");
          var el2 = dom.createTextNode("THE PEOPLE NEED TO KNOW");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","row");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","col-xs-2 images");
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","col-xs-10 header text-center");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","row");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","col-xs-9");
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element1 = dom.childAt(fragment, [0]);
        var element2 = dom.childAt(element1, [3, 1]);
        var morph0 = dom.createMorphAt(dom.childAt(element1, [1]),1,1);
        var morph1 = dom.createMorphAt(dom.childAt(element2, [1]),1,1);
        var morph2 = dom.createMorphAt(element2,3,3);
        block(env, morph0, context, "each", [get(env, context, "model")], {}, child0, null);
        block(env, morph1, context, "link-to", ["truths"], {}, child1, null);
        content(env, morph2, context, "outlet");
        return fragment;
      }
    };
  }()));

});
define('truth-seeker-ember/templates/truths/index', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","row");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","col-xs-9 index-message");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h1");
        var el4 = dom.createTextNode("CLICK A TRUTH TO BEGIN");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        return fragment;
      }
    };
  }()));

});
define('truth-seeker-ember/tests/adapters/application.jshint', function () {

  'use strict';

  module('JSHint - adapters');
  test('adapters/application.js should pass jshint', function() { 
    ok(true, 'adapters/application.js should pass jshint.'); 
  });

});
define('truth-seeker-ember/tests/app.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('app.js should pass jshint', function() { 
    ok(true, 'app.js should pass jshint.'); 
  });

});
define('truth-seeker-ember/tests/components/truth-map.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/truth-map.js should pass jshint', function() { 
    ok(false, 'components/truth-map.js should pass jshint.\ncomponents/truth-map.js: line 42, col 16, \'markers\' is defined but never used.\ncomponents/truth-map.js: line 43, col 15, \'truths\' is defined but never used.\ncomponents/truth-map.js: line 17, col 18, \'google\' is not defined.\ncomponents/truth-map.js: line 21, col 16, \'google\' is not defined.\ncomponents/truth-map.js: line 22, col 19, \'google\' is not defined.\ncomponents/truth-map.js: line 50, col 23, \'google\' is not defined.\ncomponents/truth-map.js: line 55, col 22, \'google\' is not defined.\ncomponents/truth-map.js: line 61, col 18, \'google\' is not defined.\n\n8 errors'); 
  });

});
define('truth-seeker-ember/tests/components/truth-post.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/truth-post.js should pass jshint', function() { 
    ok(true, 'components/truth-post.js should pass jshint.'); 
  });

});
define('truth-seeker-ember/tests/controllers/truth.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/truth.js should pass jshint', function() { 
    ok(false, 'controllers/truth.js should pass jshint.\ncontrollers/truth.js: line 21, col 62, Missing semicolon.\ncontrollers/truth.js: line 25, col 60, Missing semicolon.\ncontrollers/truth.js: line 29, col 62, Missing semicolon.\ncontrollers/truth.js: line 33, col 62, Missing semicolon.\ncontrollers/truth.js: line 37, col 64, Missing semicolon.\n\n5 errors'); 
  });

});
define('truth-seeker-ember/tests/helpers/resolver', ['exports', 'ember/resolver', 'truth-seeker-ember/config/environment'], function (exports, Resolver, config) {

  'use strict';

  var resolver = Resolver['default'].create();

  resolver.namespace = {
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix
  };

  exports['default'] = resolver;

});
define('truth-seeker-ember/tests/helpers/resolver.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/resolver.js should pass jshint', function() { 
    ok(true, 'helpers/resolver.js should pass jshint.'); 
  });

});
define('truth-seeker-ember/tests/helpers/start-app', ['exports', 'ember', 'truth-seeker-ember/app', 'truth-seeker-ember/router', 'truth-seeker-ember/config/environment'], function (exports, Ember, Application, Router, config) {

  'use strict';



  exports['default'] = startApp;
  function startApp(attrs) {
    var application;

    var attributes = Ember['default'].merge({}, config['default'].APP);
    attributes = Ember['default'].merge(attributes, attrs); // use defaults, but you can override;

    Ember['default'].run(function () {
      application = Application['default'].create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
    });

    return application;
  }

});
define('truth-seeker-ember/tests/helpers/start-app.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/start-app.js should pass jshint', function() { 
    ok(true, 'helpers/start-app.js should pass jshint.'); 
  });

});
define('truth-seeker-ember/tests/models/post.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/post.js should pass jshint', function() { 
    ok(true, 'models/post.js should pass jshint.'); 
  });

});
define('truth-seeker-ember/tests/models/truth.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/truth.js should pass jshint', function() { 
    ok(true, 'models/truth.js should pass jshint.'); 
  });

});
define('truth-seeker-ember/tests/router.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('router.js should pass jshint', function() { 
    ok(true, 'router.js should pass jshint.'); 
  });

});
define('truth-seeker-ember/tests/routes/truth.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/truth.js should pass jshint', function() { 
    ok(true, 'routes/truth.js should pass jshint.'); 
  });

});
define('truth-seeker-ember/tests/routes/truths.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/truths.js should pass jshint', function() { 
    ok(false, 'routes/truths.js should pass jshint.\nroutes/truths.js: line 5, col 12, \'$\' is not defined.\n\n1 error'); 
  });

});
define('truth-seeker-ember/tests/test-helper', ['truth-seeker-ember/tests/helpers/resolver', 'ember-qunit'], function (resolver, ember_qunit) {

	'use strict';

	ember_qunit.setResolver(resolver['default']);

});
define('truth-seeker-ember/tests/test-helper.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('test-helper.js should pass jshint', function() { 
    ok(true, 'test-helper.js should pass jshint.'); 
  });

});
define('truth-seeker-ember/tests/unit/adapters/application-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("adapter:application", "ApplicationAdapter", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function (assert) {
    var adapter = this.subject();
    assert.ok(adapter);
  });

  // Specify the other units that are required for this test.
  // needs: ['serializer:foo']

});
define('truth-seeker-ember/tests/unit/adapters/application-test.jshint', function () {

  'use strict';

  module('JSHint - unit/adapters');
  test('unit/adapters/application-test.js should pass jshint', function() { 
    ok(true, 'unit/adapters/application-test.js should pass jshint.'); 
  });

});
define('truth-seeker-ember/tests/unit/components/truth-post-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent("truth-post", {});

  ember_qunit.test("it renders", function (assert) {
    assert.expect(2);

    // Creates the component instance
    var component = this.subject();
    assert.equal(component._state, "preRender");

    // Renders the component to the page
    this.render();
    assert.equal(component._state, "inDOM");
  });

  // Specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar']

});
define('truth-seeker-ember/tests/unit/components/truth-post-test.jshint', function () {

  'use strict';

  module('JSHint - unit/components');
  test('unit/components/truth-post-test.js should pass jshint', function() { 
    ok(true, 'unit/components/truth-post-test.js should pass jshint.'); 
  });

});
define('truth-seeker-ember/tests/unit/models/post-test', ['ember-qunit', 'truth-seeker-ember/models/post'], function (ember_qunit, Post) {

  'use strict';

  ember_qunit.moduleForModel("post", {
    // Specify the other units that are required for this test.
    needs: []
  });

  ember_qunit.test("it exists", function (assert) {
    var model = this.subject();
    // var store = this.store();
    assert.ok(!!model);
  });

  ember_qunit.test("it has attributes", function (assert) {
    var property = Post['default'].metaForProperty("provider");
    assert.ok(property.isAttribute);
  });

});
define('truth-seeker-ember/tests/unit/models/post-test.jshint', function () {

  'use strict';

  module('JSHint - unit/models');
  test('unit/models/post-test.js should pass jshint', function() { 
    ok(true, 'unit/models/post-test.js should pass jshint.'); 
  });

});
define('truth-seeker-ember/tests/unit/routes/truths-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:truths", {});

  ember_qunit.test("it exists", function (assert) {
    var route = this.subject();
    assert.ok(route);
  });

  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('truth-seeker-ember/tests/unit/routes/truths-test.jshint', function () {

  'use strict';

  module('JSHint - unit/routes');
  test('unit/routes/truths-test.js should pass jshint', function() { 
    ok(true, 'unit/routes/truths-test.js should pass jshint.'); 
  });

});
/* jshint ignore:start */

/* jshint ignore:end */

/* jshint ignore:start */

define('truth-seeker-ember/config/environment', ['ember'], function(Ember) {
  var prefix = 'truth-seeker-ember';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

if (runningTests) {
  require("truth-seeker-ember/tests/test-helper");
} else {
  require("truth-seeker-ember/app")["default"].create({"name":"truth-seeker-ember","version":"0.0.0.0eed7e58"});
}

/* jshint ignore:end */
//# sourceMappingURL=truth-seeker-ember.map