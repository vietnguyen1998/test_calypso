import React, { useState } from 'react';

const useInput = (initVal) => {
    const [value, setValue] = useState(initVal);
    const bind = {
        value,
        onChange: e => setValue(e.target.value)
    }
    const reset = () => setValue(initVal);
    return [value, bind, reset, setValue];
}
 
export default useInput;