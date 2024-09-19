import { useState } from "react";
import { Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { profileValidation } from "../helper/validate";
import convertToBase64 from "../helper/convert";

import avatar from "../assets/user.png";


export default function Profile() {
  const [file, setFile] = useState()

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      mobile: "",
      email: "",
      address: "",
    },
    validate: profileValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      values = await Object.assign(values, { profile: file || "" })
      console.log(values)
    },
  })

  const onUpload = async (e) => {
    const base64 = await convertToBase64(e.target.files[0])
    setFile(base64)
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-full max-w-md bg-white bg-opacity-20 rounded-2xl shadow-lg backdrop-blur-md h-5/6 w-5/6">
          <div className="p-6 sm:p-8">
            <div className="text-center">
              <h4 className="text-3xl sm:text-4xl font-bold mb-2">Profile</h4>
              <span className="text-sm sm:text-base text-gray-500 block mx-auto max-w-xs">
                You can update the details.
              </span>
            </div>

            <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
              <div className="flex justify-center">
                <label htmlFor="profile" className="cursor-pointer">
                  <img
                    src={file || avatar}
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover md:w-40 md:h-40"
                    alt="avatar"
                  />
                </label>
                <input
                  onChange={onUpload}
                  type="file"
                  id="profile"
                  name="profile"
                  className="hidden"
                />
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    {...formik.getFieldProps("firstName")}
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="text"
                    placeholder="First Name"
                  />
                  <input
                    {...formik.getFieldProps("lastName")}
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="text"
                    placeholder="Last Name"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    {...formik.getFieldProps("mobile")}
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="text"
                    placeholder="Mobile"
                  />
                  <input
                    {...formik.getFieldProps("email")}
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="email"
                    placeholder="Email"
                  />
                </div>

                <input
                  {...formik.getFieldProps("username")}
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="text"
                  placeholder="Username"
                />

                <input
                  {...formik.getFieldProps("address")}
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="text"
                  placeholder="Address"
                />

                <button
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-xl hover:bg-blue-600 transition duration-300"
                  type="submit"
                >
                  Update
                </button>
              </div>

              <div className="text-center mt-6">
                <span className="text-gray-500 text-sm sm:text-base">
                  Come back later?{" "}
                  <Link className="text-red-500" to="/">
                    Logout
                  </Link>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}