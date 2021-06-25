import React, { useState, useEffect } from "react"
import "../styles/PermissionList.css"

interface props {
    formid: string | undefined
}

const PermissionList: React.FC<props> = ({ formid }) => {
    const [admins, setAdmins] = useState([
        "testadmin1",
        "testadmin2",
        "testadmin3",
    ])
    return (
        <div className="permission-component">
            <span>Search:</span>
            <input type="text"></input>
            <ul className="permission-list">
                {admins.map((name) => (
                    <li>
                        <input type="checkbox"></input>
                        {name}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default PermissionList
