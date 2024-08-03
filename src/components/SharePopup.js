import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateSharedUsers } from "../redux/documentsSlice";
import "./Popup.css";

const SharePopup = ({ fileId, sharedUsers = [], onClose }) => {
  const [users, setUsers] = useState(sharedUsers);
  const [newUserId, setNewUserId] = useState("");
  const [permissions, setPermissions] = useState({ view: false, edit: false });
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.login.loginUser);

  const handleAddUser = () => {
    const userPermissions = Object.keys(permissions).filter(
      (permission) => permissions[permission]
    );
    if (
      newUserId &&
      userPermissions.length > 0 &&
      !users.some((user) => user.userId === newUserId)
    ) {
      setUsers([...users, { userId: newUserId, permissions: userPermissions }]);
      setNewUserId("");
      setPermissions({ view: false, edit: false });
      setError("");
    } else {
      setError(
        "Please enter a valid user ID and select at least one permission."
      );
    }
  };

  const handleRemoveUser = (userId) => {
    setUsers(users.filter((user) => user.userId !== userId));
  };

  const handlePermissionChange = (e) => {
    const { name, checked } = e.target;
    setPermissions({ ...permissions, [name]: checked });
  };

  const handleSave = () => {
    let su = [];
    for (var i = 0; i < users.length; i++) {
      su.push({
        userId: users[i].userId,
        permission: users[i].permissions.join(","),
      });
    }
    fetch("http://127.0.0.1:5000/updateFilePermissions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: currentUser,
        fileId: fileId,
        sharedUsers: su,
      }),
    })
      .then((res) => {
        if (res.status === 200) {
          res.json().then((res) => {
            let newUsers = [];
            if (res.isRejected) {
              for (var i = 0; i < users.length; i++) {
                if (res.rejectedUsers.indexOf(users[i].userId) === -1) {
                  newUsers.push(users[i]);
                }
              }
              alert(res.message);
            } else {
              newUsers = [...users];
            }
            dispatch(updateSharedUsers({ fileId, sharedUsers: newUsers }));
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
    onClose();
  };

  return (
    <div className="popup">
      <div className="popup-inner">
        <h2>Share Document</h2>
        <div>
          <input
            type="text"
            placeholder="Enter user ID"
            className="border-2 rounded-md"
            value={newUserId}
            onChange={(e) => setNewUserId(e.target.value)}
          />
          <div className="flex justify-center items-center gap-4">
            <label className="flex justify-center items-center gap-2">
              <input
                type="checkbox"
                name="view"
                checked={permissions.view}
                onChange={handlePermissionChange}
              />
              View
            </label>
            <label className="flex justify-center items-center gap-2">
              <input
                type="checkbox"
                name="edit"
                checked={permissions.edit}
                onChange={handlePermissionChange}
              />
              Edit
            </label>
          </div>
          <button className="bg-blue-500 text-white " onClick={handleAddUser}>
            Add User
          </button>
          {error && <p className="error">{error}</p>}
        </div>
        <ul>
          {users.map((user) => (
            <li key={user.userId}>
              <span>
                {user.userId} - {user.permissions.join(", ")}
              </span>
              <button
                className="bg-red-500 text-white"
                onClick={() => handleRemoveUser(user.userId)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
        <button className="bg-green-500 text-white" onClick={handleSave}>
          Save
        </button>
        <button className="" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default SharePopup;
