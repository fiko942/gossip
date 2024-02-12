import MainContainer from "./MainContainer";
import Sidebar from "./Sidebar";
import request from "../../request";
import { useEffect, useState } from "react";

export default function Main({ socket }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    request("/user/detail", "get").then((data) => {
      setUser(data.data);
    });
  }, []);

  return (
    user !== null && (
      <MainContainer>
        <Sidebar user={user} socket={socket} />
      </MainContainer>
    )
  );
}
