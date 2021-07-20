export const downloadResponse = async (formId: string) => {
    const res = await fetch(`/api/download/${formId}`, {
        headers: {
            "Content-type": "application/json",
        },
        method: "GET",
        credentials: "include",
    })
    const data = await res.json()
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
