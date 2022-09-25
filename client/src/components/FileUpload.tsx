import React, { useState } from "react"

const FileUpload = () => {
    const [file, setFile] = useState<FileList | null>(null)

    const submitFile = async () => {
        try {
            if (!file) {
                throw new Error("Select a file first!")
            }
            const formData = new FormData()
            formData.append("file", file[0])
            const resp = await fetch("/api/test-upload", {
                method: "POST",
                headers: {
                    "Content-type": "multipart/formdata",
                },
                body: formData,
            })
            const data = await resp.json()
        } catch (error) {}
    }

    return (
        <form onSubmit={submitFile}>
            <label>Upload file</label>
            <input
                type="file"
                onChange={(event) => setFile(event.target.files)}
            />
            <button type="submit">Send</button>
        </form>
    )
}
export default FileUpload
