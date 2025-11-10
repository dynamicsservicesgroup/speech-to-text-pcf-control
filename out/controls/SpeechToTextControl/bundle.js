/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
var pcf_tools_652ac3f36e1e4bca82eb3c1dc44e6fad;
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./SpeechToTextControl/index.ts":
/*!**************************************!*\
  !*** ./SpeechToTextControl/index.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   SpeechToTextControl: () => (/* binding */ SpeechToTextControl)\n/* harmony export */ });\nclass SpeechToTextControl {\n  constructor() {\n    this._isRecording = false;\n    this._transcribedText = \"\";\n  }\n  init(context, notifyOutputChanged, _state, container) {\n    this._context = context;\n    this._container = container;\n    this._notifyOutputChanged = notifyOutputChanged;\n    // Create main container\n    var mainContainer = document.createElement(\"div\");\n    mainContainer.className = \"speech-to-text-container\";\n    // Create status display\n    this._statusDiv = document.createElement(\"div\");\n    this._statusDiv.className = \"status-display\";\n    this._statusDiv.innerHTML = \"Ready to record\";\n    // Create text area\n    this._textArea = document.createElement(\"textarea\");\n    this._textArea.className = \"transcription-textarea\";\n    this._textArea.placeholder = \"Click the microphone to start recording...\";\n    this._textArea.rows = 6;\n    this._textArea.addEventListener(\"input\", () => {\n      this._transcribedText = this._textArea.value;\n      this._notifyOutputChanged();\n    });\n    // Create button container\n    var buttonContainer = document.createElement(\"div\");\n    buttonContainer.className = \"button-container\";\n    // Record button\n    this._recordButton = document.createElement(\"button\");\n    this._recordButton.className = \"record-button\";\n    this._recordButton.innerHTML = \"🎤 Start Recording\";\n    this._recordButton.addEventListener(\"click\", this.toggleRecording.bind(this));\n    // Clear button\n    this._clearButton = document.createElement(\"button\");\n    this._clearButton.className = \"clear-button\";\n    this._clearButton.innerHTML = \"🗑️ Clear\";\n    this._clearButton.addEventListener(\"click\", this.clearText.bind(this));\n    // Append\n    buttonContainer.appendChild(this._recordButton);\n    buttonContainer.appendChild(this._clearButton);\n    mainContainer.appendChild(this._statusDiv);\n    mainContainer.appendChild(this._textArea);\n    mainContainer.appendChild(buttonContainer);\n    this._container.appendChild(mainContainer);\n    // Initialize Speech Recognition\n    this.initializeSpeechRecognition();\n    // Load initial bound value\n    var inputValue = context.parameters.transcribedText;\n    if (inputValue && inputValue.raw) {\n      this._transcribedText = inputValue.raw;\n      this._textArea.value = this._transcribedText;\n    }\n  }\n  // private initializeSpeechRecognition(): void {\n  //     const SpeechRecognitionConstructor =\n  //         (window as any).SpeechRecognition ||\n  //         (window as any).webkitSpeechRecognition;\n  //     if (!SpeechRecognitionConstructor) {\n  //         this._statusDiv.innerHTML = \"⚠️ Speech recognition not supported in this browser\";\n  //         this._statusDiv.style.color = \"#d32f2f\";\n  //         this._recordButton.disabled = true;\n  //         return;\n  //     }\n  initializeSpeechRecognition() {\n    // Check if browser supports Speech Recognition \n    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;\n    if (!SpeechRecognition) {\n      this._statusDiv.innerHTML = \"⚠️ Speech recognition not supported in this browser\";\n      this._statusDiv.style.color = \"#d32f2f\";\n      this._recordButton.disabled = true;\n      return;\n    }\n    this._recognition = new SpeechRecognition();\n    this._recognition.continuous = true;\n    this._recognition.interimResults = true;\n    this._recognition.lang = \"en-US\";\n    this._recognition.onresult = event => {\n      var interimTranscript = \"\";\n      var finalTranscript = \"\";\n      for (var i = event.resultIndex; i < event.results.length; i++) {\n        var transcript = event.results[i][0].transcript;\n        if (event.results[i].isFinal) {\n          finalTranscript += transcript + \" \";\n        } else {\n          interimTranscript += transcript;\n        }\n      }\n      if (finalTranscript) {\n        this._transcribedText += finalTranscript;\n        this._textArea.value = this._transcribedText;\n        this._notifyOutputChanged();\n      }\n      if (interimTranscript) {\n        this._statusDiv.innerHTML = \"\\uD83C\\uDFA4 Listening: \\\"\".concat(interimTranscript, \"\\\"\");\n      }\n    };\n    this._recognition.onerror = event => {\n      console.error(\"Speech recognition error:\", event.error);\n      this._statusDiv.innerHTML = \"\\u274C Error: \".concat(event.error);\n      this._statusDiv.style.color = \"#d32f2f\";\n      this.stopRecording();\n    };\n    this._recognition.onend = () => {\n      if (this._isRecording && this._recognition) {\n        this._recognition.start(); // Restart if still recording\n      }\n    };\n  }\n  toggleRecording() {\n    if (this._isRecording) {\n      this.stopRecording();\n    } else {\n      this.startRecording();\n    }\n  }\n  startRecording() {\n    if (!this._recognition) {\n      this._statusDiv.innerHTML = \"❌ Speech recognition not initialized\";\n      return;\n    }\n    try {\n      this._recognition.start();\n      this._isRecording = true;\n      this._recordButton.innerHTML = \"⏸️ Stop Recording\";\n      this._recordButton.classList.add(\"recording\");\n      this._statusDiv.innerHTML = \"🎤 Recording... Speak now\";\n      this._statusDiv.style.color = \"#d32f2f\";\n    } catch (error) {\n      console.error(\"Error starting recording:\", error);\n      this._statusDiv.innerHTML = \"❌ Failed to start recording\";\n    }\n  }\n  stopRecording() {\n    if (this._recognition) {\n      this._recognition.stop();\n    }\n    this._isRecording = false;\n    this._recordButton.innerHTML = \"🎤 Start Recording\";\n    this._recordButton.classList.remove(\"recording\");\n    this._statusDiv.innerHTML = \"Recording stopped\";\n    this._statusDiv.style.color = \"#4caf50\";\n  }\n  clearText() {\n    this._transcribedText = \"\";\n    this._textArea.value = \"\";\n    this._notifyOutputChanged();\n    this._statusDiv.innerHTML = \"Text cleared. Ready to record.\";\n    this._statusDiv.style.color = \"#2196f3\";\n  }\n  updateView(context) {\n    this._context = context;\n    var inputValue = context.parameters.transcribedText;\n    if (inputValue && inputValue.raw && inputValue.raw !== this._transcribedText) {\n      this._transcribedText = inputValue.raw;\n      this._textArea.value = this._transcribedText;\n    }\n  }\n  getOutputs() {\n    return {\n      transcribedText: this._transcribedText\n    };\n  }\n  destroy() {\n    if (this._isRecording) {\n      this.stopRecording();\n    }\n    this._recognition = null;\n  }\n}\n\n//# sourceURL=webpack://pcf_tools_652ac3f36e1e4bca82eb3c1dc44e6fad/./SpeechToTextControl/index.ts?\n}");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./SpeechToTextControl/index.ts"](0,__webpack_exports__,__webpack_require__);
/******/ 	pcf_tools_652ac3f36e1e4bca82eb3c1dc44e6fad = __webpack_exports__;
/******/ 	
/******/ })()
;
if (window.ComponentFramework && window.ComponentFramework.registerControl) {
	ComponentFramework.registerControl('SpeechToText.SpeechToTextControl', pcf_tools_652ac3f36e1e4bca82eb3c1dc44e6fad.SpeechToTextControl);
} else {
	var SpeechToText = SpeechToText || {};
	SpeechToText.SpeechToTextControl = pcf_tools_652ac3f36e1e4bca82eb3c1dc44e6fad.SpeechToTextControl;
	pcf_tools_652ac3f36e1e4bca82eb3c1dc44e6fad = undefined;
}