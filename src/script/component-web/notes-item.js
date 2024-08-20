import notesAPI from "../../styles/apps.js";
import { showNote, showNoteArchived } from "../view/home.js";

class NoteItems extends HTMLElement {
  _shadowRoot = null;
  _style = null;
  _note = {
    id: null,
    title: null,
    body: null,
    createdAt: null,
    archived: null,
  };

  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._style = document.createElement("style");
  }

  _emptyContent() {
    this._shadowRoot.innerHTML = "";
  }

  set note(value) {
    this._note = value;

    this.render();
  }

  get note() {
    return this._note;
  }

  _updateStyle() {
    this._style.textContent = `

      :host {
        display: block;
        border-radius: 8px;
        box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.5);
        overflow: hidden;
      }

       .fan-art-note {
        width: 100%;
        max-height: 450px;
        object-fit: cover;
        object-position: center;
      }

        .list {
        border: 1px solid #0000;
    border-radius: 8px;
    padding: 0 16px;
    grid-template-columns: 1fr 1fr 1fr 1fr;

    margin: 10px;   
    display:grid; 

      gap: 50px 100px;
   
 
        }

        .btn-del {
    padding: 10px;
     width: 45%;
       border-radius: 40px;
       display: flex;
    margin-top: 20px;
    background-color:  rgb(199, 19, 19);
    color:#fff;

        }
    
         .del-btn:hover{
     background-color: rgb(214, 36, 36);
    }


   
 
        }

        .title-card,.body-card,.create-card{
    color: #fff;
    }

    button {
    display : flex;
      }

    .del-btn {
    padding: 10px;
     width: 45%;
       border-radius: 40px;
       display: flex;
    margin-top: 20px;
    background-color:  rgb(199, 19, 19);
    color:#fff;

    
    }

    .archive-btn{
    padding: 10px;
     width: 100%;
       border-radius: 40px;
       display: block;
    margin-top: 20px;
    color:#000;
    }

    .btn-del:hover{
     background-color: rgb(214, 36, 36);
    }
  



    
        `;
  }

  _addDeleteButton() {
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("del-btn");
    deleteButton.textContent = "Hapus";
    deleteButton.addEventListener("click", () => this._deleteButtonClicked());
    this._shadowRoot.querySelector(".list").appendChild(deleteButton);
  }

  _deleteButtonClicked() {
    const confirmation = confirm(
      "Apakah anda yakin untuk menghapus catatan ini?"
    );

    if (confirmation) {
      notesAPI
        .deleteNote(this._note.id)
        .then(() => {
          this.remove();
          showNote();
          showNoteArchived();
        })
        .catch((error) => {
          console.error("Gagal menghapus catatan:", error);
          alert("Failed to delete note. Please try again.");
        });
    }
  }
  _addArchivedButton() {
    if (!this._note.archived) {
      const ArchivedButton = document.createElement("button");
      ArchivedButton.classList.add("arc-btn");
      ArchivedButton.textContent = "Arsipkan";
      ArchivedButton.addEventListener("click", () =>
        this._ArchivedButtonClicked()
      );
      this._shadowRoot.querySelector(".list").appendChild(ArchivedButton);
    }
  }
  _ArchivedButtonClicked() {
    const confirmation = confirm(
      "Apakah Anda yakin untuk membatalkan arsip catatan ini?"
    );
    if (confirmation) {
      notesAPI
        .ArchiveNote(this._note.id)
        .then(() => {
          this.remove();
          //showNoteArchived();
          showNote();
        })

        .catch((error) => {
          console.log("Terjadi Kesalahan saat mengarsipkan Catatan:", error);
          alert("Gagal untuk mengarsip catatan. Harap coba lagi.");
        });
    }
  }

  render() {
    this._emptyContent();
    this._updateStyle();

    // this._shadowRoot.appendChild(this._style);
    // this._shadowRoot.innerHTML += `
    //  <!--<article class =note-data>
    //   <h2 class = title-card>${this._note.title}</h2>
    //   <p class = body-card>${this._note.body}</p>
    //   <p class = create-card >${this._note.createdAt}</p>
    // </article>-->

    this._shadowRoot.appendChild(this._style);
    this._shadowRoot.innerHTML += `

    <div class ="list">
      <div id =${note.id} class ="column-list">
        <h2>${note.title}</h2>
        <p>${note.body}</p>
        <p>${note.createdAt}</p>
        <p>${note.archived}</p>     
      </div>
   </div>



     
       
    `;
    this._addDeleteButton();
    this._addArchivedButton();
  }
}
customElements.define("note-item", NoteItems);
