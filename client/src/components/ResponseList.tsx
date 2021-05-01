import React, { useEffect, useState } from "react"
import ResponseCard from "./ResponseCard"

interface props {
    creatorRole: string
}

const ResponseList: React.FC<props> = ({ creatorRole }) => {
    const [forms, setForms] = useState<any[]>([])

    useEffect(() => {
        console.log(`http://localhost:7000/api/get${creatorRole}forms`)
        fetch(`http://localhost:7000/api/get${creatorRole}forms`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        })
            .then((resp: any) => {
                return resp.json()
            })
            .catch((e) => console.log(e))

            .then((data: any) => {
                console.log({ data })
                if (data.success === true) {
                    setForms(data.forms)
                } else {
                    console.log("Where is the data?")
                }
            })
    }, [creatorRole])

    return (
        <div className="form-list">
            Forms Responses:
            {!forms ? (
                "Loading..."
            ) : (
                <div>
                    {forms.map((form) => (
                        <ResponseCard form={form} key={form._id} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default ResponseList
