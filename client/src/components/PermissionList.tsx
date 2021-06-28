import React, { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { useCurrentForm } from "../context/CurrentFormContext"
import "../styles/PermissionList.css"

interface Admin {
    _id: string
    username: string
}

const PermissionList: React.FC = () => {
    const form = useCurrentForm()
    const currentUsername = useAuth()?.currentUser?.username
    const [admins, setAdmins] = useState<Admin[]>([])
    const [searchString, setSearchString] = useState<string>("")

    useEffect(() => {
        fetch(`http://localhost:7000/api/getadmins`)
            .then((resp: any) => {
                return resp.json()
            })

            .then((data: any) => {
                setAdmins(data.data)
            })
    }, [])

    const updateEditors = (e: any, admin: any) => {
        if (e.target.checked && form?.currentForm?.editors !== undefined) {
            form?.setEditors([...form.currentForm.editors, admin])
        } else if (form?.currentForm?.editors !== undefined) {
            form?.setEditors(
                form.currentForm.editors.filter(
                    (editor: string) => editor !== admin._id
                )
            )
        }
    }
    return (
        <div className="permission-component">
            <span>Search:</span>
            <input
                type="text"
                onChange={(e) => setSearchString(e.target.value)}
            ></input>
            <ul className="permission-list">
                {admins?.map((admin) =>
                    admin.username !== currentUsername &&
                    admin.username
                        .replace(/[^a-zA-Z ]/g, "")
                        .search(searchString) !== -1 ? (
                        <li key={admin._id}>
                            {admin.username}
                            {form?.currentForm?.editors &&
                            form?.currentForm?.editors?.findIndex(
                                (editor) => editor === admin._id
                            ) === -1 ? (
                                <input
                                    type="checkbox"
                                    onChange={(e) => updateEditors(e, admin)}
                                ></input>
                            ) : (
                                <input
                                    type="checkbox"
                                    defaultChecked
                                    onChange={(e) => updateEditors(e, admin)}
                                ></input>
                            )}
                        </li>
                    ) : null
                )}
            </ul>
        </div>
    )
}

export default PermissionList
