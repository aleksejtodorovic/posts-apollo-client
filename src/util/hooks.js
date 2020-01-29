import { useState } from 'react';

export const useForm = (callback, initialState = {}) => {
    const [values, setValues] = useState(initialState);

    const onChange = ({ target: { name, value } }) => {
        setValues({
            ...values,
            [name]: value
        })
    };

    const onSubmit = evt => {
        evt.preventDefault();

        callback();
    };

    return {
        onChange,
        onSubmit,
        values
    };
}