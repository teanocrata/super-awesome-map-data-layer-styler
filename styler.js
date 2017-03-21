'use strict'

var styler = (function () { // eslint-disable-line no-unused-vars
  var stylerPane = {
    createTemplate: createStylerPaneTemplate,
    getValues: getValues,
    bindTo: bindTo
  }

  function createStylerPaneTemplate (options) {
    var stylerPaneTemplate = document.createElement('nav')
    var stylerPaneTemplateId = document.createAttribute('id')
    stylerPaneTemplateId.value = 'styler-pane'
    stylerPaneTemplate.setAttributeNode(stylerPaneTemplateId)
    stylerPaneTemplate.classList.add('styler-pane')

    var content = '<ul id="selectors">' +
      '<li id="close-pane"><button id="close"><i class="material-icons">keyboard_arrow_left</i></li>' +
      '<li><button id="reset" type="reset"><i class="material-icons">format_color_reset</i></button></li>'
    stylerPaneTemplate.innerHTML = content
    document.body.appendChild(stylerPaneTemplate)

    var closeButton = document.getElementById('close-pane')

    for (var i = 0; i < options.length; i++) {
      var option = options[i]
      document.getElementById('selectors').insertBefore(createSelector(option), closeButton)
    }

    var closeButton2 = document.getElementById('close')
    closeButton2.addEventListener('click', closePane)
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

  function getValues () {
    var options = {}
    Array.from(document.getElementsByClassName('selector')).forEach(function (selector) {
      options[selector.id] = selector.value
    })
    return options
  }

  function bindTo (buttonId, map) {
    document.getElementById(buttonId).addEventListener('click', function () {
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

    var symbolPath = {
      'BACKWARD_CLOSED_ARROW': google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
      'BACKWARD_OPEN_ARROW': google.maps.SymbolPath.BACKWARD_OPEN_ARROW,
      'CIRCLE': google.maps.SymbolPath.CIRCLE,
      'FORWARD_CLOSED_ARROW': google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
      'FORWARD_OPEN_ARROW': google.maps.SymbolPath.FORWARD_OPEN_ARROW
    }

    if (options.marker === 'DEFAULT') {
      reset(map)
    } else {
      // Add a basic style.
      map.data.setStyle(function (feature) {
        var title = feature.getProperty('nameascii') + ', ' + feature.getProperty('adm1name') + ' (' + feature.getProperty('adm0name') + ')'

        return /** @type {google.maps.Data.StyleOptions} */({
          title: title,
          icon: {
            path: symbolPath[options.marker] || google.maps.SymbolPath.CIRCLE,
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
      stylerPane.createTemplate(options)
      stylerPane.bindTo(buttonId, map)
    }
  }
})()
