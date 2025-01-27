"use client";

import { pagePaths, usernameStorageKey } from "@/constants";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem(usernameStorageKey)) {
      router.push(pagePaths.heartBeatGraph);
    } else {
      router.push(pagePaths.signin);
    }
  }, []);

  return <div>Main-Page</div>;
};

export default Home;
