import React, { useEffect, useState } from "react"
import { useQuestionsList } from "../../context/questions/QuestionListContext"

const ErrorPopup: React.FC = () => {
    const questions = useQuestionsList()

    const [transformLength, setTransformLength] = useState<string>("")

    useEffect(() => {
        if (questions?.questionError !== null) {
            setTransformLength("10rem")
            setTimeout(() => {
                questions?.questionActions?.setQuestionError(null)
            }, 3500)
            setTimeout(() => {
                setTransformLength("-10rem")
            }, 3000)
        }
    }, [questions?.questionError])

    return (
        <div id="popup" style={{ transform: `translateY(${transformLength})` }}>
            {questions?.questionError}
        </div>
    )
}

export default ErrorPopup
