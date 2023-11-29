/*
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

/* global MashupPlatform, MockMP, shadowDOM, widget */

(function () {

    "use strict";

    const HTML_FIXTURE_CODE = '<h1 id="message"><span id="unit"></span></h1>';

    const clearDocument = function clearDocument() {
        var elements = shadowDOM.querySelector("body").children;

        for (var i = 0; i < elements.length; i++) {
            elements[i].parentElement.removeChild(elements[i]);
        }
    };

    describe("panel-widget", () => {

        beforeAll(function () {
            window.MashupPlatform = new MockMP({
                type: 'widget',
                prefs: {
                    'default-value': '--',
                    'default-unit': '',
                    'max-height': 60,
                    'min-height': 10,
                    'decimals': 1,
                    'background-color': '#FFFFFFFF',
                    'text-color': '#000000FF'
                },
                inputs: ['textinput']
            });

            let div = document.createElement('div');
            div.id = 'widget';
            document.body.appendChild(div);
            div.attachShadow({mode: 'open'});
            let shadowBody = document.createElement('body');
            div.shadowRoot.appendChild(shadowBody);
            window.shadowDOM = div.shadowRoot;
            shadowDOM.querySelector("body").innerHTML += HTML_FIXTURE_CODE

            window.widget = new window.CoNWeT_Panel(MashupPlatform, shadowDOM, undefined);
        });

        beforeEach(() => {
            clearDocument();
            shadowDOM.querySelector("body").innerHTML += HTML_FIXTURE_CODE;
            MashupPlatform.reset();
        });

        describe("prefs", () => {

            describe("default-value", () => {

                it("should work with the default value", () => {
                    spyOn(widget, "repaint");
                    widget.init();

                    expect(widget.repaint).not.toHaveBeenCalled();
                    expect(shadowDOM.getElementById('message').textContent).toBe("--");
                });

                it("should work with other values", () => {
                    MashupPlatform.prefs.set("default-value", "n/a");
                    spyOn(widget, "repaint");
                    widget.init();

                    expect(widget.repaint).not.toHaveBeenCalled();
                    expect(shadowDOM.getElementById('message').textContent).toBe("n/a");
                });

            });

            describe("default-unit", () => {

                it("should work with the default value", () => {
                    spyOn(widget, "repaint");
                    widget.init();

                    expect(widget.repaint).not.toHaveBeenCalled();
                    expect(shadowDOM.getElementById('message').textContent).toBe("--");
                });

                it("should work with other values", () => {
                    MashupPlatform.prefs.set("default-unit", "ºC");
                    spyOn(widget, "repaint");
                    widget.init();

                    expect(widget.repaint).not.toHaveBeenCalled();
                    expect(shadowDOM.getElementById('message').textContent).toBe("--ºC");
                });

            });

            describe("decimals", () => {

                it("should work with the default value", () => {
                    spyOn(widget, "repaint");
                    widget.init();

                    widget.processIncomingData(5.12);

                    expect(shadowDOM.getElementById('message').textContent).toBe("5.1");
                });

                it("should work with other values", () => {
                    MashupPlatform.prefs.set("decimals", "2");
                    spyOn(widget, "repaint");
                    widget.init();

                    widget.processIncomingData(5.12);

                    expect(shadowDOM.getElementById('message').textContent).toBe("5.12");
                });

                it("should handle invalid decimal values", () => {
                    MashupPlatform.prefs.set("decimals", "-1");
                    spyOn(widget, "repaint");
                    widget.init();

                    widget.processIncomingData(5.12);

                    expect(shadowDOM.getElementById('message').textContent).toBe("5");
                });

            });

        });

        describe("wiring input", () => {

            describe("basic values (plain)", () => {

                it("number", () => {
                    widget.init();
                    widget.processIncomingData(5);

                    expect(shadowDOM.getElementById('message').textContent).toBe("5");
                });

                it("string", () => {
                    widget.init();
                    widget.processIncomingData("new content");

                    expect(shadowDOM.getElementById('message').textContent).toBe("new content");
                });

                it("boolean", () => {
                    widget.init();
                    widget.processIncomingData(true);

                    expect(shadowDOM.getElementById('message').textContent).toBe("true");
                });

                it("null", () => {
                    widget.init();
                    widget.processIncomingData(null);

                    expect(shadowDOM.getElementById('message').textContent).toBe("--");
                });

            });

            describe("basic values", () => {

                it("number", () => {
                    widget.init();
                    widget.processIncomingData({value: 5});

                    expect(shadowDOM.getElementById('message').textContent).toBe("5");
                });

                it("string", () => {
                    widget.init();
                    widget.processIncomingData({value: "new content"});

                    expect(shadowDOM.getElementById('message').textContent).toBe("new content");
                });

                it("boolean", () => {
                    widget.init();
                    widget.processIncomingData({value: true});

                    expect(shadowDOM.getElementById('message').textContent).toBe("true");
                });

                it("null", () => {
                    MashupPlatform.prefs.set("default-unit", "ºC");
                    widget.init();
                    widget.processIncomingData({value: null});

                    expect(shadowDOM.getElementById('message').textContent).toBe("--ºC");
                });

            });

            describe("unit override", () => {

                it("number", () => {
                    widget.init();
                    widget.processIncomingData({value: 5, unit: "km/h"});

                    expect(shadowDOM.getElementById('message').textContent).toBe("5km/h");
                });

                it("string", () => {
                    MashupPlatform.prefs.set("default-unit", "ºC");
                    widget.init();
                    widget.processIncomingData({value: "new content", unit: ""});

                    expect(shadowDOM.getElementById('message').textContent).toBe("new content");
                });

                it("boolean", () => {
                    MashupPlatform.prefs.set("default-unit", "ºC");
                    widget.init();
                    widget.processIncomingData({value: true, unit: null});

                    expect(shadowDOM.getElementById('message').textContent).toBe("true");
                });

                it("null", () => {
                    widget.init();
                    widget.processIncomingData({value: null, unit: "km/h"});

                    expect(shadowDOM.getElementById('message').textContent).toBe("--km/h");
                });

            });

        });

    });

})();
