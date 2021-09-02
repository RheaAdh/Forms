import { deleteRequest, get, post, put } from "../../utils/requests"

export const getQuestionsAndResponses = async (
    formId: string | undefined,
    admin: boolean
) => {
    if (formId === undefined || formId.length === 0)
        throw new Error("Invalid Form ID")
    const res = await post(`/api/getquestionsbyformid/${formId}`, {
        admin,
    })
    const data = await res.json()
    return {
        ...data.data,
        status: res.status,
    }
}

export const getByResponseId = async (responseId: string) => {
    const res = await get(`/api/resbyresponseid/${responseId}`)
    const data = await res.json()
    return { status: res.status, ...data }
}

export const getByResponseIdPublic = async (responseId: string) => {
    const res = await get(`/api/response/${responseId}`, false)
    const data = await res.json()
    return { status: res.status, ...data }
}

export const deleteFormAction = async (id: string) => {
    const resp = await deleteRequest("/api/deleteform", { _id: id })
    const data = await resp.json()
    if (!data.success || resp.status >= 400) {
        throw new Error(data.msg)
    }
    return data
}

export const getFormsAction = async () => {
    const resp = await get(`/api/getforms`)
    const data = await resp.json()
    // NEED TO THROW ERROR ON FAILURE
    return data
}

export const getTemplatesAction = async () => {
    const data = await (await get(`/api/viewAllTemplates`)).json()
    return data
}

export const getForm = async (id: string, admin: boolean) => {
    let route = ``
    if (admin) {
        route = `/api/getform/${id}`
    } else {
        route = `/api/getformforresp/${id}`
    }
    const res = await get(route)
    const data = await res.json()
    return {
        status: res.status,
        success: data.success,
        msg: data.msg,
        data: data.form,
    }
}

export const updateFormAction = async (updateData: any) => {
    const resp = await put(`/api/updateform/${updateData._id}`, updateData)
    const data = await resp.json()
    if (data.success === false || resp.status >= 400) {
        throw new Error(data.msg)
    }
    return data
}
