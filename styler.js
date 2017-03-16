var styler = (function () {
  var stylerPane = {
    createTemplate: createStylerPaneTemplate,
    getValues: getValues,
    bindTo: bindTo
  }

  function createStylerPaneTemplate () {
    var stylerPaneTemplate = document.createElement('nav')
    var stylerPaneTemplateId = document.createAttribute('id')
    stylerPaneTemplateId.value = 'styler-pane'
    stylerPaneTemplate.setAttributeNode(stylerPaneTemplateId)
    stylerPaneTemplate.classList.add('styler-pane')

    var content = '<ul>' +
      '<li>Marker <select id="marker" class="selector">' +
      '            <option value="DEFAULT" selected>Maps marker</option>' +
      '            <option value="CIRCLE">Circle</option>' +
      '            <option value="BACKWARD_CLOSED_ARROW">Down Closed arrow</option>' +
      '            <option value="BACKWARD_OPEN_ARROW">Down Open arrow</option>' +
      '            <option value="FORWARD_CLOSED_ARROW">Up Closed arrow</option>' +
      '            <option value="FORWARD_OPEN_ARROW">Up Open arrow</option>' +
      '          </select>' +
      '</li>' +
      '<li>Fill <input id="fillColor" type="color" class="selector"></li>' +
      '<li>Opacity <input id="opacity" type="range" min="0" max="1" step="0.01" class="selector"></li>' +
      '<li>Stroke <input id="strokeColor" type="color" class="selector"></li>' +
      '<li>Size <input id="size" type="range" min="1" max="10" class="selector"></li>' +
      '<li>Rotation <input id="rotation" type="range" min="1" max="360" class="selector"></li>' +
      '<li><button id="close"><i class="material-icons">keyboard_arrow_left</i></li>' +
      '<li><button id="reset" type="reset"><i class="material-icons">format_color_reset</i></button></li>'
    stylerPaneTemplate.innerHTML = content
    document.body.appendChild(stylerPaneTemplate)

    var closeButton = document.getElementById('close')
    closeButton.addEventListener('click', closePane)
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

  function createElement (type, id, classList) {
    var element = document.createElement(type)
    var elementId = document.createAttribute('id')
    elementId.value = id
    element.setAttributeNode(elementId)
    element.classList.add(classList)
    return element
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
            rotation: options.rotation || 0
          }
        })
      })
    }
  }

  return {
    addStyler: function (buttonId, map) {
      stylerPane.createTemplate()
      stylerPane.bindTo(buttonId, map)
    }
  }
})()
