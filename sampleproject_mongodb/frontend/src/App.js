import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import login from "./component/Login";
const API_URL = "http://localhost:4000/new";

function App() {
  const [list, setList] = useState([]);
  const [text1, setText1] = useState("");
  const [status, setStatus] = useState("incomplete");
  const [editItem, setEditItem] = useState(false);
  const [id, setId] = useState(null);

  const fetchItems = async () => {
    try {
      const response = await axios.get(API_URL);
      setList(response.data);
      // console.log(response.data)
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // add handler
  const handleAdd = async () => {
    try {
      const newItem = { text1, status };

      // condition for not taking empty text
      if (!text1) {
        return;
      }
      const response = await axios.post(API_URL, newItem);
      setList([...list, response.data]);
      setText1("");
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  // delete handler
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setList(list.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting item", error);
    }
  };

  ///set values for update
  const setvalues = (id) => {
    const itemToEdit = list.find((item) => item.id === id);
    setText1(itemToEdit.text1);
    setStatus(itemToEdit.status);
    setEditItem(true);
    setId(id);
  };

  // update handler
  const handleUpdate = async (id) => {
    try {
      const updatedTodo = { text1, status };
      await axios.put(`${API_URL}/${id}`, updatedTodo);
      fetchItems();
      setEditItem(false);
    } catch (error) {
      console.error("Error updating task status:", error);
      setEditItem(false);
    }
    setText1("");
  };

  return (
    <div className="App">
      <div>
        <login />
      </div>

      <div className="todo">
        <h1>TODO LIST</h1>
      </div>
      <div className="input1">
        <input
          type="text"
          value={text1}
          required={true}
          onChange={(e) => setText1(e.target.value)}
          placeholder="ADD TASK"
        ></input>

        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="incomplete">Incomplete</option>
          <option value="complete">Complete</option>
          <option value="inprogress">In Progress</option>
        </select>
        <button onClick={editItem ? () => handleUpdate(id) : handleAdd}>
          {editItem ? "Update" : "ADD"}
        </button>
      </div>

      <div className="output">
        <table>
          <thead>
            <tr>
              <th>Text</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item) => (
              <tr key={item.id}>
                <td>
                  <strong>{item.text1}</strong>
                </td>
                <td>{item.status}</td>
                <td>
                  <button onClick={() => handleDelete(item.id)}>Delete</button>
                  <button onClick={() => setvalues(item.id)}>Update</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
