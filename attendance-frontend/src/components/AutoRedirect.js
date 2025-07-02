import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AutoRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    // Always open login page
    navigate("/login");
  }, []);

  return null;
}
