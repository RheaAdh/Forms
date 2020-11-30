import { useState } from "react";

const useFormState = (init: any) => {
  const [value, setVaue] = useState(init);

  const handleChange = (e: any) => setVaue(e.target.value);

  const handleReset = (e: any) => setVaue("");

  return [value, handleChange, handleReset];
};

export default useFormState;
