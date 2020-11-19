import React, { useState, useEffect } from "react";

const Forms = () => {
  const [forms, setForms] = useState<any[]>([]);
  const [loading, setLoading] = useState<Boolean>(false);

  //!WHY IS THIS NOT WORKING??
  //   const fetchForms = async () => {
  //     setLoading(true);
  //     const resp = await fetch("http://localhost:7000/api/getforms");
  //     console.log(resp);
  //     const data: any = resp.json();
  //     setForms(data);
  //     setLoading(false);
  //   };

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:7000/api/getforms")
      .then((resp: any) => {
        return resp.json();
      })

      .then((data: any) => {
        setForms(data);
        setLoading(false);
      });
    // fetchForms();
  }, []);

  return (
    <div>
      Forms:
      {loading ? (
        "Loading..."
      ) : (
        <div>
          {forms.map((form) => (
            <div>
              {form.title}
              {form.color_theme}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Forms;
