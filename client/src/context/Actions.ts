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

export const downloadResponse = async (formId: string) => {
    const res = await fetch(`http://localhost:7000/api/download/${formId}`, {
        headers: {
            "Content-type": "application/json",
        },
        method: "GET",
        credentials: "include",
    })
    const data = await res.json()
    if (data.length === 0) {
        return null
    }
    console.log(data)
    const columns = []
    for (var i = 0; i < Object.keys(data.data[0]).length; i++) {
        columns.push({ id: i, displayName: Object.keys(data.data[0])[i] })
    }
    const dataForDownload = []
    for (var i = 0; i < data.data.length; i++) {
        const newObj = {} as any
        for (var j = 0; j < columns.length; j++) {
            newObj[columns[j].id] = data.data[i][columns[j].displayName]
        }
        dataForDownload.push(newObj)
    }
    console.log(columns, dataForDownload)
    return { columns, dataForDownload }
}

export default getQuestionsAndResponses
