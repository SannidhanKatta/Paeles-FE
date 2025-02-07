import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  RiFacebookBoxFill,
  RiGoogleFill,
} from "react-icons/ri";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import OtpInput from "react-otp-input";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPswd, setConfirmPswd] = useState("");
  const [isPswd1Visible, setIsPswd1Visible] = useState(false);
  const [isPswd2Visible, setIsPswd2Visible] = useState(false);
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const registerUser = async () => {
    const name = firstName + " " + lastName;
    const userData = { name, email, password, otp };
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/auth/local/register`,
        userData
      );
      if (response.data.user) {
        toast.success(response.data.message);
        navigate("/login");
      }
    } catch (error) {
      console.error("Error registering user:", error);
      toast.error(error.response?.data?.message || "Error registering user");
    }
  };

  const registerWithGoogle = () => {
    window.open(
      `${import.meta.env.VITE_SERVER_URL}/auth/google/callback`,
      "_self"
    );
  };

  const registerWithFacebook = () => {
    window.open(`${import.meta.env.VITE_SERVER_URL}/auth/facebook`, "_self");
  };

  const handleSendOtp = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/auth/sendOtp`,
        { email }
      );
      toast.success(response.data?.message); // Show response message
      setIsOtpSent(true);
      setTimer(120); // Start 120-sec countdown

    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    }
  };
  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(countdown);
    } else {
      setIsOtpSent(false); // Show verify button again after 120 seconds
    }
  }, [timer]);


  // Function to verify OTP
  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/order/verifyOtp`,
        { email, otp }
      );
      alert(response.data); // Show verification message
      setIsVerified(true);
    } catch (error) {
      alert(error.response?.data || "OTP verification failed");
    }
  };


  return (
    <div className=" w-full h-full flex items-center justify-center ">
      <div>
        <div className=" flex flex-col">
          <h4 className=" text-[16px] md:text-[18px] 2xl:text-[20px] font-[700] plus-jakarta text-[#363F4D] dark:text-gray-400 underline underline-offset-3 mt-5 ">
            Register
          </h4>
          <div className=" flex flex-col sm:grid grid-cols-2 sm:gap-10 md:mt-2 ">
            <div className=" flex-col flex">
              <label
                className=" text-[#7A7A7A]  dark:text-gray-400 font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] mb-1 "
                htmlFor="first-name"
              >
                First Name*
              </label>
              <input
                autoComplete="off"
                name="first-name"
                id="first-name"
                type="text"
                className=" w-full md:w-[240px] 2xl:w-[300px] border-[1.4px] border-[#999999] bg-transparent p-2 text-[#7A7A7A]  dark:text-gray-400 text-[14.4px]"
                placeholder="First Name"
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className=" flex-col flex">
              <label
                className=" text-[#7A7A7A]  dark:text-gray-400 font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] mb-1 "
                htmlFor="last-name"
              >
                Last Name*
              </label>
              <input
                autoComplete="off"
                name="last-name"
                id="last-name"
                type="text"
                className=" w-full md:w-[240px] 2xl:w-[300px] border-[1.4px] border-[#999999] bg-transparent p-2 text-[#7A7A7A]  dark:text-gray-400 text-[14.4px]"
                placeholder="Last Name"
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div className="  md:mt-2 ">
            <div className=" w-full col-span-2">
              <label
                className=" text-[#7A7A7A]  dark:text-gray-400 font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] mb-1 "
                htmlFor="email"
              >
                Email Address*
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
                <input
                  autoComplete="off"
                  name="email"
                  id="email"
                  type="email"
                  className="w-2/3 border border-gray-400 p-2 rounded-md text-gray-700 dark:text-gray-300 bg-transparent text-sm"
                  placeholder="Your Email"
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isOtpSent}
                />
                {isOtpSent ? (
                  <span className="text-red-500 font-semibold text-sm">{timer}s</span>
                ) : (
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600 transition duration-300 disabled:bg-gray-400"
                    onClick={handleSendOtp}
                    disabled={!email}
                  >
                    Send OTP
                  </button>
                )}
              </div>
            </div>
          </div>
          {isOtpSent && !isVerified && (
            <div className="mt-2">
              <label
                className="text-[#7A7A7A] dark:text-gray-400 font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] mb-1"
                htmlFor="otp"
              >
                Enter OTP*
              </label>
              <OtpInput
                value={otp}
                onChange={setOtp}
                numInputs={6}
                containerStyle={{
                  color: "black",
                  display: "flex",
                  justifyContent: "space-evenly",
                }}
                inputStyle={{
                  width: "45px",
                  height: "45px",
                  border: "1px solid #000",
                }}
                shouldAutoFocus={true}
                renderSeparator={<span className="  "> </span>}
                renderInput={(props) => <input {...props} />}
              />
            </div>
          )}


          <div className=" flex flex-col sm:grid grid-cols-2 sm:gap-10 md:mt-2 ">
            <div className=" flex-col flex">
              <label
                className=" text-[#7A7A7A]  dark:text-gray-400 font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] mb-1 "
                htmlFor="password"
              >
                Password*
              </label>
              <div className=" relative flex items-center justify-center">
                <input
                  autoComplete="off"
                  name="password"
                  id="password"
                  type={isPswd1Visible ? "text" : "password"}
                  className=" w-full md:w-[240px] 2xl:w-[300px] border-[1.4px] border-[#999999] bg-transparent p-2 text-[#7A7A7A]  dark:text-gray-400 text-[14.4px]"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                {!isPswd1Visible ? (
                  <FaEye
                    onClick={() => {
                      setIsPswd1Visible(true);
                    }}
                    className=" absolute right-2 text-[21px] cursor-pointer text-[#999999] "
                  />
                ) : (
                  <FaEyeSlash
                    onClick={() => {
                      setIsPswd1Visible(false);
                    }}
                    className=" absolute right-2 text-[21px] cursor-pointer text-[#999999] "
                  />
                )}
              </div>
            </div>
            <div className=" flex-col flex">
              <label
                className=" text-[#7A7A7A]  dark:text-gray-400 font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] mb-1 "
                htmlFor="confirm-Password"
              >
                Confirm Password*
              </label>
              <div className=" relative flex items-center justify-center">
                <input
                  autoComplete="off"
                  name="confirm-Password"
                  id="confirm-Password"
                  type={isPswd2Visible ? "text" : "password"}
                  value={confirmPswd}
                  onChange={(e) => setConfirmPswd(e.target.value)}
                  className=" w-full md:w-[240px] 2xl:w-[300px] border-[1.4px] border-[#999999] bg-transparent p-2 text-[#7A7A7A]  dark:text-gray-400 text-[14.4px]"
                  placeholder="Confirm Password"
                />{" "}
                {!isPswd2Visible ? (
                  <FaEye
                    onClick={() => {
                      setIsPswd2Visible(true);
                    }}
                    className=" absolute right-2 text-[21px] cursor-pointer text-[#999999] "
                  />
                ) : (
                  <FaEyeSlash
                    onClick={() => {
                      setIsPswd2Visible(false);
                    }}
                    className=" absolute right-2 text-[21px] cursor-pointer text-[#999999] "
                  />
                )}
              </div>
            </div>
          </div>

          <button
            disabled={
              email === "" ||
              password === "" ||
              firstName === "" ||
              lastName === "" ||
              confirmPswd !== password
            }
            className=" bg-[#363F4D] disabled:bg-gray-400 disabled:text-gray-600 px-4 py-2.5 font-medium uppercase text-[11.2px] md:text-[13px] text-white mt-5 "
            onClick={registerUser}
          >
            Register
          </button>
          <p className="font-[400] mt-1.5 mb-3 text-right w-full text-[12px] md:text-[14px]">
            Already have an account ?
            <Link to="/login" className=" font-semibold underline">
              Login
            </Link>
          </p>
          <div className=" flex items-center gap-1 my-3">
            <span className=" h-[1px] flex-grow bg-black"></span>
            <span className=" font-[600] plus-jakarta w-max text-[12px] md:text-[14px] ">
              or use one of these options
            </span>
            <span className=" h-[1px] flex-grow bg-black"></span>
          </div>
          <div className=" flex items-center justify-center gap-5 mb-5 ">
            <button
              className="flex items-center justify-center bg-white hover:bg-blue-50 text-gray-700 px-6 py-2.5 rounded-lg w-full max-w-[300px] border-2 border-blue-100 transition-all duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-md hover:border-blue-200 group"
              onClick={registerWithGoogle}
            >
              {/* <RiGoogleFill className="mr-2 text-[#4285f4] group-hover:scale-110 transition-transform duration-300" /> */}
              <span className="font-medium tracking-wide text-[15px] group-hover:text-blue-600 transition-colors duration-300">
                Sign up with Google
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
