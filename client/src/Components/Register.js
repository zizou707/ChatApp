import { useContext,  useState } from "react";
import { userContext } from "../ContextAPI/userContext";
import axios from "axios";
import { Image } from "react-bootstrap";
import { useClickOutSide } from "../hooks/useClickOutSide";

function Register() {
  const {
    registerInfo,
    updateRegisterInfo,
    registerUser,
    registerError,
    isRegisterLoading,
  } = useContext(userContext);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [showImage, setShowImage] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);

  // handling click outside upload btn to close the upload menu
  const uploadBtn = useClickOutSide(() => {
    setOpenUpload(false);
  });

  const handleChange = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const newFile = e.currentTarget.files[0];
    setFile(newFile);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setLoading(true);

      const response = await axios.post(
        "https://localhost:4088/uploads",
        { file: file },
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setLoading(false);
      setFile(null);

      updateRegisterInfo({
        ...registerInfo,
        profileImage: response.data.filePath.split("public").pop(),
      });
      setShowImage(true);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <div className="register flex justify-center">
    <div className="register-form-container " >
      <form
        onSubmit={registerUser}
        className="form flex flex-col w-1/2 gap-3 justify-center items-center "
      >
        <label className="mt-2">Name</label>
        <input
          className="w-full h-6 pl-2 text-black"
          type="text"
          onChange={(e) =>
            updateRegisterInfo({ ...registerInfo, name: e.target.value })
          }
        />
        <label>Email</label>
        <input
          className="w-full h-6 pl-2 text-black"
          type="email"
          onChange={(e) =>
            updateRegisterInfo({ ...registerInfo, email: e.target.value })
          }
        />
        <label>Password</label>
        <input
          className="w-full h-6 pl-2 text-black"
          type="password"
          onChange={(e) =>
            updateRegisterInfo({ ...registerInfo, password: e.target.value })
          }
        />
        <div
          className="btn btn-primary cursor-pointer"
          onClick={() => setOpenUpload(!openUpload)}
        >
          Attach picture
        </div>
        <div
          ref={uploadBtn}
          className="-mt-3 flex flex-col"
          action="/upload"
          method="POST"
          encType="multipart/form-data"
        >
          {" "}
          {openUpload && (
            <div className="form-group flex flex-col">
              <input
                type="file"
                name="file"
                id="input"
                onChange={(e) => {
                  handleChange(e);
                }}
                className="form-control-file"
                multiple
              />
              <button
                disabled={loading}
                onClick={(e) => handleUpload(e)}
                className="btn btn-primary self-center  mt-2 p-1 w-1/2"
              >
                Upload Image
              </button>
            </div>
          )}
        </div>
        <div className="preview-image">
          {showImage && (
            <Image
              width={100}
              roundedCircle
              fluid
              alt="profile-img"
              src={`${registerInfo?.profileImage?.split("public").pop()}`}
            ></Image>
          )}
        </div>
        {loading ? (
          <img src="/Spinner@1x-1.0s-200px-200px.gif" alt="loading..." />
        ) : null}
        <button
          disabled={isRegisterLoading}
          type="submit"
          className="btn btn-primary justify-center mb-5 p-1 w-full"
        >
          {isRegisterLoading ? (
            <img
              className="w-24 h-24"
              src="/Spinner@1x-1.0s-200px-200px.gif"
              alt="loading..."
            />
          ) : (
            "Register"
          )}
        </button>
        {registerError && (
          <div className="-mt-10 mb-2 bg-red-500 p-2">
            <p role="alert"> {registerError?.message.error} </p>
          </div>
        )}
      </form>

      <hr />
    </div>
   </div> 
  );
}

export default Register;
