import { useState } from "react";

const useFormState = (init: any) => {
  const [value, setValue] = useState(init);

  const handleChange = (e: any) => setValue(e.target.value);

  const handleReset = (e: any) => setValue("");

  return [value, handleChange, handleReset, setValue];
};

export default useFormState;
