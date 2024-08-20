class inputForm extends HTMLElement {
  constructor() { 
    super();
    this._shadowRoot = this.attachShadow({ mode: "open" });

    this._shadowRoot.innerHTML = `
       <style>
       .form-contain{
    background-color: rgba(255, 255, 255, 0.4);
  -webkit-backdrop-filter: blur(5px);
    backdrop-filter: blur(5px);
    border: 1px solid rgb(255, 255, 255);
    padding: 10px ;
    padding-bottom: 10px;
    border-radius: 16px;
    display: block;
    width: 50%;
    margin: 0 auto;

   

}

.form-contain{
    padding: 10px;
}
.form-group {
  
  display: block;
 
}
.form-title{
   padding: 100px;
   text-align: center;
   color: #fff;

}

.form-group label{
    font-weight: 700;
    color: #fff;
    font-size: 20px;
    padding: 0 150px;
  
  
    
}

.form-group input,textarea{
    padding: 1em 3em;
    max-width: 300px;
    display: block;
    border: 1px solid black
}
.form-group input{
    font-family: 'Quicksand',sans-serif;
    padding: 10px;
    border-radius: 10px;
    margin: auto;
    height: 30px;
    width: 100%;
    font-size: 16px;
    align-items: center;
    flex-direction: column;

}


.form-group textarea{
    font-family: 'Quicksand',sans-serif;
    padding:  0 10px;
    width: 100%;
    height: 30vh;
    margin: auto;
    align-items: center;
    border-radius: 10px;
    font-size: 16px;
    justify-content: center;
    

}
.form-group input textarea{
    padding: 10px;
}

.btn{
    
    padding: 10px;
    width: 30%;
    border-radius: 40px;
    background-color: rgb(77, 77, 77);
    font-family: 'Quicksand','sans-serif';
    font-weight: 700;
    color: #fff;
    margin: auto;
    display: block;
    margin-top: 20px;
   
   
    
}


.btn:hover{
    background-color: rgb(170, 169, 169);
}


.note-list{
    display: grid;
    grid-template-columns: 1fr 1fr 3fr;
   
    gap :16px;


}
    
</style>

    <div class="form-contain">
      <form id="FormSearch" class="searh-form">
        <div id="formContain" class="form-group">
            <label for="title">Judul</label>
          <input autocomplete ="off" type="text" id="title" name="title" required/>
          <!--<small id ="titleInvalid">Mohon masukkan judul </small>->

          <!--<div class="form-group">-->
          <label for="title">isi Catatan</label>
          <textarea name="message" id="message" required></textarea>
           <!--<small id ="descInvalid">Mohon masukkan deskripsi </small>-->

             <div id="loadingIndicator" class="loading-indicator"></div>
          
          <!--</div>-->
          <!--<div class="form-group">-->
          <button type="submit" class="btn" id ="buttonID"><i class="fa-solid fa-floppy-disk"></i>Tambah Catatan</button>
          <!--</div>-->
          </div>
      </form>
      </div>

      <div id ="popupConfirmation" class ="confirmation-popup">
        <p>Catatan berhasil ditambahkan</p>
        <button id ="confirmButton">Ok</button>
      </div>
 
     




       `;

    // this._formInputElement = this._shadowRoot.querySelector("#FormSearch");
    // this._popupConfirmation =
    //   this._shadowRoot.querySelector("#popupConfirmation");
    // this._confirmButton = this._shadowRoot.querySelector("#confirmButton");
    // this._loadingIndicator = this._shadowRoot.querySelector("#loadingIndicator");
  }

  _onSubmit() {
    alert("...");
  }
  connectedCallback() {
    this._formInputElement = this._shadowRoot.querySelector("#FormSearch");
    this._popupConfirmation =
      this._shadowRoot.querySelector("#popupConfirmation");
    this._confirmButton = this._shadowRoot.querySelector("#confirmButton");
    this._loadingIndicator = this._shadowRoot.querySelector('#loadingIndicator');

    this._formInputElement.addEventListener(
      "submit",
      this._onSubmit.bind(this)
    );
    this._confirmButton.addEventListener(
      "click",
      this._closeConfirmation.bind(this),
    );
  }

  disconnectedCallback() {
    this._formInputElement.removeEventListener("submit", this._onSubmit.bind(this));
    this._confirmButton.removeEventListener(
      "click",
      this._closeConfirmation.bind(this),
    );
  }

  _onSubmit(event) {
    event.preventDefault();

    const inputTitle = this._shadowRoot.querySelector("#title");
    const inputBody = this._shadowRoot.querySelector("#message");

    if (!inputTitle.value || !inputBody.value) {
      alert("Judul dan isinya harus diisi keduanya");
      return;
    }

    const eventDetail = {
      title: inputTitle.value,
      body: inputBody.value,
    };

    //this._loadingIndicator.style.display = "block";
    this.dispatchEvent(new CustomEvent("submit", { detail: eventDetail }));

    // setTimeout(() => {
    //   this._loadingIndicator.style.display = "none";
    // }, 1000);

    // inputTitle.value = "";
    // inputBody.value = "";
  }

  _showConfirmation() {
    this._popupConfirmation.style.display = "block";
  }

  _closeConfirmation() {
    this._popupConfirmation.style.display = "none";
  }
}

customElements.define("input-form", inputForm);
