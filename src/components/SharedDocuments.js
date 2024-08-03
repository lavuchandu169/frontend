import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setSharedDocuments,
  setCurrentDocument,
} from "../redux/documentsSlice";
import "./SharedDocuments.css";
import { setLoginUser } from "../redux/loginSlice";

const SharedDocuments = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.login.loginUser);
  const sharedDocuments = useSelector(
    (state) => state.documents.sharedDocuments
  );

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
            fetch("http://127.0.0.1:5000/getSharedDocuments", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ userId: res.userId }),
            })
              .then((res) => {
                if (res.status === 200) {
                  res.json().then((res) => {
                    let fetchedSharedDocuments = [...res.filesList];
                    let l = [];
                    for (var i = 0; i < fetchedSharedDocuments.length; i++) {
                      let su = [];
                      for (
                        var j = 0;
                        j < fetchedSharedDocuments[i].sharedUsers.length;
                        j++
                      ) {
                        let obj = {
                          ...fetchedSharedDocuments[i].sharedUsers[j],
                        };
                        su.push({
                          userId: obj.userId,
                          permissions: obj.permission.split(","),
                        });
                      }
                      fetchedSharedDocuments[i].sharedUsers = [...su];
                      fetchedSharedDocuments[i].permissions =
                        fetchedSharedDocuments[i].permissions.split(",");
                      l.push(fetchedSharedDocuments[i]);
                    }
                    dispatch(setSharedDocuments(l));
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
          let goToLogin = () => dispatch("/login");
          goToLogin();
          dispatch(setLoginUser(""));
        }
      })
      .catch((err) => {
        alert(err.message);
      });
  }, [dispatch]);

  const handleViewClick = (doc) => {
    dispatch(setCurrentDocument(doc));
    navigate(`/dashboard/view-document/${doc.fileId}`);
  };

  const handleEditClick = (doc) => {
    dispatch(setCurrentDocument(doc));
    navigate(`/dashboard/edit-document/${doc.fileId}`);
  };

  return (
    <div className="shared-documents">
      <h2>Shared Documents</h2>
      {sharedDocuments.length === 0 ? (
        <p>No Shared Documents</p>
      ) : (
        <table className="w-full">
          <tr>
            <th>File Name</th>
            <th>Owner</th>
            <th>Permissions</th>
            <th>Actions</th>
          </tr>
          {sharedDocuments.map((doc) => (
            <tr>
              <td>{doc.fileName}</td>
              <td>{doc.ownerName}</td>
              <td>{doc.permissions.join(", ")}</td>
              <td className="flex justify-center items-center gap-2">
                {doc.permissions.includes("view") && (
                  <button
                    className="icon-button"
                    title="View"
                    onClick={() => handleViewClick(doc)}
                  >
                    <i className="fas fa-eye"></i>
                  </button>
                )}
                {doc.permissions.includes("edit") && (
                  <button
                    className="icon-button"
                    title="Edit"
                    onClick={() => handleEditClick(doc)}
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                )}
              </td>
            </tr>
          ))}
        </table>
      )}
    </div>
  );
};

export default SharedDocuments;
