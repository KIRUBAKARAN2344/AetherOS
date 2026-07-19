import { Link } from "react-router-dom";

function Register() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="bg-white w-[450px] rounded-2xl shadow-2xl p-8">

        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-700">
            AetherOS
          </h1>

          <p className="text-gray-500 mt-2">
            Create your account
          </p>
        </div>

        <form className="mt-8">

          <div className="mb-4">
            <label className="font-semibold">Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              className="w-full mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="font-semibold">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="font-semibold">Password</label>
            <input
              type="password"
              placeholder="Create password"
              className="w-full mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <label className="font-semibold">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm password"
              className="w-full mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            className="w-full bg-blue-700 text-white py-3 rounded-lg hover:bg-blue-800"
          >
            Register
          </button>

        </form>

        <div className="text-center mt-6">
          <p>
            Already have an account?
            <Link
              to="/"
              className="text-blue-700 font-semibold ml-2"
            >
              Login
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Register;