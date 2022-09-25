import React, { useEffect, useState } from "react"
import { useHistory, useParams } from "react-router"
import { useAuth } from "../../context/auth/AuthContext"
import { useCurrentForm } from "../../context/form/CurrentFormContext"
import "../../styles/AdminNavbar.css"
import { Link } from "react-router-dom"
import { ReactComponent as PreviewIcon } from "../../images/PreviewForm.svg"
import { ReactComponent as ProfileIcon } from "../../images/ProfileIcon.svg"
import { ReactComponent as CopyIcon } from "../../images/CopyIcon.svg"
import { CopyToClipboard } from "react-copy-to-clipboard"
import { ReactComponent as HomeIcon } from "../../images/HomeIcon.svg"
import { ReactComponent as DownloadIcon } from "../../images/DownloadIcon.svg"
import { downloadResponse } from "../../context/responses/ResponseActions"
import CsvDownload from "react-csv-downloader"
import { get } from "../../utils/requests"

interface props {
    questionsPage: boolean
}

const AdminNavbar = ({ questionsPage }: props) => {
    const auth = useAuth()
    const form = useCurrentForm()
    const history = useHistory()
    const { formId }: any = useParams()

    const [dataForDownload, setDataForDownload] = useState<any[]>()
    const [columnsForDownload, setColumnsForDownload] = useState<any[]>()

    useEffect(() => {
        //Get current logged in user
        if (auth?.currentUser === null) auth?.getCurrentUser()
        // Admin level access, fetch all responses for csv data
        if (formId !== undefined && !questionsPage) {
            downloadResponse(form?.currentForm?.id || "").then((data) => {
                if (data) {
                    setColumnsForDownload(data.columns)
                    setDataForDownload(data.dataForDownload)
                }
            })
        }
    }, [formId])

    return (
        <div className="navbar">
            <div className="navbar-row1">
                <button className="navbar-icon-btn">
                    <ProfileIcon />
                    <div className="icon-info profile-icon">
                        <p>{auth?.currentUser?.username}</p>
                        <p>{auth?.currentUser?.email}</p>
                        <p>{auth?.currentUser?.role}</p>
                        <p
                            className="logout-btn"
                            onClick={() => {
                                auth?.logout().then((data) =>
                                    history.push("/adminlogin")
                                )
                            }}
                        >
                            Logout
                        </p>
                    </div>
                    <span className="text-info-arrow" />
                </button>
                {questionsPage ? (
                    <button
                        className="navbar-icon-btn"
                        onClick={() => history.push(`/form/${formId}`)}
                    >
                        <PreviewIcon style={{ width: "2rem" }} />
                        <span className="icon-info">Preview Form</span>
                        <span className="text-info-arrow" />
                    </button>
                ) : null}

                {questionsPage === true && (
                    <CopyToClipboard
                        text={`http://localhost:3000/form/${
                            form?.currentForm?.linkId !== undefined
                                ? form?.currentForm?.linkId
                                : form?.currentForm?.id
                        }`}
                    >
                        <button className="navbar-icon-btn">
                            <CopyIcon style={{ width: "1.2rem" }} />
                            <span className="icon-info">Copy Link to Form</span>
                            <span className="text-info-arrow" />
                        </button>
                    </CopyToClipboard>
                )}
                {questionsPage === false &&
                    form?.currentForm?.sheetId === null && (
                        <button
                            className="navbar-icon-btn"
                            onClick={async () => {
                                const data = await (
                                    await get(
                                        `/api/createnewsheet/${form?.currentForm?.id}`
                                    )
                                ).json()
                                if (data.success) {
                                    form?.setSheetId(data.data)
                                }
                            }}
                        >
                            <CopyIcon style={{ width: "1.2rem" }} />
                            <span className="icon-info">Create Sheet</span>
                            <span className="text-info-arrow" />
                        </button>
                    )}
                {questionsPage === false &&
                    form?.currentForm?.sheetId !== null && (
                        <a
                            className="navbar-icon-btn"
                            href={`https://docs.google.com/spreadsheets/d/${form?.currentForm?.sheetId}/edit#gid=0`}
                            target="_blank"
                        >
                            <>
                                <CopyIcon style={{ width: "1.2rem" }} />
                                <span className="icon-info">Go To Sheet</span>
                                <span className="text-info-arrow" />
                            </>
                        </a>
                    )}
                <button
                    className="navbar-icon-btn"
                    onClick={() => history.push("/")}
                >
                    <HomeIcon />
                    <span className="icon-info">Dashboard</span>
                    <span className="text-info-arrow" />
                </button>
                {!questionsPage && (
                    <CsvDownload
                        className="navbar-icon-btn"
                        datas={dataForDownload ? dataForDownload : []}
                        filename={
                            form?.currentForm?.title
                                ? form?.currentForm?.title
                                : ""
                        }
                        extension={".csv"}
                        columns={columnsForDownload}
                    >
                        <DownloadIcon style={{ width: "1.5rem" }} />
                        <span className="icon-info">Download Responses</span>
                        <span className="text-info-arrow" />
                    </CsvDownload>
                )}
                <input
                    type="text"
                    onChange={(e) => {
                        form?.setTitle(e.target.value)
                    }}
                    value={form?.currentForm?.title}
                />
            </div>
            <div className="navbar-row2">
                <Link
                    to={`/form-admin/${formId}`}
                    style={{
                        textDecoration: "none",
                        borderColor: questionsPage
                            ? "var(--fontColor)"
                            : "var(--secondaryBackground)",
                        backgroundColor: questionsPage
                            ? "var(--secondaryBackground)"
                            : "inherit",
                    }}
                    className="navbar-row2-btn"
                >
                    Questions
                </Link>
                <Link
                    to={`/responses/${formId}`}
                    style={{
                        textDecoration: "none",
                        borderColor: !questionsPage
                            ? "var(--fontColor)"
                            : "var(--secondaryBackground)",
                        backgroundColor: !questionsPage
                            ? "var(--secondaryBackground)"
                            : "inherit",
                    }}
                    className="navbar-row2-btn"
                >
                    Responses
                </Link>
            </div>
        </div>
    )
}

export default AdminNavbar
