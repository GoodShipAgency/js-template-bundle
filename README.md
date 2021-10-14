# Installation

`yarn add mashbo-template-library`
alternatively, if using pnpm:
`pnpm install mashbo-template-library`

# Usage

Every export is a function export meaning you just import using 

`import { overlay, overlayButton, datepicker } from 'mashbo-template-library;`.

Once imported, reference the usage library table below to find which type of usage is needed.

### Alpine components
alpine components usually require: `window.overlay = overlay;` but can also be extended by using a spread operator in another function like so:

```javascript
function customOverlay() {
    return {
        ...overlay,
        otherProperties() {}
    }
}
```

alpine type arent necessarily alpine components, they can be utilities that are used in the alpine component lifecycle but passing to the window object is still required.

### Initialisers

initialiser components are used as normal functions, usually initialising another library or directly referencing dom elements.

```javascript
import {initialiseDatePicker } from "mashbo-template-libary";

initialiseDatePicker();
```

# Usage Library

Component | Type |
| ------------- |:-------------:|
| overlay | alpine |
| overlayButton | alpine |
| dropoutMenu | alpine |
| tabs | alpine |
| htmxDispatch | alpine |
| initialiseDatePicker | alpine |
| initialiseMultiSelect | initialiser |


