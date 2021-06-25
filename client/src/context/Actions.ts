const getQuestionsAndResponses = async (formId: string) => {
    const res = await fetch(
        `http://localhost:7000/api/getquestionsbyformid/${formId}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        }
    )
    const data = await res.json()
    return data
}

export default getQuestionsAndResponses
