import { useContext } from "react";
import { userContext } from "../ContextAPI/userContext";

function Login() {
  const { loginUser, loginInfo, loginError, isLoginLoading, updateLoginInfo } =
    useContext(userContext);
 
  return (
    <div className="login-form-container">
     
      <form
        onSubmit={loginUser}
        className="flex flex-col w-1/2 gap-3 justify-center items-center"
      >
        <label className="mt-4">Email</label>
        <input
          placeholder="Enter your email"
          className="w-full h-6 pl-2 text-black"
          type="email"
          onChange={(e) =>
            updateLoginInfo({ ...loginInfo, email: e.target.value })
          }
        />
        <label>Password</label>
        <input
          className="w-full h-6 pl-2 text-black"
          type="password"
          onChange={(e) =>
            updateLoginInfo({ ...loginInfo, password: e.target.value })
          }
        />

        <button
          disabled={isLoginLoading}
          type="submit"
          className="login-btn mb-5 mt-4 bg-green-500 p-1 w-full"
        >
          {isLoginLoading ? (
            <img src="/Spinner@1x-1.0s-200px-200px.gif" alt="loading..." />
          ) : (
            "Login"
          )}
        </button>
      </form>
      {/*  displaying error logging in */}
      <div className="absolute bottom-0 ">
        {loginError?.message?.error && (
          <div className="-mt-10 mb-2 bg-red-500 p-2">
            <p role="alert">{loginError.message.error}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
