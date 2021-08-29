import { useEffect, useState } from "react"
import { useQuestionsList } from "../context/questions/QuestionListContext"

export default () => {
    const [newQuestionIndex, setNewQuestionIndex] = useState<number>(-2)
    const questions = useQuestionsList()?.questions

    useEffect(() => {
        if (newQuestionIndex === -1 && questions) {
            // Scroll to last question
            document
                .getElementById(questions[questions.length - 1].qid || "")
                ?.scrollIntoView()
        } else if (newQuestionIndex !== -2 && questions) {
            document
                .getElementById(questions[newQuestionIndex].qid || "")
                ?.scrollIntoView()
        }
        setNewQuestionIndex(-2)
    }, [newQuestionIndex])

    return (index: number) => setNewQuestionIndex(index)
}
