---
title: Properties
description: ''
position: 2
category: Getting Start
---

## Properties

| Name | Type | Required | Default | Description |
| ---  | ---  | ---      | ---     | ---         |
| ssr | Boolean | --- | false | use v-if(true) or v-show(false) |
| classes | [String, Object, Array] | --- | '' | custom class names for Modal container element |
| contentClass | [String, Object, Array] | --- | '' | custom class names for Modal content element |
| lockScroll | Boolean | --- | true | whether scroll of body is disabled while Dialog is displayed |
| hideOverlay | Boolean | --- | false | Hides the display of the overlay. |
| clickToClose | Boolean | --- | true | Clicking outside of the element will not close Modal. |
| preventClick | Boolean | --- | false | The click event will not be blocked by overlay |
| overlayClass | String | --- | '' | Add classes to the overlay element. |
| transition | String | --- | 'vfm' | CSS transition applied to the modal window. |
| overlayTransition | String | --- | 'vfm' | CSS transition applied to the overlay (background). |
| attach | any | --- | 'body' | Specifies which DOM element that this component should detach to. Set `false` will disabled this feature. String can be any valid querySelector and Object can be any valid Node.  This will attach to the <body> element by default. |
