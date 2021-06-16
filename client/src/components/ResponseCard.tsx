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
                <p>
                    Is Active:{form.isActive ? <div>YES</div> : <div>NO</div>}
                </p>
                <p>End time:{form.closes}</p>
                <p>Number of responses:</p>
                <button
                    onClick={() => {
                        history.push(`/responses/${form._id}`)
                    }}
                >
                    View Responses
                </button>
                <a href={`http://localhost:7000/api/download/${form._id}`}>
                    <button>Download Responses</button>
                </a>
            </div>
        </div>
    )
}

export default ResponseCard
