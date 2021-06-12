import React from "react"
import { useHistory } from "react-router"
interface props {
    form: any
}

const ResponseCard: React.FC<props> = ({ form }) => {
    const history = useHistory()

    const handleClick = (
        e: React.MouseEvent<HTMLHeadingElement, MouseEvent>
    ) => {
        history.push(`editform/${form._id}`)
    }

    return (
        <div>
            <div style={{ backgroundColor: form.color_theme, margin: 30 }}>
                <h2
                    style={{ cursor: "pointer" }}
                    onClick={(e) => handleClick(e)}
                >
                    {form.title}
                </h2>
                <p>Start time:</p>
                <p>End time:</p>
                <p>Number of responses:</p>
                <button
                    onClick={() => {
                        history.push(`/responses/${form._id}`)
                    }}
                >
                    View Responses
                </button>
            </div>
        </div>
    )
}

export default ResponseCard
