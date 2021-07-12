import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import App from "./App"
import * as serviceWorker from "./serviceWorker"
import { BrowserRouter } from "react-router-dom"
import AuthProvider from "./context/AuthContext"
import CurrentFormProvider from "./context/CurrentFormContext"
import QuestionsListProvider from "./context/QuestionListContext"
import ResponseListProvider from "./context/ResponseListContext"
import { QueryClient, QueryClientProvider } from "react-query"

const queryClient = new QueryClient()

ReactDOM.render(
    <QueryClientProvider client={queryClient}>
        <BrowserRouter>
            <AuthProvider>
                <CurrentFormProvider>
                    <QuestionsListProvider>
                        <ResponseListProvider>
                            <App />
                        </ResponseListProvider>
                    </QuestionsListProvider>
                </CurrentFormProvider>
            </AuthProvider>
        </BrowserRouter>
    </QueryClientProvider>,
    document.getElementById("root")
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
