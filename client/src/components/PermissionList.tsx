import React, { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { useCurrentForm } from "../context/CurrentFormContext"
import "../styles/PermissionList.css"

interface Admin {
    _id: string
    username: string
    email: string
}

interface props {
    close: any
}

const PermissionList: React.FC<props> = ({ close }) => {
    const form = useCurrentForm()
    const currentEmail = useAuth()?.currentUser?.email
    const [admins, setAdmins] = useState<Admin[]>([])
    const [searchString, setSearchString] = useState<string>("")

    useEffect(() => {
        fetch(`/api/getadmins`)
            .then((resp: any) => {
                return resp.json()
            })

            .then((data: any) => {
                console.log(data.data)
                setAdmins(data.data)
            })
    }, [])

    const updateEditors = (e: any, admin: any) => {
        if (e.target.checked && form?.currentForm?.editors !== undefined) {
            form?.setEditors([...form.currentForm.editors, admin._id])
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
            <div className="permission-content">
                <button onClick={close}>Close</button>
                <br></br>
                <span>Search:</span>
                <input
                    type="text"
                    onChange={(e) =>
                        setSearchString(
                            e.target.value.replace(/[^a-zA-Z ]/g, "")
                        )
                    }
                ></input>
                {console.log(form?.currentForm?.editors)}
                <ul className="permission-list">
                    {admins?.map((admin) =>
                        admin.email !== currentEmail &&
                        (admin.email.search(searchString) !== -1 ||
                            admin.username.search(searchString) !== -1) ? (
                            <li key={admin._id} className="radio-checkbox">
                                {form?.currentForm?.editors &&
                                form?.currentForm?.editors?.findIndex(
                                    (editor) => editor === admin._id
                                ) === -1 ? (
                                    <input
                                        id={admin._id}
                                        type="checkbox"
                                        onChange={(e) =>
                                            updateEditors(e, admin)
                                        }
                                    ></input>
                                ) : (
                                    <input
                                        id={admin._id}
                                        type="checkbox"
                                        defaultChecked
                                        onChange={(e) =>
                                            updateEditors(e, admin)
                                        }
                                    ></input>
                                )}
                                <span className="styled-radio-checkbox"></span>

                                <label htmlFor={admin._id}>
                                    {admin.username + " " + admin.email}
                                </label>
                            </li>
                        ) : null
                    )}
                </ul>
            </div>
        </div>
    )
}

export default PermissionList
