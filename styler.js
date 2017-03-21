'use strict'

var styler = (function () { // eslint-disable-line no-unused-vars
  var stylerPane = {
    createTemplate: createStylerPaneTemplate,
    getValues: getValues,
    bindTo: bindTo
  }

  function createStylerPaneTemplate (options) {
    options = options || []
    if (document.getElementsByClassName('styler-pane').length === 0) {
      var stylerPaneTemplate = document.createElement('nav')
      var stylerPaneTemplateId = document.createAttribute('id')
      stylerPaneTemplateId.value = 'styler-pane'
      stylerPaneTemplate.setAttributeNode(stylerPaneTemplateId)
      stylerPaneTemplate.classList.add('styler-pane')

      var selectorsContainer = document.createElement('ul')
      for (var i = 0; i < options.length; i++) {
        var option = options[i]
        selectorsContainer.appendChild(createSelector(option))
      }
      stylerPaneTemplate.appendChild(selectorsContainer)

      addButton(selectorsContainer, 'keyboard_arrow_left', closePane)
      addButton(selectorsContainer, 'format_color_reset', 'reset')

      document.body.appendChild(stylerPaneTemplate)
    }
  }

  function createSelector (option) {
    var selector = document.createElement('li')
    selector.innerHTML = option.label

    var input

    if (option.type === 'select') {
      input = document.createElement('select')

      for (var optionValues in option.settings.options) {
        var selectOption = document.createElement('option')
        selectOption.value = option.settings.options[optionValues].value
        selectOption.innerHTML = option.settings.options[optionValues].label
        input.appendChild(selectOption)
      }
    } else {
      input = document.createElement('input')

      var type = document.createAttribute('type')
      type.value = option.type
      input.setAttributeNode(type)

      for (var setting in option.settings) {
        var settingAttribute = document.createAttribute(setting)
        settingAttribute.value = option.settings[setting]
        input.setAttributeNode(settingAttribute)
      }
    }

    var id = document.createAttribute('id')
    id.value = option.mapStyleOption
    input.setAttributeNode(id)

    input.classList.add('selector')

    selector.appendChild(input)

    return selector
  }

  function createButton (icon) {
    var closeButton = document.createElement('button')

    var closeButtonContent = document.createElement('i')
    closeButtonContent.classList.add('material-icons')
    closeButtonContent.textContent = icon
    closeButton.appendChild(closeButtonContent)

    return closeButton
  }

  function addButton (element, icon, event) {
    var buttonContainer = document.createElement('li')
    var button = createButton(icon)
    if (typeof event === 'function') {
      button.addEventListener('click', event)
    } else {
      var buttonId = document.createAttribute('id')
      buttonId.value = event
      button.setAttributeNode(buttonId)
    }

    buttonContainer.appendChild(button)
    element.appendChild(buttonContainer)
  }

  function getValues () {
    var options = {}
    Array.from(document.getElementsByClassName('selector')).forEach(function (selector) {
      options[selector.id] = selector.value
    })
    return options
  }

  function bindTo (buttonId, map) {
    var editButton = document.getElementById(buttonId)
    if (!editButton) throw new Error('Whoops! I need a button element to bind the styler pane')
    editButton.addEventListener('click', function () {
      document.getElementById('styler-pane').classList.toggle('active')
    })

    Array.from(document.getElementsByClassName('selector')).forEach(function (selector) {
      selector.addEventListener('change', changeStyle.bind(null, map))
    })

    var resetButton = document.getElementById('reset')
    resetButton.addEventListener('click', reset.bind(null, map))
  }

  function closePane () {
    document.getElementById('styler-pane').classList.toggle('active')
  }

  function reset (map) {
    map.data.setStyle({})
    closePane()
  }

  function changeStyle (map) {
    var options = stylerPane.getValues()

    if (options.marker === 'DEFAULT') {
      reset(map)
    } else {
      // Add a basic style.
      map.data.setStyle(function (feature) {
        var title = feature.getProperty('nameascii') + ', ' + feature.getProperty('adm1name') + ' (' + feature.getProperty('adm0name') + ')'

        return ({
          title: title,
          icon: {
            path: google.maps.SymbolPath[options.marker] || google.maps.SymbolPath.CIRCLE,
            scale: options.size || 1,
            fillColor: options.fillColor || '#000000',
            fillOpacity: options.opacity || 0,
            strokeColor: options.strokeColor || '#000000',
            strokeWeight: options.strokeWeight || 1,
            strokeOpacity: options.strokeOpacity || 1,
            rotation: options.rotation || 0
          }
        })
      })
    }
  }

  return {
    addStyler: function (buttonId, map, options) {
      if (!buttonId) throw new Error('Whoops! I need a button id')
      if (!map) throw new Error('Whoops! I need a map element')
      stylerPane.createTemplate(options)
      stylerPane.bindTo(buttonId, map)
    }
  }
})()

if (typeof exports !== 'undefined') { exports.addStyler = styler.addStyler }
