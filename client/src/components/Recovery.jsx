import React from 'react'
import { Link } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useFormik } from 'formik'
import { passwordValidate } from '../helper/validate'

// images
import avatar from '../assets/user.png'

export default function Recovery() {
  const formik = useFormik({
    initialValues: {
      password: ''
    },
    validate: passwordValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      console.log(values)
    }
  })

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <Toaster position='top-center' reverseOrder={false} />
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-full max-w-md bg-white bg-opacity-20 rounded-2xl shadow-lg backdrop-blur-md">
          <div className="p-8">
            <div className="text-center">
              <h4 className='text-3xl sm:text-4xl md:text-5xl font-bold mb-2'>Recovery</h4>
              <span className="text-base sm:text-lg md:text-xl text-gray-500 block mx-auto max-w-xs">
                Enter OTP to recover password.
              </span>
            </div>

            <form className="py-20">
              <div className="space-y-4">
              <span className="py-4 text-sm text-left text-gray-500">
                Enter 6 digit OTP send to your email address.
              </span>
                <input 
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  type="password" 
                  placeholder='OTP' 
                />
                <button 
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-xl hover:bg-blue-600 transition duration-300" 
                  type="submit"
                >
                  Recover
                </button>
              </div>

              <div className="text-center mt-6">
                <span className='text-gray-500 text-sm sm:text-base'>
                  Can't get OTP? <button className='text-red-500'>Resend</button>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}