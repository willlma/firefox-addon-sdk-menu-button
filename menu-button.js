/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
'use strict';

module.metadata = {
  'stability': 'experimental',
  'engines': {
    'Firefox': '> 28'
  }
};

// Because Firefox Holly, we still need to check if `CustomizableUI` is
// available. Once Australis will officially land, we can safely remove it.
// See Bug 959142
try {
  require('chrome').Cu.import('resource:///modules/CustomizableUI.jsm', {});
}
catch (e) {
  throw Error('Unsupported Application: The module ' + module.id +
              ' does not support this application.');
}

const { Class } = require('sdk/core/heritage');
const { merge } = require('sdk/util/object');
const { Disposable } = require('sdk/core/disposable');
const { on, off, emit, setListeners } = require('sdk/event/core');
const { EventTarget } = require('sdk/event/target');

const view = require('./view');
const { buttonContract, stateContract } = require('sdk/ui/button/contract');
const { properties, render, state, register, unregister,
        getDerivedStateFor } = require('sdk/ui/state');
const { events: stateEvents } = require('sdk/ui/state/events');
const { events: viewEvents } = require('sdk/ui/button/view/events');
const events = require('sdk/event/utils');

const { getActiveTab } = require('sdk/tabs/utils');

const buttons = new Map();

const MenuButton = Class({
  extends: EventTarget,
  implements: [
    properties(stateContract),
    state(stateContract),
    Disposable
  ],
  setup: function setup(options) {
    let state = merge({
      disabled: false
    }, buttonContract(options));

    register(this, state);

    // Setup listeners.
    setListeners(this, options);

    buttons.set(options.id, this);

    view.create(merge({type: 'menu-button'}, state));
  },

  dispose: function dispose() {
    buttons.delete(this.id);

    off(this);

    view.dispose(this.id);

    unregister(this);
  },

  get id() this.state().id,

  click: function click() { view.click(this.id) }
});
exports.MenuButton = MenuButton;

let menuButtonStateEvents = events.filter(stateEvents,
  e => e.target instanceof MenuButton);

let menuButtonViewEvents = events.filter(viewEvents,
  e => buttons.has(e.target));

let clickEvents = events.filter(menuButtonViewEvents, e => e.type === 'click');
let updateEvents = events.filter(menuButtonViewEvents, e => e.type === 'update');

on(clickEvents, 'data', ({target: id, window, menu}) => {
  
  let button = buttons.get(id);
  let state = getDerivedStateFor(button, getActiveTab(window));

  emit(button, 'click', state, menu);
});

on(updateEvents, 'data', ({target: id, window}) => {
  render(buttons.get(id), window);
});

on(menuButtonStateEvents, 'data', ({target, window, state}) => {
  let { id } = target;
  view.setIcon(id, window, state.icon);
  view.setLabel(id, window, state.label);
  view.setDisabled(id, window, state.disabled);
});
