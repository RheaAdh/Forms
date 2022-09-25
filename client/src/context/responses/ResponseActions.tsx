import { get, post } from "../../utils/requests"

export const downloadResponse = async (formId: string) => {
    const data = await (await get(`/api/download/${formId}`)).json()
    if (data.data.length === 0) {
        return null
    }
    const columns = []
    for (var i = 0; i < Object.keys(data.data[0]).length; i++) {
        columns.push({ id: i, displayName: Object.keys(data.data[0])[i] })
    }
    const dataForDownload = []
    for (i = 0; i < data.data.length; i++) {
        const newObj = {} as any
        for (var j = 0; j < columns.length; j++) {
            newObj[columns[j].id] = data.data[i][columns[j].displayName]
        }
        dataForDownload.push(newObj)
    }
    return { columns, dataForDownload }
}

export const getUsersAction = async (formId: string) => {
    const data = await (
        await get(`/api/responsesidbyformfilled/${formId}`)
    ).json()
    return data.data
}

export const submitAction = async (body: any, id: string | undefined) => {
    const data = await (await post(`/api/submitresponse/${id}`, body)).json()
    return data
}
