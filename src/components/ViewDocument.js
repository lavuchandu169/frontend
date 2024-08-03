import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./ViewDocument.css";
import { setLoginUser } from "../redux/loginSlice";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
const socket = io.connect("http://localhost:3001");

const ViewDocument = () => {
  const currentUser = useSelector((state) => state.login.loginUser);
  const [content, setContent] = useState("");
  const currentDocument = useSelector(
    (state) => state.documents.currentDocument
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [roomMessage, setRoomMessage] = useState("");

  const joinRoom = () => {
    if (currentDocument.fileId !== "") {
      socket.emit("join_room", {
        fileId: currentDocument.fileId,
        userId: currentUser,
      });
    }
  };

  const sendMessage = (content) => {
    socket.emit("send_message", {
      userId: currentUser,
      fileId: currentDocument.fileId,
      content: content,
    });
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      if (data.roomMessage) {
        setRoomMessage(data.roomMessage);
        sendMessage(content);
      }
      if (data.userId && data.newContent) {
        setContent(data.newContent);
      }
    });
  }, [socket]);

  useEffect(() => {
    if (!currentDocument) {
      let goToDashboard = () => navigate("/dashboard");
      goToDashboard();
    }
    fetch("http://127.0.0.1:5000/verifyUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user: localStorage.getItem("user") }),
    })
      .then((res) => {
        if (res.status === 200) {
          res.json().then((res) => {
            dispatch(setLoginUser(res.userId));
            if (currentDocument) {
              fetch("http://127.0.0.1:5000/getDocumentContent", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  userId: currentDocument.ownerName,
                  fileId: currentDocument.fileId,
                }),
              })
                .then((res) => {
                  if (res.status === 200) {
                    res.json().then((res) => {
                      setContent(res.fileContent);
                      joinRoom();
                    });
                  } else {
                    res.json().then((res) => {
                      alert(res.message);
                    });
                  }
                })
                .catch((err) => {
                  alert(
                    "Failed to fetch the document content due to : \n",
                    err.message
                  );
                });
            }
          });
        } else {
          let goToLogin = () => navigate("/login");
          goToLogin();
          dispatch(setLoginUser(""));
        }
      })
      .catch((err) => {
        alert(err.message);
      });
  }, []);

  if (!currentDocument) {
    return <div>No document selected</div>;
  }

  return (
    <div className="view-document flex flex-col justify-center items-center">
      <div className=" w-full flex justify-center items-center gap-10">
        <div>Document Viewer</div>
        <div>
          <strong>File Name:</strong> {currentDocument.fileName}
        </div>
        <div>
          <strong>File ID:</strong> {currentDocument.fileId}
        </div>
        {currentDocument.ownerName && (
          <div>
            <strong>Owner:</strong> {currentDocument.ownerName}
          </div>
        )}
        {roomMessage.length !== 0 ? <p>{roomMessage}</p> : <></>}
        {currentDocument.sharedUsers && (
          <div>
            <strong>Shared With:</strong>
            <ul>
              {currentDocument.sharedUsers.map((user, index) => (
                <li key={index}>
                  {user.userId} - {user.permissions.join(", ")}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="viewer w-full">
        <textarea
          className="viewer-textarea"
          value={content}
          readOnly
        ></textarea>
      </div>
    </div>
  );
};

export default ViewDocument;
