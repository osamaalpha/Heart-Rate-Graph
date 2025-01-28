"use client";
import { pagePaths, specialCharsRegex, usernameStorageKey } from "@/constants";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./style.module.css";

const Signin = () => {
  const [username, setUsername] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem(usernameStorageKey)) {
      router.push(pagePaths.heartBeatGraph);
    }
  }, []);

  const handleStart = () => {
    if (username.trim() === "") {
      alert("Please enter your name.");
      return;
    } else if (specialCharsRegex.test(username)) {
      alert("Please don't use special characters in your user name");
      return;
    }

    fetch("/api/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: username }),
    }).then((res) => {
      if (res.status === 200) {
        //TODO: encrypt the user name as a mock for auth
        localStorage.setItem(usernameStorageKey, username);
        router.push(pagePaths.heartBeatGraph);
      }
    });
  };

  return (
    <div className={styles.signinContainer}>
      <h1>Real-Time Heart Rate Monitor</h1>

      <div>
        <input
          type="text"
          placeholder="Enter your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button onClick={handleStart}>Start Monitoring</button>
      </div>
    </div>
  );
};

export default Signin;
