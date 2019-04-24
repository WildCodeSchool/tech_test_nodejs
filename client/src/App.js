// /client/App.js
import React, { Component } from "react";
import axios from "axios";

class App extends Component {
  // initialize our state 
  state = {
    data: [],
    id: 0,
    message: null,
    intervalIsSet: false,
    idToDelete: null,
    idToUpdate: null,
    objectToUpdate: null
  };

  // fetch all existing data from db, see if db has changed and implement into UI
  componentDidMount() {
    this.getDataFromDb();
    if (!this.state.intervalIsSet) {
      let interval = setInterval(this.getDataFromDb, 1000);
      this.setState({ intervalIsSet: interval });
    }
  }

  // kill process when done
  componentWillUnmount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null });
    }
  }

  // get method uses backend api key to fetch data from db
  getDataFromDb = () => {
    fetch("http://localhost:3001/api/getData")
      .then(data => data.json())
      .then(res => this.setState({ data: res.data }));
  };

  // method using backend api to create new query in db
  putDataToDB = message => {
    let currentIds = this.state.data.map(data => data.id);
    let idToBeAdded = 0;
    while (currentIds.includes(idToBeAdded)) {
      ++idToBeAdded;
    }

    axios.post("http://localhost:3001/api/putData", {
      id: idToBeAdded,
      message: message
    });
  };

  // method using backend api to delete data from db
  deleteFromDB = idTodelete => {
    let objIdToDelete = null;
    this.state.data.forEach(dat => {
      if (dat.id == idTodelete) {
        objIdToDelete = dat._id;
      }
    });

    axios.delete("http://localhost:3001/api/deleteData", {
      data: {
        id: objIdToDelete
      }
    });
  };

  // method using backend api to update existing data in db
  updateDB = (idToUpdate, updateToApply) => {
    let objIdToUpdate = null;
    this.state.data.forEach(dat => {
      if (dat.id == idToUpdate) {
        objIdToUpdate = dat._id;
      }
    });

    axios.post("http://localhost:3001/api/updateData", {
      id: objIdToUpdate,
      update: { message: updateToApply }
    });
  };

  // render to the browser - could separate into components
  render() {
    //array of data as an object set to the state
    const { data } = this.state;
    return (
      
      <div class="form">
        <h2>Your Christmas List</h2>
        <ul class="list-group">
          {data.length <= 0
            ? "No gifts found"
            : data.map(dat => (
                <li style={{ padding: "10px" }} key={data.message} class="list-group-item">
                  <span style={{ color: "gray" }}> id: </span> {dat.id} <br />
                  <span style={{ color: "gray" }}> data: </span>
                  {dat.message}
                </li>
              ))}
        </ul>
        <h3>Add a gift to the list</h3>
        <div class="form-group">
          <label for="addGift" >Enter gift name:</label>
          <input
            type="text"
            onChange={e => this.setState({ message: e.target.value })}
            placeholder="Add a gift"
            style={{ width: "200px" }}
            class="form-control" 
            id="addGift" />
          <button class="btn btn-primary" onClick={() => this.putDataToDB(this.state.message)}>
            ADD GIFT
          </button>
        </div>
        <h3>Remove a gift from the list</h3>
        <div class="form-group">
          <label for="deleteGift" >Enter gift name:</label>
          <input
            type="text"
            style={{ width: "200px" }}
            onChange={e => this.setState({ idToDelete: e.target.value })}
            placeholder="Delete gift using id"
            class="form-control" 
            id="deleteGift" />
          <button class="btn btn-primary" onClick={() => this.deleteFromDB(this.state.idToDelete)}>
            REMOVE GIFT
          </button>
        </div>
        <h3>Change a gift on the list</h3>
        <div class="form-group">
          <label for="updateGiftId" >Enter gift name:</label>
          <input
            type="text"
            style={{ width: "200px" }}
            onChange={e => this.setState({ idToUpdate: e.target.value })}
            placeholder="Gift id"
            class="form-control" 
            id="updateGiftId" />
            <label for="updateGiftName" >Enter gift name:</label>
          <input
            type="text"
            style={{ width: "200px" }}
            onChange={e => this.setState({ updateToApply: e.target.value })}
            placeholder="Gift name"
            class="form-control"
            id="updateGiftName" />
          <button class="btn btn-primary"
            onClick={() =>
              this.updateDB(this.state.idToUpdate, this.state.updateToApply)
            }
          >
            UPDATE GIFT
          </button>
        </div>
      </div>
    );
  }
}

export default App;
