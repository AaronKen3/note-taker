const util = require("util");
const fs = require("fs");
const { v4: generateId } = require("uuid");

class Store {
  read() {
    return util.promisify(fs.readFile)("db/db.json", "utf8");
  }

  write(note) {
    return util.promisify(fs.writeFile)("db/db.json", JSON.stringify(note));
  }

  getNotes() {
    return this.read().then((notes) => {
      //   let parsedNotes;
      //   try {
      //     parsedNotes = [].concat(JSON.parse(notes));
      //   } catch (err) {
      //     parsedNotes = [];
      //   }
      //   return parsedNotes;
      return JSON.parse(notes);
    });
  }

  addNotes(note) {
    const { title, text } = note;
    if (!title || !text) {
      throw new Error("Note title and text cannot be blank");
    }

    const newNote = { title, text, id: generateId() };

    return this.getNotes()
      .then((notes) => [...notes, newNote])
      .then((updatedNotes) => this.write(updatedNotes))
      .then(() => newNote);
  }

  removeNotes(id) {
    return this.getNotes()
      .then((notes) => notes.filter((note) => note.id !== id))
      .then((filteredNotes) => this.write(filteredNotes));
  }
}
module.exports = new Store();
