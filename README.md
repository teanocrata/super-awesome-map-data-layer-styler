# super-awesome-map-data-layer-styler
Visual component for styling data on top of a map

* [Description](#description)
* [Get Started](#get-started)
* [Stack](#stack)
* [Install](#install)
  * [Loading the super-awesome-map-data-layer-styler component](#loading-the-super-awesome-map-data-layer-styler-component)
* [Usage](#usage)
  * [Options syntax](#options-syntax)
  * [Development](#development)
* [And more...](#and-more-...)
* [Next steps](#next-steps)
___

## Description

The component let users to style features in a map data layer. There ara many available options, for example, marker, fill color, opacity,...
When either the data, or the rules, are updated, the styling will be automatically applied to every feature.

![](https://preview.ibb.co/dPbWaa/2017_03_21_190423.png)

## Get Started

The easiest way to start learning about super-awesome-map-data-layer-styler for Google Maps Data Layer is to see a simple example. The following [index.html file](index.html) displays a map with a sidebar. You can test it at [super-awesome-map-data-layer-style page](https://teanocrata.github.io/super-awesome-map-data-layer-styler/). To use this example, drag and drop a GeoJSON file or files from your computer on to the map above. You can also drag text or HTML GeoJSON content from another website or from the sample below.

This example is based on [Data Layer: Drag and Drop GeoJSON](https://developers.google.com/maps/documentation/javascript/examples/layer-data-dragndrop)

## Stack
[![Standard - JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

* [VanillaJS](http://vanilla-js.com/) :stuck_out_tongue_winking_eye:
* [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript/)

For development purposes:
* [nodejs](https://nodejs.org/en/)
* [mocha](https://mochajs.org/) & [chai](http://chaijs.com/) as JavaScript test framework
* [standardJS](https://standardjs.com/) for code clarity and community conventions
* [npm](https://www.npmjs.com/) to manage development packages and config basic scripts like test, lint or start
* [express](http://expressjs.com/) to serve static content in localhost

## Install

### Loading the super-awesome-map-data-layer-styler component

To load the super-awesome-map-data-layer-styler, use a script tag like the one in the following example:
```html
<script type="application/javascript" src="styler.js"></script>
```
To load the style sheet, include a reference to the external style sheet file inside the link element:
```html
<link rel="stylesheet" href="styler.css"/>
```

## Usage

First you will need an element for the pane to attach to. In the example above, we used a button element and an icon instead a word.
Note that you must always set an id to de button.
```html
<button id ='edit-button'><i class="material-icons">mode_edit</i></button>
```
There are two required options for every pane: `button id` and `map`. `map` is the google.maps.Map object from Google Maps JavaScript API.

### Options syntax
There are many options to configure the pane, this is an example:
```javascript
var options = [
  {label: 'Marker', type: 'select', mapStyleOption: 'marker', settings: {options: [
    {label: 'Maps marker', value: 'DEFAULT'},
    {label: 'Circle', value: 'CIRCLE'},
    {label: 'Down Closed arrow', value: 'BACKWARD_CLOSED_ARROW'},
    {label: 'Down Open arrow', value: 'BACKWARD_OPEN_ARROW'},
    {label: 'Up Closed arrow', value: 'FORWARD_CLOSED_ARROW'},
    {label: 'Up Open arrow', value: 'FORWARD_OPEN_ARROW'}
  ]}},
  {label: 'Fill', type: 'color', mapStyleOption: 'fillColor'},
  {label: 'Opacity', type: 'range', mapStyleOption: 'fillOpacity', settings: {min: 0, max: 1, step: 0.01, value:0}},
  {label: 'Stroke', type: 'color', mapStyleOption: 'strokeColor'},
  {label: 'Stroke weigth', type: 'range', mapStyleOption: 'strokeWeight', settings: {min: 0, max: 10}},
  {label: 'Stroke opacity', type: 'range', mapStyleOption: 'strokeOpacity', settings: {min: 0, max: 1, step: 0.01, value: 1}},
  {label: 'Size', type: 'range', mapStyleOption: 'size', settings: {min: 0, max: 10}},
  {label: 'Rotation', type: 'range', mapStyleOption: 'rotation', settings: {min: 0, max: 360, value: 0}}
]
```
To create your custom styler pane combine the styler into a style array and pass it to the `addStyler` method.
Each element represents a selector in the styler pane:
* `label` Text who represents the selector
* `type`  Content type of the selector: select, color or range
* `mapStyleOption` Option name from [google.maps.Data.StyleOptions](https://developers.google.com/maps/documentation/javascript/3.exp/reference#Data.StyleOptions)
* `settings` Other options like min, max, default value, etc.

To create a styler pane add the following code to your script:
```javascript
styler.addStyler('edit-button', map, options)
```
### Development

To run the test you will need to install all dependencies, you will need `nodejs` as well as `npm`. Then in the root directory run:
```
$ npm install
```

Then you can automatically test everything with:
```
$ npm test
```

To check style rules you can execute:
```
$ npm run lint
```

And you can start a server with:
```
$ npm serve
```

> super-awesome-map-data-layer-styler uses Google Maps JavaScript API, to load it, use a sript tag with your own API key (see [Get a Key](https://developers.google.com/maps/documentation/javascript/get-api-key) for more information). You can choose one of [these tutorials](https://developers.google.com/maps/documentation/javascript/) to learn about it.

## And more...

Have you seen a power button? :bowtie: You can select one numeric value for each range selector and :boom: it scales the values based on the feature property selected

## Next steps

* choropleth map
* legend
* easter egg
