Panel widget
============

The panel widget is a WireCloud widget that provides an easy way to display simple text messages, like measures.

Build
-----

Be sure to have installed [Node.js](http://node.js) and [Bower](http://bower.io)
in your system. For example, you can install it on Ubuntu and Debian running the
following commands:

```bash
curl -sL https://deb.nodesource.com/setup | sudo bash -
sudo apt-get install nodejs
sudo apt-get install npm
sudo npm install -g bower
```

Install other npm dependencies by running: (need root because some libraries use applications, check package.json before to be sure)

```bash
sudo npm install
```

For build the widget you need download grunt:

```bash
sudo npm install -g grunt-cli
```

And now, you can use grunt:

```bash
grunt
```

If everything goes well, you will find a wgt file in the `build` folder.

## Settings

- `Min height (Percentage)`: Minimal font-size to use. This value is a percentage relative to the available height.
- `Max height (Percentage)`: Maximal font-size to use. This value is a percentage relative to the available height.

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

## Reference

- [FIWARE Lab's Mashup Portal](https://mashup.lab.fiware.org/)

## Copyright and License

Copyright 2015 CoNWeT Lab., Universidad Politecnica de Madrid

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
