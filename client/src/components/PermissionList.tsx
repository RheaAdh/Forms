import React, { useState, useEffect } from "react"
import "../styles/PermissionList.css"

interface props {
    formid: string | undefined
    editors: string[]
    admins: any[]
}

const PermissionList: React.FC<props> = ({ formid, editors, admins }) => {
    const [permitted, setPermitted] = useState<any[]>(editors)

    return (
        <div className="permission-component">
            <span>Search:</span>
            <input type="text"></input>
            <ul className="permission-list">
                {admins.map((admin) => (
                    <li>
                        <input type="checkbox" onChange={(e)=>{
                            if(e.target.checked)
                            {
                                setPermitted((prev:any)=>[...prev,admin._id])
                            }
                            else
                            {
                                setPermitted((prev:any)=>prev.filter((id:any)=>id!=admin._id))
                            }
                            console.log("Permitted: ",permitted)
                        }}></input>
                        {admin.username}
                    </li>
                ))}
                </ul>
        </div>
    )
}

export default PermissionList
