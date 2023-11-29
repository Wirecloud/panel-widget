/*
 * Copyright (c) 2017 CoNWeT Lab., Universidad Politecnica de Madrid
 * Copyright (c) 2018 Future Internet Consulting and Development Solutions S.L.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* globals MashupPlatform */

(function () {

    "use strict";

    const colorRegex = /^#[0-9a-fA-F]{8}$/i;

    class Widget {
        constructor(MashupPlatform, shadowDOM, _) {
            this.MashupPlatform = MashupPlatform;
            this.shadowDOM = shadowDOM;

            this.body = this.shadowDOM.querySelector('body');

            this.init();
            this.repaint();
        }

        repaint() {
            var height, width, backgroundColor, textColor, message, next, min;

            height = this.MashupPlatform.widget.context.get('heightInPixels');
            width = this.MashupPlatform.widget.context.get('widthInPixels');
            backgroundColor = this.MashupPlatform.prefs.get('background-color');
            textColor = this.MashupPlatform.prefs.get('text-color');
            message = this.shadowDOM.getElementById('message');

            if (colorRegex.test(textColor)) {
                this.body.style.color = "rgba(" + parseInt(textColor.substr(1, 2), 16) + "," +
                            parseInt(textColor.substr(3, 2), 16) + "," +
                            parseInt(textColor.substr(5, 2), 16) + "," +
                            (parseInt(textColor.substr(7, 2), 16) / 255) + ")";
            } else {
                this.body.style.color = "#000000";
                this.MashupPlatform.widget.log("Invalid text color: " + textColor, this.MashupPlatform.log.WARN);
            }

            this.body.style.fontSize = (height * 0.7) + 'px';
            this.body.style.lineHeight = height + 'px';
            if (colorRegex.test(backgroundColor)) {
                this.body.style.backgroundColor = "rgba(" + parseInt(backgroundColor.substr(1, 2), 16) + "," +
                            parseInt(backgroundColor.substr(3, 2), 16) + "," +
                            parseInt(backgroundColor.substr(5, 2), 16) + "," +
                            (parseInt(backgroundColor.substr(7, 2), 16) / 255) + ")";
            } else {
                this.body.style.backgroundColor = "#FFFFFF";
                this.MashupPlatform.widget.log("Invalid background color: " + backgroundColor, this.MashupPlatform.log.WARN);
            }

            message.style.height = height + 'px';

            next = Number(this.MashupPlatform.prefs.get('max-height')) / 100;
            min = Number(this.MashupPlatform.prefs.get('min-height')) / 100;
            while ((message.offsetWidth > width || message.offsetHeight > height) && next >= min) {
                this.body.style.fontSize = Math.floor(height * next) + 'px';
                next -= 0.05;
            }
            if ((message.offsetWidth > width || message.offsetHeight > height)) {
                this.body.style.fontSize = Math.floor(height * min) + 'px';
            }
        }

        parseInputEndpointData(data) {
            if (typeof data === "string") {
                try {
                    data = JSON.parse(data);
                } catch (e) {
                    return data;
                }
            }

            return data;
        }

        processIncomingData(data) {
            var message, unit, decimals, default_unit, pow;

            data = this.parseInputEndpointData(data);
            if (data == null || ["number", "string", "boolean"].indexOf(typeof data) !== -1) {
                data = {
                    value: data
                };
            }
            decimals = parseInt(this.MashupPlatform.prefs.get('decimals'), 10);
            if (isNaN(decimals) || decimals < 0) {
                decimals = 0;
            }

            message = this.shadowDOM.getElementById('message');
            if (data.value == null) {
                message.textContent = this.MashupPlatform.prefs.get('default-value');
            } else if (typeof data.value === 'number') {
                pow = Math.pow(10, decimals);
                data.value = Math.round((pow * data.value).toFixed(decimals)) / pow;
                message.textContent = data.value;
            } else {
                message.textContent = data.value;
            }

            unit = document.createElement('span');
            default_unit = this.MashupPlatform.prefs.get('default-unit');
            if (data.unit != null) {
                unit.textContent = data.unit;
                message.appendChild(unit);
            } else if (!("unit" in data) && default_unit.trim() != "") {
                unit.textContent = default_unit;
                message.appendChild(unit);
            }

            this.repaint();
        }

        init() {
            this.MashupPlatform.wiring.registerCallback('textinput', this.processIncomingData.bind(this));

            this.MashupPlatform.widget.context.registerCallback(function (newValues) {
                if ("heightInPixels" in newValues || "widthInPixels" in newValues) {
                    this.repaint();
                }
            }.bind(this));

            this.MashupPlatform.prefs.registerCallback(function (_) {
                this.repaint();
            }.bind(this));

            /* Initial content */

            var message = this.shadowDOM.getElementById('message');
            message.textContent = this.MashupPlatform.prefs.get('default-value');

            var default_unit = this.MashupPlatform.prefs.get('default-unit');
            if (default_unit.trim() != "") {
                var unit = document.createElement('span');
                unit.textContent = default_unit;
                message.appendChild(unit);
            }
        }
    }

    window.CoNWeT_Panel = Widget;

})();
