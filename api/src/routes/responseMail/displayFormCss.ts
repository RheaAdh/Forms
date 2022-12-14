export const displayForm = `
.dashboard-page {
    // background: url("http://localhost:3000/logo.png") no-repeat;
    background-position: right top;
    background-size: 40rem 44rem;
    background-color: var(--backgroundColor);
    overflow: hidden;
    height: 100vh;
    width: 100vw;
    --dashboardNavbarHeight: 5rem;
}

.dashboard-container {
    position: relative;
    height: calc(100vh - var(--dashboardNavbarHeight));
    width: 92.5vw;
    left: 7.5vw;
    overflow-y: auto;
    padding-right: 7.5vw;
}

.dashboard-container h3 {
    font-size: 1.5rem;
    margin: 1rem 0;
}

.dashboard-container h3 > button {
    position: relative;
    left: 0.5em;
    top: 0.15em;
}

.forms-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 1rem;
}

.templates-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    overflow-x: auto;
}

.templates-container > .form-card {
    flex: none;
    margin-right: 1em;
}

.dashboard-container button .icon-info {
    z-index: 2;
    position: absolute;
    width: max-content;
    display: block;
    font-size: 0.9rem;
    height: 0;
    padding: 0;
    background-color: rebeccapurple;
    overflow: hidden;
    transition: 250ms;
    -webkit-transition: 250ms;
    -moz-transition: 250ms;
    transform: translateX(-0.45em) translateY(0.1em);
}

.dashboard-container button:hover .icon-info {
    padding: 0.5em;
    overflow: visible;
    height: auto;
}

.dashboard-container button .text-info-arrow {
    z-index: 1;
    position: absolute;
    display: block;
    width: 1.5rem;
    height: 0rem;
    overflow: hidden;
    transform: translateY(-0.5rem) translateX(-0.1em) rotate(-45deg);
    -webkit-transform: translateY(-0.5rem) translateX(-0.1em) rotate(-45deg);
    background-color: rebeccapurple;
}

.dashboard-container button:hover .text-info-arrow {
    overflow: visible;
    height: 1.5rem;
}
`
