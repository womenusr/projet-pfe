import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import { useDispatch, useSelector } from "react-redux";
import {
  registerUser,
  resetAuthMessages,
} from "../../../redux/slices/authSlice.js";
import { toast } from "react-toastify";
export default function SignUpForm() {
  let dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
  });

  function handleRegisterUser(e: any) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("password", data.password);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    dispatch(registerUser(formData));
  }

  //il permet de executer un fon,ction apres affichage de page
  // il permet dexuter ue fonction itha variable tetbadel

  const { user, account_created } = useSelector((state) => state.auth);

  useEffect(() => {
    if (account_created) {
      toast.success("compte creer avec succes ! ");
      dispatch(resetAuthMessages());
    }
    if (user?.error) {
      toast.error(user?.error);
      dispatch(resetAuthMessages());
    }
  }, [user?.error, user?.msg, account_created, dispatch]);

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign Up
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign up!
            </p>
          </div>
          <div>
            <form onSubmit={handleRegisterUser}>
              <div className="space-y-5">
                <div>
                  {/* <!-- First Name --> */}
                  <div className="sm:col-span-1">
                    <Label>
                      Nom Utilisateur <span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="fname"
                      name="username"
                      onChange={(e) =>
                        setData({ ...data, username: e.target.value })
                      }
                      placeholder="Entrer votre nom "
                    />
                  </div>
                  {/* <!-- Last Name --> */}
                </div>
                {/* <!-- Email --> */}
                <div>
                  <Label>
                    Email<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    onChange={(e) =>
                      setData({ ...data, email: e.target.value })
                    }
                    placeholder="Entrer votre email "
                  />
                </div>
                {/* <!-- Password --> */}
                <div>
                  <Label>
                    Password<span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      onChange={(e) =>
                        setData({ ...data, password: e.target.value })
                      }
                      placeholder="Entrer votre mot de passe "
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                </div>
                <div className="relative">
                  Image de profile
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                vous avez deja un compte ? {""}
                <Link
                  to="/login"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  connectez-vous
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
