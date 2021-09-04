import { put } from "./requests"

const autoAdjustHeight = (e: any) => {
    e.target.style.height = ""
    e.target.style.height = e.target.scrollHeight + "px"
}

export const validateLinkId = async (
    id: string,
    linkId: string | undefined,
    setLinkIdError: any
) => {
    let modifiedId = ""
    if (linkId !== undefined) {
        modifiedId = linkId?.replace(/ /g, "-")
    }
    if (modifiedId.length < 5 || modifiedId.length > 25) {
        setLinkIdError("Link ID must contain 5 to 25 characters")
        return ""
    }
    const data = await (
        await put("/api/updateLinkId", { _id: id, linkId: modifiedId })
    ).json()
    if (!data.success) {
        setLinkIdError(data.msg)
        return ""
    }
    setLinkIdError("")
    return modifiedId
}

export default autoAdjustHeight
