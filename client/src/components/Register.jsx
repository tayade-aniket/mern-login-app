import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useFormik } from 'formik'
import { registerValidation } from '../helper/validate'
import convertToBase64 from '../helper/convert';

import styles from '../styles/Username.module.css';

// images
import avatar from '../assets/user.png'

export default function Register() {
  const [file, setFile] = useState();

  const formik = useFormik({
    initialValues: {
      email: '',
      username: '',
      password: ''
    },
    validate: registerValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      values = await Object.assign(values, { profile: file || '' });
      console.log(values)
    }
  });

  // formik doesn't support file upload, so use this handler
  const onUpload = async e => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <Toaster position='top-center' reverseOrder={false} />
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-full max-w-md bg-white bg-opacity-20 rounded-2xl shadow-lg backdrop-blur-md">
          <div className="p-8">
            <div className="text-center">
              <h4 className='text-3xl sm:text-4xl md:text-5xl font-bold mb-2'>Register</h4>
              <span className="text-base sm:text-lg md:text-xl text-gray-500 block mx-auto max-w-xs">
                Happy to help you!
              </span>
            </div>

            <form className="mt-8" onSubmit={formik.handleSubmit}>
              <div className="flex justify-center mb-6">
                <label htmlFor="profile">
                <img src={file || avatar} className="w-24 h-24 sm:w-32 sm:h-32 rounded-full" alt="avatar" />
                </label>

                <input onChange={onUpload} type="file" id="profile" name='profile' />
              </div>

              <div className="space-y-4">
                <input 
                  {...formik.getFieldProps('email')} 
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  type="email" 
                  placeholder='Email' 
                />
                <input 
                  {...formik.getFieldProps('username')} 
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  type="text" 
                  placeholder='Username' 
                />
                <input 
                  {...formik.getFieldProps('password')} 
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  type="password" 
                  placeholder='Password' 
                />
                <button 
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-xl hover:bg-blue-600 transition duration-300" 
                  type="submit"
                >
                  Register
                </button>
              </div>

              <div className="text-center mt-6">
                <span className='text-gray-500 text-sm sm:text-base'>
                  Already Register? <Link className='text-red-500' to="/">Login Now</Link>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}