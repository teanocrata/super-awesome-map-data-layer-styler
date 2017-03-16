var marker = document.getElementById('marker')
var fillColor = document.getElementById('fill-color')
var opacity = document.getElementById('opacity')
var strokeColor = document.getElementById('stroke-color')
var size = document.getElementById('size')

marker.addEventListener('change', changeStyle)
fillColor.addEventListener('change', changeStyle)
opacity.addEventListener('change', changeStyle)
strokeColor.addEventListener('change', changeStyle)
size.addEventListener('change', changeStyle)

function changeStyle () {
  var symbolPath = {
    'BACKWARD_CLOSED_ARROW': google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
    'BACKWARD_OPEN_ARROW': google.maps.SymbolPath.BACKWARD_OPEN_ARROW,
    'CIRCLE': google.maps.SymbolPath.CIRCLE,
    'FORWARD_CLOSED_ARROW': google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
    'FORWARD_OPEN_ARROW': google.maps.SymbolPath.FORWARD_OPEN_ARROW
  }

  if (marker.value == 'DEFAULT') {
    reset()
  } else {
    map.data.setStyle({
      icon: {
        path: symbolPath[marker.value],
        scale: size.value,
        fillColor: fillColor.value,
        fillOpacity: opacity.value,
        strokeColor: strokeColor.value,
        strokeWeight: 1
      }
    })
  }
}

opacity.addEventListener('change', changeStyle)

var closeButton = document.getElementById('close')
closeButton.addEventListener('click', closePane)

var resetButton = document.getElementById('reset')
resetButton.addEventListener('click', reset)

function closePane () {
  document.getElementById('styler-pane').classList.toggle('active')
}

function reset () {
  map.data.setStyle({})
  closePane()
}
