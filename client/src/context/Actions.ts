const getQuestionsAndResponses = async (formId: string, toEdit: boolean) => {
    const res = await fetch(
        `http://localhost:7000/api/getquestionsbyformid/${formId}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ toEdit }),
            credentials: "include",
        }
    )
    const data = await res.json()
    return {
        ques: data.ques,
        prevResponse: data.prevResponse,
        status: res.status,
    }
}

export const getByResponseId = async (responseId: string) => {
    const res = await fetch(
        `http://localhost:7000/api/response/${responseId}`,
        {
            method: "GET",
            headers: {
                "Content-type": "appication/json",
            },
        }
    )
    const data = await res.json()
    return data
}

export default getQuestionsAndResponses
