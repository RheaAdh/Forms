export const index = `
body {
    margin: 0;
    font-family: "Catamaran" !important;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

:root {
    --backgroundImage: url("/logo.png");
    --backgroundColor: #252525;
    --fontColor: #fff;
    --borderBottom: #02b7db;
    --marginTop: 1em;
    --adminNavbarHeight: 8em;
    --secondaryBackground: rgba(255, 255, 255, 0.12);
    --secondaryBorder: #fff;
    font-size: 20px;
    color: var(--fontColor);
    margin: 0;
    padding: 0;
}

p {
    margin: 0;
}

b {
    display: block;
}

h2 {
    margin: 0;
    font-size: 2.5em;
    font-weight: 600;
}

h3 {
    margin: 0;
}

*,
*:before,
*:after {
    box-sizing: border-box;
}

button {
    font-family: "Catamaran";
    font-size: var(--rootFontSize);
    background: transparent;
    cursor: pointer;
    padding: 0;
    margin: 0;
    color: white;
    background: transparent;
    box-shadow: 0px 0px 0px transparent;
    border: 0px solid transparent;
    text-shadow: 0px 0px 0px transparent;
}

a {
    text-decoration: none;
    outline: none;
    color: var(--fontColor);
}

input {
    display: block;
    font-size: 1em;
    background: none;
    outline: none;
    box-shadow: 0px 0px 0px transparent;
    border: 0px solid transparent;
    text-shadow: 0px 0px 0px transparent;
    color: var(--fontColor);
    font-family: "Catamaran";
}

svg path {
    fill: var(--fontColor);
}

.text-type > p,
.text-type > b {
    margin-top: var(--marginTop);
}

input[type="text"] {
    margin-top: var(--marginTop);
    border-bottom: 1px solid var(--fontColor);
    width: 35%;
}

input[type="text"]:active,
input[type="text"]:focus {
    border-bottom: 1px solid var(--borderBottom);
}

input:focus::-webkit-input-placeholder {
    color: transparent;
}
input:focus:-moz-placeholder {
    color: transparent;
}
input:focus::-moz-placeholder {
    color: transparent;
}
input:focus:-ms-input-placeholder {
    color: transparent;
}
input::placeholder {
    letter-spacing: 0.1em;
    color: var(--fontColor);
    font-weight: 100;
    font-family: "Catamaran";
}

textarea {
    max-height: 30vh;
    resize: none;
    border: none;
    outline: none;
    background: none;
    display: block;
    height: 2em;
    padding: 0;
    width: 80%;
    color: var(--fontColor);
    font-size: 1em;
    font-family: "Catamaran";
    font-weight: 400;
    margin-top: var(--marginTop);
    border-bottom: 1px solid var(--fontColor);
    overflow: auto;
}

textarea:focus,
textarea:active {
    border-bottom: 1px solid var(--borderBottom);
}

.radio-checkbox {
    display: flex;
    align-items: center;
    margin-top: 0.6em;
}

.radio-checkbox input[type="radio"],
.radio-checkbox input[type="checkbox"] {
    display: block;
    opacity: 0;
    width: 1em;
    height: 1em;
    margin: 0;
    padding: 0;
    cursor: pointer;
    position: absolute;
}

.radio-checkbox .styled-radio {
    display: block;
    width: 1em;
    height: 1em;
    border-radius: 50%;
    border: 2px solid var(--borderBottom);
}

.radio-checkbox .styled-checkbox {
    display: block;
    width: 1em;
    height: 1em;
    border: 2px solid var(--borderBottom);
}

.radio-checkbox .checkbox-tick {
    position: absolute;
    height: 0.5em;
    width: 0.85em;
    transform: rotate(-45deg) translateX(0.1em);
    border-bottom: 2px solid var(--fontColor);
    border-left: 2px solid var(--fontColor);
    pointer-events: none;
    opacity: 0;
}

.grid-question-row-item .checkbox-tick {
    transform: translateY(-0.9em) translateX(0.1em) rotate(-45deg);
}

.radio-checkbox input[type="radio"]:checked + .styled-radio {
    background: radial-gradient(
        var(--borderBottom) 50%,
        var(--backgroundColor) 51%
    );
}

.radio-checkbox input[type="checkbox"]:checked ~ .checkbox-tick {
    opacity: 1;
}

.radio-checkbox input[type="radio"]:checked ~ label,
.radio-checkbox input[type="checkbox"]:checked ~ label {
    color: var(--borderBottom);
}

.radio-checkbox label {
    cursor: pointer;
    margin-left: 1em;
}

select {
    appearance: none;
    outline: none;
    background-color: transparent;
    border: none;
    padding: 0 1em 0 0;
    margin: 0;
    width: 100%;
    font-size: 1em;
    font-family: "Catamaran";
    cursor: pointer;
    color: var(--fontColor);
}
select::-ms-expand {
    display: none;
}

.select {
    margin-top: var(--marginTop);
    position: relative;
    min-width: 25%;
    max-width: 35%;
    border: 1px solid var(--borderBottom);
    border-radius: 0.25em;
    padding: 1em;
    font-size: 1em;
    cursor: pointer;
    background-color: inherit;
}
.select-arrow {
    width: 1.5em;
    height: 1.5em;
    position: absolute;
    top: 1em;
    right: 0.45em;
    display: block;
    pointer-events: none;
}
.select-arrow svg {
    width: 1.2em !important;
    height: 1.2em !important;
}
.select-arrow svg path {
    fill: var(--fontColor);
}
option {
    background-color: var(--backgroundColor);
}
option:hover {
    background-color: var(--borderBottom);
}

.grid-question {
    display: flex;
    flex-direction: column;
    margin-top: var(--marginTop);
}

.grid-question-row {
    display: flex;
    min-width: 30%;
}

.grid-question-row-item:first-child {
    flex: 4;
}

.grid-question-row-item {
    display: inline-block;
    flex: 3;
    flex-wrap: wrap;
    margin-bottom: 1em;
}

.lin-scale-question {
    width: 100%;
    margin-top: var(--marginTop);
    display: flex;
}

.lin-scale-item {
    flex: 3 !important;
}

.lin-scale-item:first-child,
.lin-scale-item:last-child {
    transform: translateY(0.3em);
}

.lin-scale-item label {
    margin-left: 0.3em;
    position: relative;
    top: 1em;
}
.loading {
    background: var(--backgroundImage) no-repeat;
    background-position: right top;
    background-size: 40em 44em;
    background-color: var(--backgroundColor);
    overflow: hidden;
    height: 100vh;
    width: 100vw;
}

.switch-slider {
    height: 1.5em;
    width: 2.5em;
    border-radius: 0.75em;
}

.switch-btn {
    background-color: #fff;
    width: 1.5em;
    height: 1.5em;
    border-radius: 50%;
    transition: 500ms;
    cursor: pointer;
}

#popup {
    overflow: hidden;
    min-width: 8%;
    padding: 0.5rem 1rem;
    height: 2.5rem;
    transition: 1000ms;
    background-color: #fc6161;
    position: absolute;
    top: -5rem;
    left: 45%;
    z-index: 10;
    border-radius: 0.25em;
}
`
