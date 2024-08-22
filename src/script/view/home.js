import notesAPI from "../../styles/apps.js";
import Utils from "../utils.js";
import Swal from 'sweetalert2';
import AOS from 'aos';

const noteContainListElements = document.querySelector("#containtList");
const noteSearchingElement =
  noteContainListElements.querySelector(".searching");
const noteLoadingElement =
  noteContainListElements.querySelector(".search-loading");
const noteListElements =
  noteContainListElements.querySelector("#note-unarchive");
// const noteListElements = noteContainListElements.querySelector("note-list");

const noteArchivedListContainerElement =
  document.querySelector("#ArchivedList");
// const notearchivedListElement =
//   noteArchivedListContainerElement.querySelector("archived-list");

//handler buat tambah notes

const AddNoteHandler = (event) => {
  const title = document
    .querySelector("input-form")
    .shadowRoot.querySelector("#title").value;
  const body = document
    .querySelector("input-form")
    .shadowRoot.querySelector("#message").value;
  const newNote = {
    title,
    body,
  };

  notesAPI
    .createNote(newNote)
    .then((createdNote) => {
      console.log("Catatan telah berhasil dibuat:", createdNote);
      window.location.reload();
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

export const showNoteArchived = () => {
  showLoading();

  notesAPI
    .getArchived()
    .then((results) => {
      displayNotearchivedResult(results);
      // showNotearchivedList();
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
        `archive-items[data-id ="${noteID}]"`
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
  notes.forEach((note) => {
    noteListElements.innerHTML += `
      <div class="card">
        <div id="${note.id}" class="column-list">
          <h2>${note.title}</h2>
          <p>${note.body}</p>
          <p>${note.createdAt}</p>
          <p>${note.archived}</p>
          <button id="${note.id}" class="del-btn">
            <i class="fa-solid fa-trash"></i> Hapus
          </button>
          <button id="${note.id}" class="arc-btn">
            <i class="fa-solid fa-arrow-up-right-from-square"></i> Arsipkan
          </button>
        </div>
      </div>
    `;
  });
  
  //Menjalankan untuk mengarsipkan catatan
  document.querySelectorAll(".arc-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const noteId = button.getAttribute("id");
      Swal.fire({
        title: "Anda Yakin?",
        text: "Untuk mengarsipkan catatan ini?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        iconColor:"#fdd005",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ya",
        cancelButtonText:"Tidak"
      }).then((result) => {
        if (result.isConfirmed) {
          notesAPI.archiveNote(noteId).then(() => {
            button.parentElement.parentElement.remove();
            Swal.fire({
              title: "Berhasil",
              text: "Catatan Berhasil diarsipkan.",
              icon: "success"
            });
            showQueryWaiting();
            showNoteArchived();
            showNote();
          });
        }
      });
    });
  });
//};

  //Menjalankan penghapusan catatan
  document.querySelectorAll(".del-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const noteId = button.getAttribute("id");
      Swal.fire({
        title: "Are you sure?",
        //text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then((result) => {
        if (result.isConfirmed) {
          notesAPI.deleteNote(noteId).then(() => {
            button.parentElement.parentElement.remove();
            Swal.fire({
              title: "Deleted!",
              text: "Your note has been deleted.",
              icon: "success"
            });
            showQueryWaiting();
            showNoteArchived();
            showNote();
          });
        }
      });
    });
  });
};
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
  notearchived.map((note) => {
    noteArchivedListContainerElement.innerHTML += `
     <div class ="archived-card">
      <div id=${note.id} class ="archived-column-list">
        <h2>${note.title}</h2>
        <p>${note.body}</p>
        <p>${note.createdAt}</p>
        <p>${note.archived}</p>
        <!--<button id = "${note.id}" class = "del-btn"><i class="fa-solid fa-trash"></i>Hapus</button>-->
        <button id = "${note.id}"class = "unarc-btn"><i class="fa-solid fa-arrow-up-right-from-square"></i>Keluarkan</button>
      </div>
      </div>
    `;
  });

  
  //Menjalankan untuk mengarsipkan catatan
  document.querySelectorAll(".unarc-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const noteId = button.getAttribute("id");
      Swal.fire({
        title: "Anda Yakin?",
        text: "Untuk membatalkan pengarsipan catatan ini?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        iconColor:"#fdd005",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ya",
        cancelButtonText:"Tidak"
      }).then((result) => {
        if (result.isConfirmed) {
          notesAPI.unArchiveNotes(noteId).then(() => {
            button.parentElement.parentElement.remove();
            Swal.fire({
              title: "Berhasil",
              text: "Catatan Berhasil dikeluarkan.",
              icon: "success"
            });
            showQueryWaiting();
            showNoteArchived();
            showNote();
          });
        }
      });
    });
  });
  //tombol Hapus catatan

  document.querySelectorAll(".del-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const noteId = button.getAttribute("id");
      const userConfirmed = confirm(
        "Apakah Anda yakin ingin menghapus catatan ini?"
      );
      if (userConfirmed) {
        notesAPI.deleteNote(noteId).then(() => {
          //document.getElementById(noteId).remove(); // Menghapus elemen dari DOM
          button.parentElement.parentElement.remove();
          showQueryWaiting();
          showNoteArchived();
          showNote();
        });
      }
    });
  });
  //notesAPI.deleteNote(noteId);

  // const confirmation = confirm("Apakah anda ingin menghapus catatan ini");
  // if(confirmation.ok){

  //   notesAPI.deleteNote(noteId);

  // } else{
  //   document.getElementById(`${note.id}`).innerText = `Gagal Menghapus catatan`;
  // }
};
//})

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

// const showNotearchivedList = () => {
//   Array.from(noteArchivedListContainerElement.children).forEach((element) => {
//     Utils.hideElement(element);
//   });
//   Utils.showElement(notearchivedListElement);
// };

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

document.addEventListener("DOMContentLoaded", function () {
  document
    .querySelector("input-form")
    .shadowRoot.querySelector("#FormSearch")
    .addEventListener("submit", AddNoteHandler);
  //document.querySelector("index").shadowRoot.querySelector('#ArchivedList').addEventListener("click",  _addArchivedButton());
  //document.getElementById("#deleteButton").addEventListener('click',onDeleteNoteHandler);
});

showQueryWaiting();
showNoteArchived();
showNote();
