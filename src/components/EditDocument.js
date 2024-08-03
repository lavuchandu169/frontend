import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateDocumentContent } from "../redux/documentsSlice";
import "./EditDocument.css";
import io from "socket.io-client";
import { setLoginUser } from "../redux/loginSlice";
import { useNavigate } from "react-router-dom";
const socket = io.connect("http://localhost:3001");

const EditDocument = () => {
  const currentUser = useSelector((state) => state.login.loginUser);
  const navigate = useNavigate();
  const currentDocument = useSelector(
    (state) => state.documents.currentDocument
  );
  const dispatch = useDispatch();
  const [content, setContent] = useState("");
  const [acknowledgment, setAcknowledgment] = useState("");
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
                      //if join room doesnt work just place join room as callback here and make apio call in joinroom
                    });
                  } else {
                    res.json().then((res) => {
                      alert(res.message);
                    });
                  }
                })
                .catch((err) => {
                  alert(
                    "Failed to ftech the document content due to : \n",
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

  const handleContentChange = (e) => {
    setContent(e.target.value);
    sendMessage(e.target.value);
  };

  const handleSave = () => {
    fetch("http://127.0.0.1:5000/saveDocumentContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: currentUser,
        content: content,
        fileId: currentDocument.fileId,
      }),
    }).then((res) => {
      if (res.status === 200) {
        res.json().then((res) => {
          dispatch(
            updateDocumentContent({
              fileId: currentDocument.fileId,
              newContent: content,
            })
          );
          setAcknowledgment(res.message);
          setTimeout(() => setAcknowledgment(""), 3000);
        });
      } else {
        res.json().then((res) => {
          alert(res.message);
        });
      }
    });
  };

  return (
    <div className="edit-document flex flex-col justify-center items-center">
      <div className=" w-full flex justify-center items-center gap-10">
        <h2>Document Editor</h2>
        <p>
          <strong>File Name:</strong> {currentDocument.fileName}
        </p>
        <p>
          <strong>File ID:</strong> {currentDocument.fileId}
        </p>
        {currentDocument.ownerName && (
          <p>
            <strong>Owner:</strong> {currentDocument.ownerName}
          </p>
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
      <div className="editor w-full">
        <textarea
          className="editor-textarea"
          placeholder="Start writing your document here..."
          value={content}
          onChange={handleContentChange}
        ></textarea>
      </div>
      <div className="flex justify-end items-end w-full">
        <button className="save-button mr-14" onClick={handleSave}>
          Save
        </button>
      </div>
      {acknowledgment && <div className="acknowledgment">{acknowledgment}</div>}
    </div>
  );
};

export default EditDocument;
