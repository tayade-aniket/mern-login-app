import toast from "react-hot-toast";

// Validate login page username
export async function usernameValidate(values){
    const errors = usernameVerify({}, values);

    return errors;
}

// Validate login page password
export async function passwordValidate(values){
    const errors = passwordVerify({}, values);

    return errors;
}

// validate reset password
export async function resetPasswordValidation(values){
    const errors = passwordVerify({}, values);

    if(values.password !== values.confirm_pwd){
        error.exist = toast.error("Password not match...!");

        return errors;
    }
}

// validate register form
export async function registerValidation(values){
    const errors = usernameVerify({}, values);
    passwordVerify(errors, values);
    emailVerify(errors, values);
}

// validate profile page
export async function profileValidation(value){
    const errors = emailVerify({}, values);
    return errors;
}

// validate password
function passwordVerify(errors ={}, values){
    const specialChars = /[`!@#$%^&()_+\-=\[\]{};':"\\|,.<>\/?~]/;

    if(!values.password){
        errors.password = toast.error("Password Required...!");
    }else if(values.password.includes(" ")){
        errors.password = toast.error("Password does not contains blank spaces...!");
    }else if(values.password.length < 4){
        errors.password = toast.error("Password must be more than 4 character long...!");
    }else if(!specialChars.test(values.password)){
        errors.password = toast.error("Password must have special character");
    }

    return errors;
}


// validate username
function usernameVerify(error = {}, values){
    if(!values.username){
        error.username = toast.error('Username Required...!');
    }else if(values.username.includes(" ")){
        error.username = toast.error('Blank Spaces are not allowed...!');
    }

    return error;
}

// Validate email
function emailVerify(errors = {}, values){
    if(!values.email){
        errors.email = toast.error("Email Required...!");
    }else if(values.email.includes(" ")){
        errors.email = toast.error("Blank spaces are not allowed...!");
    }else if(!/[a-zA-Z0-9.*%±]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}/i.test(values.email)){
        errors.email = toast.error("Invalid email address...!");
    }

    return errors;
}