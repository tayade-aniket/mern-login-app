import React from 'react'
import { Link } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useFormik } from 'formik'
import { usernameValidate } from '../helper/validate'

// images
import avatar from '../assets/user.png'

export default function Username() {
  const formik = useFormik({
    initialValues: {
      username: ''
    },
    validate: usernameValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      console.log(values)
    }
  })

  return (
    <div className="container mx-auto px-4">
      <Toaster position='top-center' reverseOrder={false} />
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-full max-w-md bg-white bg-opacity-55 rounded-3xl shadow-lg border-4 border-gray-50 p-6 sm:p-10">
          <div className="text-center">
            <h4 className='text-3xl sm:text-4xl md:text-5xl font-bold mb-2'>Hello Again!</h4>
            <span className="block text-base sm:text-lg md:text-xl text-gray-500 mb-8">
              Explore More by connecting with us.
            </span>
          </div>

          <form className="space-y-6" onSubmit={formik.handleSubmit}>
            <div className="flex justify-center">
              <img src={avatar} className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-gray-100 shadow-lg hover:border-gray-200 cursor-pointer" alt="avatar" />
            </div>

            <div className="space-y-4">
              <input 
                {...formik.getFieldProps('username')} 
                className="w-full px-5 py-3 rounded-xl shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                type="text" 
                placeholder='Username' 
              />
              <button 
                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-lg text-xl shadow-sm transition duration-300 ease-in-out"
                type="submit"
              >
                Let's Go
              </button>
            </div>

            <div className="text-center">
              <span className='text-gray-500'>Not a member <Link className='text-red-500 hover:text-red-600' to="/register">Register Now</Link></span>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}