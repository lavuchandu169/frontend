import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setDocuments,
  setCurrentDocument,
  addDocument,
} from "../redux/documentsSlice";
import RenamePopup from "./RenamePopup";
import DeleteConfirmationPopup from "./DeleteConfirmationPopup";
import SharePopup from "./SharePopup";
import NewDocumentPopup from "./NewDocumentPopup";
import "./MyDocuments.css";
import { setLoginUser } from "../redux/loginSlice";

const MyDocuments = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const documents = useSelector((state) => state.documents.documents);
  const currentUser = useSelector((state) => state.login.loginUser);
  const [isRenamePopupOpen, setIsRenamePopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [isSharePopupOpen, setIsSharePopupOpen] = useState(false);
  const [isNewDocumentPopupOpen, setIsNewDocumentPopupOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  useEffect(() => {
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
            fetch("http://127.0.0.1:5000/getUserDocuments", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ userId: res.userId }),
            })
              .then((res) => {
                if (res.status === 200) {
                  res.json().then((res) => {
                    let fetchedDocuments = [...res.filesList];
                    let l = [];
                    for (var i = 0; i < fetchedDocuments.length; i++) {
                      let su = [];
                      for (
                        var j = 0;
                        j < fetchedDocuments[i].sharedUsers.length;
                        j++
                      ) {
                        let obj = { ...fetchedDocuments[i].sharedUsers[j] };
                        su.push({
                          userId: obj.userId,
                          permissions: obj.permission.split(","),
                        });
                      }
                      fetchedDocuments[i].sharedUsers = [...su];
                      l.push(fetchedDocuments[i]);
                    }
                    dispatch(setDocuments(l));
                  });
                } else {
                  res.json().then((res) => {
                    alert(res.message);
                  });
                }
              })
              .catch((err) => {
                alert("Failed to fetch documents due to : \n" + err.message);
              });
          });
        } else {
          let goToLogin = () => navigate("/login");
          goToLogin();
          dispatch(setLoginUser(""));
        }
      })
      .catch((err) => {
        console.log(err.message);
        // alert(err.message);
      });
  }, [dispatch]);

  const handleRenameClick = (doc) => {
    setSelectedDocument(doc);
    setIsRenamePopupOpen(true);
  };

  const handleDeleteClick = (doc) => {
    setSelectedDocument(doc);
    setIsDeletePopupOpen(true);
  };

  const handleShareClick = (doc) => {
    setSelectedDocument(doc);
    setIsSharePopupOpen(true);
  };

  const handleEditClick = (doc) => {
    dispatch(setCurrentDocument(doc));
    navigate(`/dashboard/edit-document/${doc.fileId}`);
  };

  const handleViewClick = (doc) => {
    dispatch(setCurrentDocument(doc));
    navigate(`/dashboard/view-document/${doc.fileId}`);
  };

  const handleNewDocumentClick = () => {
    setIsNewDocumentPopupOpen(true);
  };

  const handleCreateNewDocument = (fileName) => {
    const newDocument = {
      userId: currentUser,
      fileName,
      dateCreated: new Date(),
    };
    fetch("http://127.0.0.1:5000/newFile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...newDocument }),
    }).then((res) => {
      if (res.status === 200) {
        fetch("http://127.0.0.1:5000/getUserDocuments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: currentUser }),
        })
          .then((res) => {
            if (res.status === 200) {
              res.json().then((res) => {
                let fetchedDocuments = [...res.filesList];
                let l = [];
                for (var i = 0; i < fetchedDocuments.length; i++) {
                  let su = [];
                  for (
                    var j = 0;
                    j < fetchedDocuments[i].sharedUsers.length;
                    j++
                  ) {
                    let obj = { ...fetchedDocuments[i].sharedUsers[j] };
                    su.push({
                      userId: obj.userId,
                      permissions: obj.permission.split(","),
                    });
                  }
                  fetchedDocuments[i].sharedUsers = [...su];
                  l.push(fetchedDocuments[i]);
                }
                dispatch(setDocuments(l));
              });
            } else {
              res.json().then((res) => {
                alert(res.message);
              });
            }
          })
          .catch((err) => {
            alert("Failed to fetch documents due to : \n" + err.message);
          });
      } else {
        res.json((res) => {
          alert(res.message);
        });
      }
    });
    setIsNewDocumentPopupOpen(false);
  };

  return (
    <div className="my-documents">
      <h2>My Documents</h2>
      {documents.length === 0 ? (
        <p>No Documents Created</p>
      ) : (
        <table className="w-full">
          <tr>
            <th>File Name</th>
            <th>Date Created</th>
            <th>Actions</th>
          </tr>
          {documents.map((doc) => (
            <tr>
              <td>{doc.fileName}</td>
              <td>{Date(doc.dateCreated)}</td>
              <td className="flex justify-center items-center gap-2">
                <button
                  className="icon-button"
                  title="View"
                  onClick={() => handleViewClick(doc)}
                >
                  <i className="fas fa-eye"></i>
                </button>
                <button
                  className="icon-button"
                  title="Edit"
                  onClick={() => handleEditClick(doc)}
                >
                  <i className="fas fa-edit"></i>
                </button>
                <button
                  className="icon-button"
                  title="Delete"
                  onClick={() => handleDeleteClick(doc)}
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
                <button
                  className="icon-button"
                  title="Rename"
                  onClick={() => handleRenameClick(doc)}
                >
                  <i className="fas fa-pen"></i>
                </button>
                <button
                  className="icon-button"
                  title="Share"
                  onClick={() => handleShareClick(doc)}
                >
                  <i className="fas fa-share-alt"></i>
                </button>
              </td>
            </tr>
          ))}
        </table>
      )}

      <button className="floating-button" onClick={handleNewDocumentClick}>
        +
      </button>
      {isRenamePopupOpen && selectedDocument && (
        <RenamePopup
          fileId={selectedDocument.fileId}
          fileName={selectedDocument.fileName}
          onClose={() => setIsRenamePopupOpen(false)}
        />
      )}
      {isDeletePopupOpen && selectedDocument && (
        <DeleteConfirmationPopup
          fileId={selectedDocument.fileId}
          fileName={selectedDocument.fileName}
          onClose={() => setIsDeletePopupOpen(false)}
        />
      )}
      {isSharePopupOpen && selectedDocument && (
        <SharePopup
          fileId={selectedDocument.fileId}
          sharedUsers={selectedDocument.sharedUsers}
          onClose={() => setIsSharePopupOpen(false)}
        />
      )}
      {isNewDocumentPopupOpen && (
        <NewDocumentPopup
          onClose={() => setIsNewDocumentPopupOpen(false)}
          onCreate={handleCreateNewDocument}
        />
      )}
    </div>
  );
};

export default MyDocuments;
