import React, { useState } from "react";
import { Button, Typography } from "@mui/material";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { AnimatePresence, motion } from "framer-motion";
import { useMediaQuery } from "react-responsive";

const Auth = () => {
  const [login, setLogin] = useState(true);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  return (
    <motion.main
      className={`flex items-end md:items-center w-screen ${
        login ? "md:justify-start" : "md:justify-end"
      } bg-white h-screen relative overflow-hidden`}
    >
      <div className="w-full md:w-1/2 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {login ? <Login /> : <Signup />}
        </AnimatePresence>
      </div>

      <motion.div
        key={isMobile ? "mobile" : "desktop"}
        className={`overflow-hidden bg-primary flex items-center justify-center absolute z-50 ${
          isMobile ? "w-full top-0 left-0" : "h-full w-1/2 top-0 right-0"
        }`}
        initial={{
          width: isMobile ? "100%" : ["0%", "50%"],
          height: !isMobile ? "100%" : ["0%", "50%"],
        }}
        animate={[
          {
            width: isMobile
              ? "100%"
              : login
                ? ["50%", "150%", "50%"]
                : ["50%", "160%", "50%"],
          },
          {
            height: !isMobile
              ? "100%"
              : login
                ? ["50%", "150%", "50%"]
                : ["35%", "160%", "35%"],
          },
          isMobile
            ? {
                bottom: "0px",
                borderRadius: ["0 0 0 0", "0 0 0 0", "0 0 0 0"],
              }
            : login
              ? {
                  right: "0px",
                  borderRadius: ["0 0 0 0", "0 0 0 0", "25% 0 0 25%"],
                }
              : {
                  left: "0px",
                  borderRadius: ["0 0 0 0", "0 0 0 0", "0 25% 25% 0"],
                },
        ]}
        transition={{
          duration: 1,
          times: [0, 0.5, 1],
        }}
      >
        <div className="flex flex-col gap-6 items-center justify-center max-w-md px-10">
          <Typography
            variant="h4"
            component="p"
            className="!text-white font-bold"
          >
            {login ? "Welcome back!" : "Hello, Friend!"}
          </Typography>
          <Typography
            variant="h6"
            component="p"
            className="!text-white text-center"
          >
            {login ? "Don't have an account?" : "Already have an account?"}
          </Typography>
          <Button
            color="primary"
            variant="contained"
            className="!bg-white !text-primary font-bold rounded-md w-full"
            onClick={() => setLogin(!login)}
          >
            {login ? "Sign up" : "Sign in"}
          </Button>
        </div>
      </motion.div>
    </motion.main>
  );
};

export default Auth;
