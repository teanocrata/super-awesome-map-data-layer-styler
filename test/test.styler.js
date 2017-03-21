var assert = require('chai').assert
require('../styler')

beforeEach(function () { // eslint-disable-line
  this.jsdom = require('jsdom-global')()
})

afterEach(function () { // eslint-disable-line
  this.jsdom()
})

describe('Styler getting started', function () {
  describe('#module', function () {
    it('styler should exists when importing the module', function () {
      var styler = require('../styler')
      assert.isNotNull(styler, 'Asserts that styler is not null')
    })

    it('styler should have an "addStyler" function when importing the module', function () {
      var styler = require('../styler')
      assert.isFunction(styler.addStyler, 'Asserts that styler.addStyler is a function')
    })

    it('"addStyler" function should fail if no buttonId nor map element are provided', function () {
      var styler = require('../styler')
      assert.throws(styler.addStyler, Error)
    })

    it('"addStyler" function should fail if there is not button element for the button id provided', function () {
      var styler = require('../styler')
      var map = {}
      assert.throws(styler.addStyler.bind(styler, 'button', map), Error)
    })

    it('"addStyler" function shouldn\'t fail if buttonId and map element are provided', function () {
      var styler = require('../styler')
      var button = document.createElement('button')
      var buttonId = 'button'
      var buttonIdAttributte = document.createAttribute('id')
      buttonIdAttributte.value = buttonId
      button.setAttributeNode(buttonIdAttributte)
      document.body.appendChild(button)
      var map = {}
      assert.doesNotThrow(styler.addStyler.bind(styler, buttonId, map), Error)
    })
  })

  describe('#styler pane', function () {
    it('styler pane should exists at the DOM', function () {
      var styler = require('../styler')
      var button = document.createElement('button')
      var buttonId = 'button'
      var buttonIdAttributte = document.createAttribute('id')
      buttonIdAttributte.value = buttonId
      button.setAttributeNode(buttonIdAttributte)
      document.body.appendChild(button)
      var map = {}
      styler.addStyler(buttonId, map)
      var stylerPane = document.getElementById('styler-pane')
      assert.isNotNull(stylerPane)
    })

    it('should exists only one styler pane at the DOM', function () {
      var styler = require('../styler')
      var button = document.createElement('button')
      var buttonId = 'button'
      var buttonIdAttributte = document.createAttribute('id')
      buttonIdAttributte.value = buttonId
      button.setAttributeNode(buttonIdAttributte)
      document.body.appendChild(button)
      var map = {}
      styler.addStyler(buttonId, map)
      styler.addStyler(buttonId, map)
      var stylerPane = document.getElementsByClassName('styler-pane')
      assert.equal(stylerPane.length, 1, 'one and only one styler pane')
    })

    it('styler pane should have almost two buttons: close and reset', function () {
      var styler = require('../styler')
      var button = document.createElement('button')
      var buttonId = 'button'
      var buttonIdAttributte = document.createAttribute('id')
      buttonIdAttributte.value = buttonId
      button.setAttributeNode(buttonIdAttributte)
      document.body.appendChild(button)
      var map = {}
      styler.addStyler(buttonId, map)
      var stylerPane = document.getElementById('styler-pane')
      var buttons = stylerPane.getElementsByTagName('button')
      assert.isAtLeast(buttons.length, 2, 'at least two buttons')
    })

    it('styler pane should to be visible when click on the edit button', function () {
      var styler = require('../styler')
      var button = document.createElement('button')
      var buttonId = 'button'
      var buttonIdAttributte = document.createAttribute('id')
      buttonIdAttributte.value = buttonId
      button.setAttributeNode(buttonIdAttributte)
      document.body.appendChild(button)
      var map = {}
      styler.addStyler(buttonId, map)
      var stylerPane = document.getElementById('styler-pane')
      assert.isFalse(stylerPane.classList.contains('active'), 'initial state: no active')
      button.dispatchEvent(new MouseEvent('click'))
      assert.isTrue(stylerPane.classList.contains('active'), 'final state: active')
    })
  })

  describe('#config styler pane', function () {
    it('styler should accept a config options array', function () {
      var styler = require('../styler')
      var button = document.createElement('button')
      var buttonId = 'button'
      var buttonIdAttributte = document.createAttribute('id')
      buttonIdAttributte.value = buttonId
      button.setAttributeNode(buttonIdAttributte)
      document.body.appendChild(button)
      var map = {}
      var options = []
      assert.doesNotThrow(styler.addStyler.bind(styler, buttonId, map, options), Error)
    })

    it('styler should accept a config options array with markers options and create a selector with the options', function () {
      var styler = require('../styler')
      var button = document.createElement('button')
      var buttonId = 'button'
      var buttonIdAttributte = document.createAttribute('id')
      buttonIdAttributte.value = buttonId
      button.setAttributeNode(buttonIdAttributte)
      document.body.appendChild(button)
      var map = {}
      var options = [{label: 'Marker',
        type: 'select',
        mapStyleOption: 'marker',
        settings: {options: [
          {label: 'Maps marker', value: 'DEFAULT'},
          {label: 'Circle', value: 'CIRCLE'},
          {label: 'Down Closed arrow', value: 'BACKWARD_CLOSED_ARROW'},
          {label: 'Down Open arrow', value: 'BACKWARD_OPEN_ARROW'},
          {label: 'Up Closed arrow', value: 'FORWARD_CLOSED_ARROW'},
          {label: 'Up Open arrow', value: 'FORWARD_OPEN_ARROW'}
        ]}
      }]
      assert.doesNotThrow(styler.addStyler.bind(styler, buttonId, map, options), Error)
      var stylerPane = document.getElementById('styler-pane')
      var lis = stylerPane.getElementsByTagName('li')
      var labelFound = false
      var thereAreSelectors = false
      var optionsFounded = []
      for (var li = 0; li < lis.length; li++) {
        if (lis[li].innerHTML.includes(options[0].label)) {
          labelFound = true
          var optionSelector = lis[li].getElementsByTagName('option')
          for (var inputOption = 0; inputOption < options[0].settings.options.length; inputOption++) {
            for (var option = 0; option < optionSelector.length; option++) {
              if (optionSelector[option].value === options[0].settings.options[inputOption].value) optionsFounded.push(true)
            }
          }
        }
        thereAreSelectors = true
      }
      assert.isTrue(labelFound, 'label')
      assert.isTrue(thereAreSelectors, 'there are selectors')
      assert.equal(optionsFounded.length, options[0].settings.options.length, 'all configured options in selector')
    })
  })

  describe.skip('#styler pane events', function () {
    it('styler pane should dispatch events when selectors change', function () {
      var styler = require('../styler')
      var button = document.createElement('button')
      var buttonId = 'button'
      var buttonIdAttributte = document.createAttribute('id')
      buttonIdAttributte.value = buttonId
      button.setAttributeNode(buttonIdAttributte)
      document.body.appendChild(button)
      var map = {}
      var options = [{label: 'Marker',
        type: 'select',
        mapStyleOption: 'marker',
        settings: {options: [
          {label: 'Maps marker', value: 'DEFAULT'},
          {label: 'Circle', value: 'CIRCLE'},
          {label: 'Down Closed arrow', value: 'BACKWARD_CLOSED_ARROW'},
          {label: 'Down Open arrow', value: 'BACKWARD_OPEN_ARROW'},
          {label: 'Up Closed arrow', value: 'FORWARD_CLOSED_ARROW'},
          {label: 'Up Open arrow', value: 'FORWARD_OPEN_ARROW'}
        ]}
      }]
      styler.addStyler(buttonId, map, options)
      var markerSelector = document.getElementById('marker')
      markerSelector.value = options[0].settings.options[1].value
      document.getElementById('marker').dispatchEvent(new Event('change'))
    })
  })
})
