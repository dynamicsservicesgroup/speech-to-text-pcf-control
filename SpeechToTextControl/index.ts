import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class SpeechToTextControl implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    private _container: HTMLDivElement;
    private _textArea: HTMLTextAreaElement;
    private _recordButton: HTMLButtonElement;
    private _clearButton: HTMLButtonElement;
    private _statusDiv: HTMLDivElement;
    private _notifyOutputChanged: () => void;
    private _transcribedText: string;
    private _recognition: SpeechRecognition | null;
    private _isRecording = false;
    private _context: ComponentFramework.Context<IInputs>;

    constructor() {
        this._transcribedText = "";
    }

    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        _state: ComponentFramework.Dictionary,
        container: HTMLDivElement
    ): void {
        this._context = context;
        this._container = container;
        this._notifyOutputChanged = notifyOutputChanged;

        // Create main container
        const mainContainer = document.createElement("div");
        mainContainer.className = "speech-to-text-container";

        // Create status display
        this._statusDiv = document.createElement("div");
        this._statusDiv.className = "status-display";
        this._statusDiv.innerHTML = "Ready to record";

        // Create text area
        this._textArea = document.createElement("textarea");
        this._textArea.className = "transcription-textarea";
        this._textArea.placeholder = "Click the microphone to start recording...";
        this._textArea.rows = 6;
        this._textArea.addEventListener("input", () => {
            this._transcribedText = this._textArea.value;
            this._notifyOutputChanged();
        });

        // Create button container
        const buttonContainer = document.createElement("div");
        buttonContainer.className = "button-container";

        // Record button
        this._recordButton = document.createElement("button");
        this._recordButton.className = "record-button";
        this._recordButton.innerHTML = "🎤 Start Recording";
        this._recordButton.addEventListener("click", this.toggleRecording.bind(this));

        // Clear button
        this._clearButton = document.createElement("button");
        this._clearButton.className = "clear-button";
        this._clearButton.innerHTML = "🗑️ Clear";
        this._clearButton.addEventListener("click", this.clearText.bind(this));

        // Append
        buttonContainer.appendChild(this._recordButton);
        buttonContainer.appendChild(this._clearButton);
        mainContainer.appendChild(this._statusDiv);
        mainContainer.appendChild(this._textArea);
        mainContainer.appendChild(buttonContainer);
        this._container.appendChild(mainContainer);

        // Initialize Speech Recognition
        this.initializeSpeechRecognition();

        // Load initial bound value
        const inputValue = context.parameters.transcribedText;
        if (inputValue && inputValue.raw) {
            this._transcribedText = inputValue.raw;
            this._textArea.value = this._transcribedText;
        }
    }

    // private initializeSpeechRecognition(): void {
    //     const SpeechRecognitionConstructor =
    //         (window as any).SpeechRecognition ||
    //         (window as any).webkitSpeechRecognition;

    //     if (!SpeechRecognitionConstructor) {
    //         this._statusDiv.innerHTML = "⚠️ Speech recognition not supported in this browser";
    //         this._statusDiv.style.color = "#d32f2f";
    //         this._recordButton.disabled = true;
    //         return;
    //     }

    private initializeSpeechRecognition(): void { 
    // Check if browser supports Speech Recognition 
     const SpeechRecognition = (window as Window & typeof globalThis & 
        { SpeechRecognition?: typeof window.SpeechRecognition; 
        webkitSpeechRecognition?: typeof window.SpeechRecognition; 
    }).SpeechRecognition || (window as Window & typeof globalThis & 
        { webkitSpeechRecognition?: typeof window.SpeechRecognition; }).webkitSpeechRecognition; 
        if (!SpeechRecognition) { this._statusDiv.innerHTML = "⚠️ Speech recognition not supported in this browser"; 
            this._statusDiv.style.color = "#d32f2f"; 
            this._recordButton.disabled = true; return; 
        }


        this._recognition = new SpeechRecognition();
        this._recognition.continuous = true;
        this._recognition.interimResults = true;
        this._recognition.lang = "en-US";

        this._recognition.onresult = (event: SpeechRecognitionEvent) => {
            let interimTranscript = "";
            let finalTranscript = "";

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript + " ";
                } else {
                    interimTranscript += transcript;
                }
            }

            if (finalTranscript) {
                this._transcribedText += finalTranscript;
                this._textArea.value = this._transcribedText;
                this._notifyOutputChanged();
            }

            if (interimTranscript) {
                this._statusDiv.innerHTML = `🎤 Listening: "${interimTranscript}"`;
            }
        };

        this._recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
            console.error("Speech recognition error:", event.error);
            this._statusDiv.innerHTML = `❌ Error: ${event.error}`;
            this._statusDiv.style.color = "#d32f2f";
            this.stopRecording();
        };

        this._recognition.onend = () => {
            if (this._isRecording && this._recognition) {
                this._recognition.start(); // Restart if still recording
            }
        };
    }

    private toggleRecording(): void {
        if (this._isRecording) {
            this.stopRecording();
        } else {
            this.startRecording();
        }
    }

    private startRecording(): void {
        if (!this._recognition) {
            this._statusDiv.innerHTML = "❌ Speech recognition not initialized";
            return;
        }

        try {
            this._recognition.start();
            this._isRecording = true;
            this._recordButton.innerHTML = "⏸️ Stop Recording";
            this._recordButton.classList.add("recording");
            this._statusDiv.innerHTML = "🎤 Recording... Speak now";
            this._statusDiv.style.color = "#d32f2f";
        } catch (error) {
            console.error("Error starting recording:", error);
            this._statusDiv.innerHTML = "❌ Failed to start recording";
        }
    }

    private stopRecording(): void {
        if (this._recognition) {
            this._recognition.stop();
        }
        this._isRecording = false;
        this._recordButton.innerHTML = "🎤 Start Recording";
        this._recordButton.classList.remove("recording");
        this._statusDiv.innerHTML = "Recording stopped";
        this._statusDiv.style.color = "#4caf50";
    }

    private clearText(): void {
        this._transcribedText = "";
        this._textArea.value = "";
        this._notifyOutputChanged();
        this._statusDiv.innerHTML = "Text cleared. Ready to record.";
        this._statusDiv.style.color = "#2196f3";
    }

    public updateView(context: ComponentFramework.Context<IInputs>): void {
        this._context = context;
        const inputValue = context.parameters.transcribedText;
        if (inputValue && inputValue.raw && inputValue.raw !== this._transcribedText) {
            this._transcribedText = inputValue.raw;
            this._textArea.value = this._transcribedText;
        }
    }

    public getOutputs(): IOutputs {
        return {
            transcribedText: this._transcribedText
        };
    }

    public destroy(): void {
        if (this._isRecording) {
            this.stopRecording();
        }
        this._recognition = null;
    }
}
