import React from "react";
const { signUpWithGoogle, signInWithGoogle, signOut } = require("./Firebase");

function Navbar() {
  return (
    <>
      <div className="">
        <nav className="bg-gray-800 fixed top-0 z-10 w-full">
          <div className="max-w-7xl h-14 mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-full items-center justify-between w-full">
              <div className="flex items-center">
                <img
                  className="h-8 w-8"
                  src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg"
                  alt="Workflow"
                />

                <div className="ml-10 flex items-center space-x-4">
                  <span className="hover:bg-gray-700 text-white px-3 py-2 rounded-md text-sm font-medium">
                    Dashboard
                  </span>

                  <span className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                    Report
                  </span>

                  <span className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                    Projects
                  </span>
                </div>
              </div>

              <div className="flex items-center">
                <span
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium mx-3"
                  onClick={signUpWithGoogle}
                >
                  Register
                </span>

                <span
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium mx-3"
                  onClick={signInWithGoogle}
                >
                  Login
                </span>

                <span
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium mx-3"
                  onClick={signOut}
                >
                  Logout
                </span>
                <span className="text-gray-300 hover:bg-gray-700 hover:text-white px-1 py-2 rounded-md text-sm font-medium mx-3">
                  <img
                    className="rounded-full h-10 w-10"
                    src={localStorage.getItem("profilePic")}
                    alt=""
                  />
                </span>
                <span className="text-gray-300 hover:bg-gray-700 hover:text-white  py-2 rounded-md text-sm font-medium mx-3">
                  <h1>{localStorage.getItem("name")}</h1>
                </span>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}

export default Navbar;
