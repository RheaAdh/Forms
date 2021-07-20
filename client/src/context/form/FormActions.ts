const getQuestionsAndResponses = async (
    formId: string | undefined,
    admin: boolean,
    currentPageNo: number
) => {
    if (formId === undefined) return
    const res = await fetch(`/api/getquestionsbyformid/${formId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ admin, currentPageNo }),
        credentials: "include",
    })
    const data = await res.json()
    return {
        ...data.data,
        status: res.status,
    }
}

export const getByResponseId = async (responseId: string) => {
    const res = await fetch(`/api/resbyresponseid/${responseId}`, {
        method: "GET",
        headers: {
            "Content-type": "application/json",
        },
        credentials: "include",
    })
    const data = await res.json()
    return { status: res.status, ...data }
}
export const getByResponseIdPublic = async (responseId: string) => {
    const res = await fetch(`/api/response/${responseId}`, {
        method: "GET",
        headers: {
            "Content-type": "appication/json",
        },
    })

    const data = await res.json()
    return { status: res.status, ...data }
}
export const deleteFormAction = async (id: string) => {
    //!CHANGE ON BACK END
    const body = { _id: id }
    const resp = await fetch("/api/deleteform", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(body),
    })

    const data = await resp.json()

    if (!data.success || resp.status >= 400) {
        throw new Error(data.msg)
    }

    return data
}

export const getFormsAction = async () => {
    const resp = await fetch(`/api/getforms`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    })

    const data = await resp.json()
    // NEED TO THROW ERROR ON FAILURE
    return data
}

export const getTemplatesAction = async () => {
    const resp = await fetch(`/api/viewAllTemplates`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    })

    const data = await resp.json()

    return data
}

export const getForm = async (id: string, admin: boolean) => {
    let route = ``
    if (admin) {
        route = `/api/getform/${id}`
    } else {
        route = `/api/getformforresp/${id}`
    }

    const res = await fetch(route, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    })

    const data = await res.json()

    return {
        status: res.status,
        success: data.success,
        msg: data.msg,
        data: data.form,
    }
}

export const updateFormAction = async (updateData: any) => {
    const resp = await fetch("/api/updateform", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updateData),
    })
    const data = await resp.json()
    if (data.success === false || resp.status >= 400) {
        throw new Error(data.msg)
    }
    return data
}

export default getQuestionsAndResponses
