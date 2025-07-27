import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Container } from "@mui/material";
import { styled } from "@mui/system";
import Login from "./Login";
import Signup from "./Signup";

const AnimatedDiv = styled(Box)(({ theme, side, width }) => ({
  position: "absolute",
  width: `${width}%`,
  height: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "green",
  zIndex: 50,
  transition: "width 1s, margin-left 1s, margin-right 1s",
  marginLeft: side === "right" ? "50%" : "0%",
  marginRight: side === "left" ? "50%" : "0%",
}));

const Auth = () => {
  const [side, setSide] = useState("left");
  const [isAnimating, setIsAnimating] = useState(false);
  const [width, setWidth] = useState("50%");

  const handleClick = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    // Expand to full width
    setWidth("100%");

    setTimeout(() => {
      // Switch sides and shrink to 50%
      setSide((prev) => (prev === "left" ? "right" : "left"));
      setWidth("50%");
      setIsAnimating(false);
    }, 1000);
  };

  return (
    <div
      className={`w-full flex  h-[100vh] ${side === "left" ? " flex" : "flex-row-reverse"} Animated-div`}
    >
      {/* Background Content */}
      <div
        className="flex items-center justify-center animate-divw"
        style={{
          display: width === "100%" ? "none" : "flex",
          opacity: width === "100%" ? "0" : "1",
          width: width === "100%" ? "0%" : "50%",
        }}
      >
        {side === "left" ? <Login /> : <Signup />}
      </div>

      {/* Animated Sidebar */}
      <div
        className={`flex  items-center justify-center h-full bg-primary animated-div  z-50 `}
        style={{
          width: width,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            alignItems: "center",
          }}
        >
          <Typography variant="h4" color="white" fontWeight="bold">
            {side === "left" ? "Welcome back!" : "Hello, Friend!"}
          </Typography>
          <Typography variant="h6" color="white">
            {side === "left"
              ? "Don't have an account?"
              : "Already have an account?"}
          </Typography>
          <Button
            variant="outlined"
            sx={{
              border: "2px solid white",
              py: 1,
              borderRadius: "4px",
              px: 2,
              width: "100%",
              backgroundColor: "white",
              color: "primary.main",
              "&:disabled": { opacity: 0.7 },
            }}
            onClick={handleClick}
            disabled={isAnimating}
          >
            {side === "left" ? "Sign up" : "Sign in"}
          </Button>
        </Box>
      </div>
    </div>
  );
};

export default Auth;
