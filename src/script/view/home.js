mport notesAPI from "../../styles/apps.js";
import Utils from "../utils.js";


const noteContainListElements = document.querySelector("#containtList");
const noteSearchingElement =
  noteContainListElements.querySelector(".searching");
const noteLoadingElement =
  noteContainListElements.querySelector(".search-loading");
 const noteListElements = noteContainListElements.querySelector("#note-unarchive");
// const noteListElements = noteContainListElements.querySelector("note-list");

const noteArchivedListContainerElement =
  document.querySelector("#ArchivedList");
// const notearchivedListElement =
//   noteArchivedListContainerElement.querySelector("archived-list");

//handler buat tambah notes



const AddNoteHandler = (event) => {
  const title = document.querySelector("input-form").shadowRoot.querySelector("#title").value;
  const body = document.querySelector("input-form").shadowRoot.querySelector("#message").value;
  const newNote = {
    title,
    body,
  };

  



  notesAPI
  .createNote(newNote)
  .then((createdNote) => {
    console.log("Catatan telah berhasil dibuat:", createdNote);
    window.location.reload()
  })
  .catch((error) => {
    console.error("Kesalahan saat membuat catatan:", error);
  });

  };
document
  .querySelector("input-form")
  .addEventListener("submit ", AddNoteHandler);
  
//menampilkan data notes

export const showNote = (query) => {
  showLoading();
  notesAPI
    .getNotes(query)
    .then((results) => {
      displayResults(results);
      showNoteList();
    })
    .catch((error) => {
      console.error("Kesalahan saat mengambil catatan:", error);
    });
};

export const showNoteArchived= () => {
  showLoading();
  notesAPI
    .getArchived()
    .then((results) => {
      displayNotearchivedResult(results);
      showNotearchivedList();
    })
    .catch((error) => {
      console.error(
        "Terjadi kesalahan saat mengambil catatan yang ter-Arsip:",
        error
      );
    });
};

//untuk menangani hapus data note

const onDeleteNoteHandler = (event) => {
  const noteID = event.detail.noteID;
  notesAPI
    .deleteNote(noteID)
    .then(() => {
      const noteItems = document.querySelector(
        `notes-item [data-id ="${noteID}"]`
      );
      const archivedItem = document.querySelector(
        `archived-items[data-id="${noteID}"]`
      );

      if (noteItems) {
        noteItems.remove();
      }

      if (archivedItem) {
        archivedItem.remove();
      }
    })

    .catch((error) => {
      console.error("terjadi Kesalahan saat menghapus catatan:", error);
      alert("Gagal menghapus catatas, Mohon dicoba lagi.");
    });
};

// untuk unarchive note

const onUnarchiveNoteHandler = (event) => {
  const noteID = event.detail.noteID;
  notesAPI
    .unarchiveNote(noteID)
    .then(() => {
      const archivedItem = document.querySelector(
        `archive-items[data-id ="${noteID}]"`,
      );
      if (archivedItem) {
        archivedItem.remove();
        showNoteArchived();
      }
    })
    .catch((error) => {
      console.error("Terjadi kesalahan saat membatakan catatan:", error);
      alert("Gagal untuk membatalkan catatan. Mohon dicoba lagi");
    });
};

const displayResults = (notes) => {

//   document.querySelectorAll('.arc-btn').forEach((button) => {
//     button.addEventListener('click', () => {
//         const noteId = button.getAttribute('id');
//         notesAPI.archiveNote(noteId);
//   })
// })
  notes.map((note) => {
    
    
    noteListElements.innerHTML += `
     <div class ="card">
      <div id=${note.id} class ="column-list">
        <h2>${note.title}</h2>
        <p>${note.body}</p>
        <p>${note.createdAt}</p>
        <p>${note.archived}</p>
        <button class = "del-btn"><i class="fa-solid fa-trash"></i>Hapus</button>
        <button  id ="${note.id}"class = "arc-btn"><i class="fa-solid fa-arrow-up-right-from-square"></i>Arsipkan</button>
      </div>
      </div>
    `
    })
  }

 
  // const noteListItemElements = notes.map((note) => {
  //   const ListItemElements = document.createElement("notes-item");
  //   ListItemElements.note = note;
  //   ListItemElements.addEventListener("deleteNotes", onDeleteNoteHandler);

  //   return ListItemElements;
  //});

  // Utils.emptyElement(noteListElements);
  // noteListElements.append(...noteListItemElements);

//};

const displayNotearchivedResult = (notearchived) => {

  notearchived.map((note)=>{
    noteArchivedListContainerElement.innerHTML += `
     <div class ="card">
      <div id=${note.id} class ="column-list">
        <h2>${note.title}</h2>
        <p>${note.body}</p>
        <p>${note.createdAt}</p>
        <p>${note.archived}</p>
        <button id = deleteButton class = "del-btn"><i class="fa-solid fa-trash"></i>Hapus</button>
        <button class = "arc-btn"><i class="fa-solid fa-arrow-up-right-from-square"></i>Keluarkan</button>
      </div>
      </div>
    `
    })
  }

  
  // const archivedItemElements = notearchived.map((notearchived) => {
  //   const archivedItemElement = document.createElement("archive-items");
  //   archivedItemElement.note = notearchived;
  //   archivedItemElement.addEventListener(
  //     "unarchiveNote",
  //     onUnarchiveNoteHandler,
  //   );

  //   return archivedItemElements;
  //});

  // Utils.emptyElement(notearchivedListElement);
  // notearchivedListElement.append(...archivedItemElements);
//};

const showNoteList = () => {
  Array.from(noteContainListElements.children).forEach((element) => {
    Utils.showElement(element);
  });
 // Utils.showElement(noteListElements);
};

const showNotearchivedList = () => {
  Array.from(noteArchivedListContainerElement.children).forEach((element) => {
    Utils.hideElement(element);
  });
  Utils.showElement(notearchivedListElement);
};

const showLoading = () => {
  Array.from(noteContainListElements.children).forEach((element) => {
    Utils.hideElement(element);
  });
  Utils.showElement(noteLoadingElement);
};

const showQueryWaiting = () => {
  Array.from(noteContainListElements.children).forEach((element) => {
    Utils.hideElement(element);
  });
  Utils.showElement(noteSearchingElement);
};

document.addEventListener('DOMContentLoaded', function () {
  document.querySelector("input-form").shadowRoot.querySelector('#FormSearch').addEventListener("submit", AddNoteHandler);
  //document.querySelector("index").shadowRoot.querySelector('#ArchivedList').addEventListener("click",  _addArchivedButton());
  //document.getElementById("#deleteButton").addEventListener('click',onDeleteNoteHandler);

})


showQueryWaiting();
showNoteArchived();
showNote();
