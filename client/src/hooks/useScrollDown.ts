import { useEffect, useState } from "react"
import { useQuestionsList } from "../context/questions/QuestionListContext"

export default () => {
    const [newQuestionIndex, setNewQuestionIndex] = useState<number>(-2)
    const questions = useQuestionsList()?.questions

    useEffect(() => {
        if (questions && newQuestionIndex >= questions?.length) {
            // last question id
            document
                .getElementById(questions[questions.length - 1].qid || "")
                ?.scrollIntoView()
        } else if (questions && newQuestionIndex != -2) {
            document
                .getElementById(questions[newQuestionIndex].qid || "")
                ?.scrollIntoView()
        }
        setNewQuestionIndex(-2)
    }, [newQuestionIndex])

    return (index: number) => setNewQuestionIndex(index)
}
