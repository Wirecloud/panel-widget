Panel widget
============

The panel widget is a WireCloud widget that provides an easy way to display simple text messages, like measures.

## Settings

- `Title`: Title to show in the panel (empty for not showing any title).
- `Min height (Percentage)`: Minimal font-size to use. This value is a percentage relative to the available height.
- `Max height (Percentage)`: Maximal font-size to use. This value is a percentage relative to the available height.
- `Decimals`: Number of decimals to use for number values. Empty for using all the available decimals.
- `Background color`: Background color to use for the panel.
- `Text color`: Text color to use for the panel.
- `Bar color`: Color to use for the bar that shows the current value in relation to a minimum and maximum value.
- `Min value`: Minimum value to use for the bar.
- `Max value`: Maximum value to use for the bar.
- `Left tag text`: Text to show on the left side of the bar.
- `Right tag text`: Text to show on the right side of the bar.

## Wiring

### Input Endpoints

- **Contents**: An object with the message to display. The message should be provided using the `value` key. E.g.
    ```json
    {
        "value": "Text message"
    }
    ```

    You can also provide a unit:

    ```json
    {
        "value": "24.5",
        "unit": "ºC"
    }
    ```

### Output Endpoints

- This widget has no output endpoint

