import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import QuestionResponse from "../../components/shared/QuestionResponse"
import { useAuth } from "../../context/auth/AuthContext"
import { IForm, useCurrentForm } from "../../context/form/CurrentFormContext"
import {
    getQuestionsAndResponses,
    getByResponseId,
    getForm,
} from "../../context/form/FormActions"
import {
    useResponses,
    IUser,
    IResponseList,
} from "../../context/responses/ResponseListContext"
import {
    IQuestion,
    useQuestionsList,
} from "../../context/questions/QuestionListContext"
import "../../styles/DisplayForm.css"
import AdminNavbar from "../../components/admin/AdminNavbar"
import { ReactComponent as DropdownArrow } from "../../images/DropdownArrow.svg"
import Loading from "../../components/shared/Loading"
import SwitchButton from "../../components/shared/SwitchButton"
import useDocumentTitle from "../../hooks/useDocumentTitle"

interface ResponsesComponentProps {
    currentUser: IUser | null
    setCurrentUser: (newUser: IUser) => void
    responseList: IResponseList
}
// Users list component (for non anonymous responses)
const UserResponsesDropdown = ({
    currentUser,
    setCurrentUser,
    responseList,
}: ResponsesComponentProps) => {
    return (
        <div className="select">
            <select
                value={`${currentUser?.email}`}
                onChange={(e) => {
                    const newUser = responseList?.users?.find(
                        (user) => user.email === e.target?.value
                    )
                    if (newUser !== undefined) setCurrentUser(newUser)
                }}
            >
                {responseList?.users?.map((usr: IUser, i: number) => {
                    return (
                        <option key={i} value={usr.email}>
                            {`${usr.username} ${usr.email}`}
                        </option>
                    )
                })}
            </select>
            <span className="select-arrow">
                {" "}
                <DropdownArrow />{" "}
            </span>
        </div>
    )
}
// Responses list component for anonymous responses
const AnonymousResponses = ({
    currentUser,
    setCurrentUser,
    responseList,
}: ResponsesComponentProps) => {
    return (
        <div className="anonymous-responses-box">
            <button
                onClick={() =>
                    currentUser &&
                    setCurrentUser(
                        responseList.responseActions.findPreviousUser(
                            currentUser
                        )
                    )
                }
            >
                {`<--`}
            </button>
            {`Response ${
                (responseList?.users?.findIndex(
                    (usr) => usr.responseid === currentUser?.responseid
                )
                    ? responseList?.users?.findIndex(
                          (usr) => usr.responseid === currentUser?.responseid
                      )
                    : 0) + 1
            } of ${responseList?.users?.length}`}
            <button
                onClick={() =>
                    currentUser &&
                    setCurrentUser(
                        responseList.responseActions.findNextUser(currentUser)
                    )
                }
            >
                {`-->`}
            </button>
        </div>
    )
}

interface ResponseDetailsProps {
    form: IForm | null
    responseList: IResponseList | null
}

const ResponseDetails = ({ form, responseList }: ResponseDetailsProps) => {
    return (
        <div className="edit-form-component">
            {!form?.currentForm?.isTemplate && (
                <div className="row1">
                    <SwitchButton
                        isActive={form?.currentForm?.isActive}
                        setIsActive={() => {
                            form?.setActive(true)
                            form?.setDate(null)
                        }}
                        setNotActive={() => {
                            form?.setActive(false)
                            form?.setDate(new Date())
                        }}
                        activeColor={"green"}
                        inactiveColor={"red"}
                        activeText={"Active"}
                        inactiveText={"Closed"}
                    />
                </div>
            )}
            <div className="row2">
                <h2>{`${responseList?.users?.length} responses`}</h2>
            </div>
            <div className="row3">
                <p>{form?.currentForm?.description}</p>
            </div>
        </div>
    )
}
// Main Component
export default () => {
    const auth = useAuth()
    const form = useCurrentForm()
    const responseList = useResponses()
    const questions = useQuestionsList()

    const [currentUser, setCurrentUser] = useState<IUser | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [responseLoading, setResponseLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const { formId }: any = useParams()

    useEffect(() => {
        //Get current logged in user
        if (auth?.currentUser === null) auth?.getCurrentUser()
    }, [])

    useEffect(() => {
        if (formId && auth?.currentUser && auth?.currentUser?.userid !== "x") {
            getForm(formId, true)
                .then((data) => {
                    if (data.success) {
                        form?.setFormDetails(formId, data.data)
                    }
                })
                .catch((err) => console.log(err))
            // fetch all pages in case of admin access, so current page is -1
            getQuestionsAndResponses(formId, true).then((data) => {
                if (data.status >= 400) {
                    return
                }
                questions?.questionActions?.getQuestions(formId, data.ques)
                if (data.prevResponse === null) {
                    data.prevResponse = {
                        responses: [],
                        questions: data.ques,
                        userid: auth?.currentUser?.userid,
                        username: auth?.currentUser?.username,
                    }
                }
                // No need to fetch responses in case of admin level access, just setting formId is enough
                responseList?.responseActions?.setFormId(formId)
            })
        }
    }, [formId, auth?.currentUser])

    useEffect(() => {
        // Get list of all users and corresponding response IDs who filled current form
        // This is for /responses/:formId page
        if (responseList?.formId?.length) {
            responseList?.responseActions?.getUsers().then((data) => {
                setCurrentUser(data[0])
                setLoading(false)
            })
        }
    }, [responseList?.formId])

    useEffect(() => {
        if (currentUser) {
            // Get response for current user, when current user changes
            setResponseLoading(true)
            getByResponseId(currentUser.responseid).then((data) => {
                if (data.status === 404 || data.status === 403) {
                    return setError(data.msg)
                }
                if (!data.success) {
                    console.log(data)
                    return
                }
                if (questions)
                    responseList?.responseActions?.getResponse(
                        formId,
                        data.data,
                        questions.questions.map((q) => q.required),
                        true
                    )
                setResponseLoading(false)
            })
        }
    }, [currentUser])

    useDocumentTitle(form?.currentForm?.title || "Forms By IECSE")

    if (loading) {
        return <Loading />
    }

    if (error) {
        return <div>{error}</div>
    }

    return (
        <div className="display-form-page">
            <AdminNavbar questionsPage={false} />
            <div className="display-form-container">
                <div>
                    {!form?.currentForm?.anonymous &&
                    responseList?.users?.length ? (
                        <UserResponsesDropdown
                            currentUser={currentUser}
                            setCurrentUser={(newUser: IUser) =>
                                setCurrentUser(newUser)
                            }
                            responseList={responseList}
                        />
                    ) : form?.currentForm?.anonymous &&
                      responseList?.users?.length &&
                      currentUser !== null ? (
                        <AnonymousResponses
                            currentUser={currentUser}
                            setCurrentUser={() => setCurrentUser}
                            responseList={responseList}
                        />
                    ) : null}
                </div>
                <ResponseDetails form={form} responseList={responseList} />
                {!responseLoading &&
                    responseList?.users?.length !== 0 &&
                    questions?.questions?.map((q: IQuestion, idx: number) => {
                        return (
                            <QuestionResponse
                                question={q}
                                prevResponse={responseList?.responses?.[idx]}
                                key={q.qid}
                            />
                        )
                    })}
            </div>
        </div>
    )
}
