'use strict'

var styler = (function () { // eslint-disable-line no-unused-vars
  var numericVariables = {}
  var stylerPane = {
    createTemplate: createStylerPaneTemplate,
    getValues: getValues,
    bindTo: bindTo,
    changeStyle: changeStyle
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
      addButton(selectorsContainer, 'power_settings_new', 'dynamise')

      document.body.appendChild(stylerPaneTemplate)
    }
  }

  function createDynamicStylerPaneTemplate (map) {
    map.data.toGeoJson(function (data) {
      for (var feature in data.features) {
        for (var property in data.features[feature].properties) {
          if (typeof data.features[feature].properties[property] === 'number') {
            if (numericVariables[property]) {
              numericVariables[property].min = numericVariables[property].min > data.features[feature].properties[property] ? data.features[feature].properties[property] : numericVariables[property].min
              numericVariables[property].max = numericVariables[property].max < data.features[feature].properties[property] ? data.features[feature].properties[property] : numericVariables[property].max
            } else {
              numericVariables[property] = {min: data.features[feature].properties[property], max: data.features[feature].properties[property]}
            }
          }
        }
      }
    })

    var selectorsContainer = document.getElementById('styler-pane').getElementsByTagName('ul')[0]
    var selectors = selectorsContainer.getElementsByTagName('input')

    for (var selector = 0; selector < selectors.length; selector++) {
      var option = {label: selectors[selector].parentNode.innerText,
        type: 'select',
        mapStyleOption: selectors[selector].getAttribute('id'),
        settings: {options: [{label: 'Default', value: 'default'}]
        }
      }
      for (var numericVariable in numericVariables) {
        if (numericVariables[numericVariable].min !== numericVariables[numericVariable].max && !numericVariable.includes('id')) {
          option.settings.options.push({label: numericVariable, value: numericVariable})
        }
      }
      selectorsContainer.appendChild(createSelector(option, 'dynamicSelector'))
    }

    Array.from(document.getElementsByClassName('dynamicSelector')).forEach(function (selector) {
      selector.addEventListener('change', changeStyle.bind(null, map, true))
    })
  }

  function createSelector (option, selectorType) {
    selectorType = selectorType || 'selector'
    var selector = document.createElement('li')
    selector.innerHTML = option.label

    var input

    if (option.type === 'select') {
      input = document.createElement('select')

      for (var optionValues in option.settings.options) {
        var selectOption = document.createElement('option')
        selectOption.value = option.settings.options[optionValues].value
        selectOption.innerHTML = option.settings.options[optionValues].label
        if (option.settings.options[optionValues].selected) {
          selectOption.selected = true
        }
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

    input.classList.add(selectorType)

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

  function getValues (dynamic) {
    var options = {}
    if (!dynamic) {
      Array.from(document.getElementsByClassName('selector')).forEach(function (selector) {
        options[selector.id] = selector.value
      })
    } else {
      Array.from(document.getElementsByClassName('dynamicSelector')).forEach(function (selector) {
        options[selector.id] = selector.value
      })
    }

    return options
  }

  function bindTo (buttonId, map) {
    var editButton = document.getElementById(buttonId)
    if (!editButton) throw new Error('Whoops! I need a button element to bind the styler pane')
    editButton.addEventListener('click', function () {
      document.getElementById('styler-pane').classList.toggle('active')
    })

    Array.from(document.getElementsByClassName('selector')).forEach(function (selector) {
      selector.addEventListener('change', changeStyle.bind(null, map, false))
    })

    var resetButton = document.getElementById('reset')
    resetButton.addEventListener('click', reset.bind(null, map))

    var dynamiseButton = document.getElementById('dynamise')
    dynamiseButton.addEventListener('click', dynamise.bind(null, map))
  }

  function closePane () {
    document.getElementById('styler-pane').classList.toggle('active')
  }

  function toggleStaticPane () {
    var selectors = document.getElementById('styler-pane').getElementsByClassName('selector')
    for (var selector = 0; selector < selectors.length; selector++) {
      selectors[selector].parentNode.classList.toggle('hide')
    }
  }

  function removeDynamicStylerPaneTemplate () {
    var selectors = document.getElementById('styler-pane').getElementsByClassName('dynamicSelector')
    while (selectors.length !== 0) {
      selectors[selectors.length - 1].parentNode.remove()
    }
  }

  function toggleDynamicStylerPaneTemplate (map) {
    if (document.getElementById('styler-pane').getElementsByClassName('dynamicSelector').length > 0) {
      removeDynamicStylerPaneTemplate()
    } else {
      createDynamicStylerPaneTemplate(map)
    }
  }

  function reset (map) {
    map.data.setStyle({})
    removeDynamicStylerPaneTemplate()
    closePane()
  }

  function dynamise (map) {
    toggleStaticPane()
    toggleDynamicStylerPaneTemplate(map)
  }

  function getColor (value, minValue, maxValue) {
    var low = [5, 69, 54] // color of smallest datum
    var high = [151, 83, 34]  // color of largest datum

    // delta represents where the value sits between the min and max
    var delta = (value - minValue) / (maxValue - minValue)

    var color = []
    for (var i = 0; i < 3; i++) {
      // calculate an integer color based on the delta
      color[i] = (high[i] - low[i]) * delta + low[i]
    }

    return 'hsl(' + color[0] + ',' + color[1] + '%,' + color[2] + '%)'
  }

  function changeStyle (map, dynamic) {
    dynamic = dynamic || false
    var options = stylerPane.getValues(dynamic)

    if (!dynamic) {
      if (options.marker === 'DEFAULT') {
        reset(map)
      } else {
        // Add a basic style.
        map.data.setStyle(function (feature) {
          var title = feature.getProperty('nameascii') + ', ' + feature.getProperty('adm1name') + ' (' + feature.getProperty('adm0name') + ')'

          return ({
            title: title,
            fillColor: options.fillColor || '#000000',
            fillOpacity: options.fillOpacity || 0,
            strokeColor: options.strokeColor || '#000000',
            strokeWeight: options.strokeWeight || 1,
            strokeOpacity: options.strokeOpacity || 1,
            icon: {
              path: google.maps.SymbolPath[options.marker] || google.maps.SymbolPath.CIRCLE,
              scale: options.size || 1,
              fillColor: options.fillColor || '#000000',
              fillOpacity: options.fillOpacity || 0,
              strokeColor: options.strokeColor || '#000000',
              strokeWeight: options.strokeWeight || 1,
              strokeOpacity: options.strokeOpacity || 1,
              rotation: options.rotation || 0
            }
          })
        })
      }
    } else {
      // Add a super awesome style.
      map.data.setStyle(function (feature) {
        var title = feature.getProperty('nameascii') + ', ' + feature.getProperty('adm1name') + ' (' + feature.getProperty('adm0name') + ')'
        var fillOpacity = options.fillOpacity === 'default' ? 1 : (feature.getProperty(options.fillOpacity) - numericVariables[options.fillOpacity].min) / (numericVariables[options.fillOpacity].max - numericVariables[options.fillOpacity].min)
        var size = options.size === 'default' ? 10 : (feature.getProperty(options.size) - numericVariables[options.size].min) / (numericVariables[options.size].max - numericVariables[options.size].min)
        var strokeWeight = options.strokeWeight === 'default' ? 0.3 : (feature.getProperty(options.strokeWeight) - numericVariables[options.strokeWeight].min) / (numericVariables[options.strokeWeight].max - numericVariables[options.strokeWeight].min)
        var strokeOpacity = options.strokeOpacity === 'default' ? 1 : (feature.getProperty(options.strokeOpacity) - numericVariables[options.strokeOpacity].min) / (numericVariables[options.strokeOpacity].max - numericVariables[options.strokeOpacity].min)
        var rotation = options.rotation === 'default' ? 0 : (feature.getProperty(options.rotation) - numericVariables[options.rotation].min) / (numericVariables[options.rotation].max - numericVariables[options.rotation].min)
        var fillColor = options.fillColor === 'default' ? '#000000' : getColor(feature.getProperty(options.fillColor), numericVariables[options.fillColor].min, numericVariables[options.fillColor].max)
        var strokeColor = options.strokeColor === 'default' ? '#000000' : getColor(feature.getProperty(options.strokeColor), numericVariables[options.strokeColor].min, numericVariables[options.strokeColor].max)

        return ({
          title: title,
          fillColor: fillColor,
          fillOpacity: fillOpacity,
          strokeColor: strokeColor,
          strokeWeight: strokeWeight,
          strokeOpacity: strokeOpacity,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 20 * size,
            fillColor: fillColor,
            fillOpacity: fillOpacity,
            strokeColor: strokeColor,
            strokeWeight: strokeWeight,
            strokeOpacity: strokeOpacity,
            rotation: rotation
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
      stylerPane.changeStyle(map, false)
    }
  }
})()

if (typeof exports !== 'undefined') { exports.addStyler = styler.addStyler }
