import React, {useEffect, useState} from "react";
import ResponseCard from "./ResponseCard";

const ResponseList: React.FC = () => {

  const [forms, setForms] = useState<any[]>([])

    useEffect(() => {
        fetch('http://localhost:7000/api/getforms', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        })
            .then((resp: any) => {
                return resp.json()
            })
            .catch((e) => console.log(e))

            .then((data: any) => {
                console.log({ data })
                if (data.success === true) {
                    setForms(data.forms)
                }
                else {
                    console.log('Where is the data?')
                }
            })
    }, [])

  return (
    <div className="form-list">
     Forms Responses:
     {!forms ? (
       "Loading..."
     ) : (
       <div>
          {forms.map((form) => (
          <ResponseCard form={form} key={form._id} />
          ))}
       </div>
      )}
    </div>
  );
};

export default ResponseList;