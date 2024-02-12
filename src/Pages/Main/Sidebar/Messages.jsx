import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import users from "../../../data/users";

export default function Messages({ socket }) {
  const location = useLocation();
  const [winSize, setWinSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [search, setSearch] = useState("");
  const [activeConversation, setActiveConversation] = useState(null);

  useEffect(() => {
    socket.io.emit("set-active-conversation", { id: activeConversation });
  }, [activeConversation]);

  useEffect(() => {
    const handleResize = () => {
      setWinSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    location.pathname === "/" && (
      <>
        {/* Search box */}
        <div className="flex align-center w-full bg-sky-700 px-4 py-2">
          <input
            placeholder="Search"
            className="caret-red-500 border-2 px-2 py-1 rounded-lg outline-0 w-full active:px-4 focus:px-4 transition-all duration-250 eas-in"
            value={search}
            onChange={(sender) => setSearch(sender.target.value)}
          />
        </div>
        {/* Friends */}
        <div
          className="messages-items-container flex flex-col w-full h-full bg-sky-900 overflow-x-hidden overflow-y-auto"
          style={{
            height: winSize.height - 216,
            maxHeight: winSize.height - 216,
            minHeight: winSize.height - 216,
          }}
        >
          {users.map((user, i) => (
            <div
              className="item flex align-center w-full py-2 px-4 relative gap-2 hover:bg-sky-800"
              key={i}
              onClick={() => setActiveConversation(user.id)}
            >
              <div
                style={{
                  transform: "translate(0, -50%)",
                }}
                className={`
              absolute
              bg-green-500
              rounded
              duration-150
              transition-all
              top-2/4
                ${
                  activeConversation === user.id
                    ? "p-1 h-10 opacity-1"
                    : "p-1  h-0 opacity-0"
                }
              `}
              ></div>
              <img
                src={user.avatar}
                draggable={false}
                alt={user.name}
                title={user.name}
                className={`rounded-full w-12 h-12 select-none transition-all duration-150 ${
                  activeConversation === user.id ? "ml-4" : ""
                } `}
              />
              <div className="flex flex-col w-full">
                <div className="text-white select-none">{user.name}</div>
                <div
                  className="last-chat text-slate-400 text-sm whitespace-nowrap text-ellipsis overflow-hidden select-none"
                  style={{
                    maxWidth: `calc(100% - ${
                      activeConversation === user.id ? "70px" : "50px"
                    })`,
                    minWidth: `calc(100% - ${
                      activeConversation === user.id ? "70px" : "50px"
                    })`,
                  }}
                >
                  is simply dummy text of the printing and typesetting industry.
                  Lorem Ipsum has been the industry's standard dummy text ever
                  since the 1500s, when an unknown printer took a galley of type
                  and scrambled it to make a type specimen book. It has survived
                  not only five centuries, but also the leap into electronic
                  typesetting, remaining essentially unchanged. It was
                  popularised in the 1960s with the release of Letraset sheets
                  containing Lorem Ipsum passages, and more recently with
                  desktop publishing
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    )
  );
}
