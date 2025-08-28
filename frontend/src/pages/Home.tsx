import { useEffect } from "react";
import { useNavigate } from "react-router";
import type { HomeProps } from "../types";

const Home = ({ user }: HomeProps) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate])
  return (
    user ? <>User</> : <p>No user</p>
  );
};

export default Home;
