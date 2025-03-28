import React, { useState } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const InputForm = (props) => {
    const [focused, setFocused] = useState(false);
    const handleFocus = (e) => {
        setFocused(true)
    }

    const [passwordVisible, setPasswordVisible] = useState(false);
    function togglePasswordVisibility() {
        setPasswordVisible(!passwordVisible);
    };
    
    const {label, onChange, id, errorMsg, ...inputProps} = props;

    return (
        <div className='input-block'>
            <label>{label}</label>
            <div className="password-visible">
                <input 
                    {...inputProps} 
                    onChange={onChange} 
                    onBlur={handleFocus} 
                    focused={focused.toString()} 
                    type={inputProps.name === 'password' && passwordVisible ? 'text' : inputProps.type}
                />
                {inputProps.name === 'password' && (
					<FontAwesomeIcon icon={!passwordVisible ? faEye : faEyeSlash} onClick={togglePasswordVisibility} className='icon'/>
                )}
                <span>{errorMsg}</span>
            </div>
        </div>
    )
}

export default InputForm