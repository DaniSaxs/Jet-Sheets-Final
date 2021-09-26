import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.0.1/firebase-analytics.js";
import { getFirestore, collection, getDocs, doc, setDoc, updateDoc, getDoc, query, where  } from "https://www.gstatic.com/firebasejs/9.0.1/firebase-firestore.js";
const firebaseConfig = {
    apiKey: "AIzaSyCVgukzI_MAJgxBxOv3q0KAFKaWkm6ryUc",
    authDomain: "jet-sheets.firebaseapp.com",
    projectId: "jet-sheets",
    storageBucket: "jet-sheets.appspot.com",
    messagingSenderId: "705356409976",
    appId: "1:705356409976:web:daee6c630c3bc2ddc3d18d",
    measurementId: "G-J71VD145J8"
};

$(window).on('load', function(){
    $('.preloader').css('animation-play-state','running');
    setTimeout(() => {
        $('.preloader').css('display','none');
    }, 1000);
});

console.warn('v13');

var internetFlag = true;

window.addEventListener("load", () => {
    internetConnection(navigator.onLine ? "online" : "offline");
});

window.addEventListener("offline", (event) => {
    internetConnection(event.type);
});
  
window.addEventListener("online", (event) => {
    internetConnection(event.type);
});

$('body').append(`
    <div class="position-fixed bg-white px-2 pt-2" style="left:1%; bottom:0; border-radius:100px 100px 0 0; box-shadow: 0 0 10px 1px rgba(0,0,0,0.6)">
        <i id="connection" class="fa fa-wifi"></i>
    </div>
`);

function internetConnection(status){
    if(status === "online"){
        internetFlag = true;
        $('#connection').addClass('text-success');
        $('#connection').removeClass('text-danger');
    }else{
        internetFlag = false;
        $('#connection').addClass('text-danger');
        $('#connection').removeClass('text-success');
    }
}

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore();

function checkForWindowResize() {
    // console.log(`Screen width: ${window.innerWidth}`);
    if (window.innerWidth > 1024) {
        all(25);
        $('.logo').addClass('position-absolute');
        $('.logo').removeClass('mt-2');
        $('.logo').removeClass('mb-4');
        $('body').css({'overflow-y' : 'hidden'});
    }else if (window.innerWidth > 768 && window.innerWidth <= 1024){
        all(15);
        $('body').css({'overflow-y' : 'initial'});
    }else {
        all(8);
        $('.logo').removeClass('position-absolute');
        $('.logo').addClass('mt-2');
        $('.logo').addClass('mb-4');
        $('body').css({'overflow-y' : 'initial'});
    }
}

checkForWindowResize();

window.addEventListener('DOMLoadedContent', checkForWindowResize);
// window.addEventListener('resize', checkForWindowResize);

function all(cantF){

    function internetAlert(){
        Swal.fire({
            title: 'No hay Internet!',
            html : 'Conéctate a Internet para continuar!',
            icon : 'error',
            timer: 1500,
            showConfirmButton: false
        });
    }

    var elements = 256;

    var sheets = [];
    var user = {id: '', username: '', status: 0};

    for (let i = 0; i <= elements - 1; i++) {
        sheets[i] = {id: i + 1, flag: true, status: 0, validate: false};
    }

    var countAll = 0;

    sheets.push({count: countAll});

    if(localStorage.getItem('sheets') === null){
        localStorage.setItem('sheets',JSON.stringify(sheets));
    }else{
        localStorage.getItem('sheets');
    }

    var database = JSON.parse(localStorage.getItem('sheets'));
    var counter = database[database.length - 1];
    
    if(localStorage.getItem('user') === null){
        localStorage.setItem('user',JSON.stringify(user));
    }else{
        localStorage.getItem('user');
    }

    var userStorage = JSON.parse(localStorage.getItem('user'));

    var sessionUser = userStorage.username;
    var sessionId = userStorage.id;
    var sessionStatus = userStorage.status;

    $('#counter').html(counter.count);
    $('#output').html(database.length - counter.count - 1);

    var start = 0;
    var cant = cantF;
    var end = cantF;

    var table = document.querySelector('#tableJ');

    var rows = (database.length - 1) / cant;

    if(Math.round(rows) < rows){
        rows = Math.round(rows) + 1;
    }

    table.innerHTML = "";

    for (let i = 0; i < rows; i++) {
        table.innerHTML += `<tr id="row${i}">`;
        var rowsAll = document.querySelector(`#row${i}`);
        for (let j = start; j < end; j++) {
            if(j >= database.length - 1){
                rowsAll.innerHTML += `<td></td>`;
            }else{
                rowsAll.innerHTML += `
                <td id="${database[j].id}" flag${database[j].id}="${database[j].flag}" class="text-center buttons">${database[j].id}</td>
            `;
            }
        }
        table.innerHTML += `</tr>`;
        start += cant;
        end += cant;
    }

    sheets = database;

    function update(){
        database.forEach(d => {
            if($(`#${d.id}`).attr(`flag${d.id}`) === "false"){
                $(`#${d.id}`).addClass('buttonClick');
            }
            else{
                $(`#${d.id}`).removeClass('buttonClick');
            }
        });
    }

    update();

    var mouseIsDown = false;

    async function selectSheets(i){
        if($(`#${sheets[i].id}`).attr(`flag${sheets[i].id}`) === "true"){
            $(`#${sheets[i].id}`).addClass('buttonClick');
            sheets[i].flag = false;
            sheets[i].status = 1;
            sheets[i].validate = false;
            sheets[database.length - 1].count += 1;
            $(`#${sheets[i].id}`).attr(`flag${sheets[i].id}`, "false");
        }
        else{
            $(`#${sheets[i].id}`).removeClass('buttonClick');
            sheets[i].flag = true;
            sheets[i].status = 0;
            sheets[i].validate = true;
            sheets[database.length - 1].count -= 1;
            $(`#${sheets[i].id}`).attr(`flag${sheets[i].id}`, "true")
        }
        if(counter.count < 0){
            sheets[database.length - 1].count = 0;
        }
        localStorage.setItem('sheets',JSON.stringify(sheets));
        $('#counter').html(sheets[database.length - 1].count);
        $('#sheetsTxtLogout').html(sheets[database.length - 1].count);
        $('#output').html(database.length - sheets[database.length - 1].count - 1);
        $('#sheets2TxtLogout').html(database.length - sheets[database.length - 1].count - 1);
    }

    for (let i = 0; i < sheets.length - 1; i++) {
        $(`#${sheets[i].id}`).mousedown(() => {mouseIsDown = true});
        $(`#${sheets[i].id}`).mouseup(() => {mouseIsDown = false});
        $(`#${sheets[i].id}`).mousedown(() => {
            selectSheets(i);
        });
        $(`#${sheets[i].id}`).mouseover(() => {
            if(mouseIsDown){
                selectSheets(i);
            }
        });
    };

    $('#removeAll').click(() => {

        if(!internetFlag){
            $('#deleteText').html("No hay internet, se está eliminando solo la Tabla");
            internetAlert();
            return false;
        }

        Swal.fire({
            title: 'Estás seguro(a)?',
            html: `
                <div class="d-flex justify-content-center align-items-center flex-column">
                    <p class="m-0">Se eliminarán todos los datos de la Tabla!</p>
                    <div class="form-check mt-2" id="checkDatabaseBox">
                        
                    </div>
                </div>
            `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, Eliminar!',
            cancelButtonText: 'Cancelar!'
        }).then(async (result) => {
            if (result.isConfirmed) {

                var checked = $('#removeDatabaseCheck').prop('checked')

                sheets = database;
                var sheetsRemove = {};
                for (let i = 0; i < sheets.length - 1; i++) {
                    sheets[i].flag = true;
                    sheets[i].status = 0;
                    sheets[i].validate = false;
                    $(`#${sheets[i].id}`).removeClass('buttonClick');
                    $(`#${sheets[i].id}`).attr(`flag${sheets[i].id}`, "true");
                    sheetsRemove[i] = sheets[i];
                }
                sheets[database.length - 1].count = 0;
                localStorage.setItem('sheets',JSON.stringify(sheets));
                $('#counter').html(sheets[database.length - 1].count);
                $('#output').html(database.length - sheets[database.length - 1].count - 1);
                $('#sheetsTxtLogout').html(sheets[database.length - 1].count);
                $('#sheets2TxtLogout').html(database.length - sheets[database.length - 1].count - 1);

                if(checked){
                    const getValues = await getDocs(collection(db, `values${sessionId}`));
                    var id = "";

                    if (getValues.size > 0) {
                        Swal.fire({
                            title: 'Eliminando',
                            text: `Se está eliminando la Tabla y la Base de datos...`,
                            allowOutsideClick: false,
                            didOpen: () => {
                                Swal.showLoading();
                            }
                        });
                        getValues.forEach(doc => {
                            id = doc.id;
                        });
                        const docRef = await doc(db, `values${sessionId}`, `${id}`);
                        await updateDoc(docRef, sheetsRemove);
                    }
                }

                Swal.fire({
                    title: 'Eliminado!',
                    html : 'Información eliminada satisfactoriamente!',
                    icon : 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
            }

        });

        if(sessionStatus === 1){
            $('#checkDatabaseBox').html(`
                <input class="form-check-input" type="checkbox" value="" id="removeDatabaseCheck" checked="">
                <label class="form-check-label" for="removeDatabaseCheck">
                    Reestablecer Base de Datos
                </label>
            `);
        }else{
            $('#checkDatabaseBox').remove();
        }

    });

    function download(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
    
        element.style.display = 'none';
        document.body.appendChild(element);
    
        element.click();
    
        document.body.removeChild(element);
    }

    $('#downloadButton').click(() => {
        download("Database.txt", JSON.stringify(database));
    });

    var newDatabase = [];

    document.getElementById('inputfile').addEventListener('change', function() { 
        var fr=new FileReader();
        fr.onload=function(){
            try {
                newDatabase = JSON.parse(fr.result);
                counter = newDatabase[newDatabase.length - 1];
                for(let i = 0; i < newDatabase.length - 1; i++){

                    // ---------------------------------------------

                    newDatabase[i].validate = false;
                    if(newDatabase[i].flag === false){
                        newDatabase[i].status = 1;
                    }else{
                        newDatabase[i].status = 0;
                    }

                    // ---------------------------------------------

                    $(`#${newDatabase[i].id}`).attr(`flag${newDatabase[i].id}`, newDatabase[i].flag);
                    if($(`#${newDatabase[i].id}`).attr(`flag${newDatabase[i].id}`) === "false"){
                        $(`#${newDatabase[i].id}`).addClass('buttonClick');
                    }
                    else{
                        $(`#${newDatabase[i].id}`).removeClass('buttonClick');
                    }
                }
                localStorage.setItem('sheets',JSON.stringify(newDatabase));
                $('#counter').html(counter.count);
                $('#output').html(newDatabase.length - counter.count - 1);
                $('#sheetsTxtLogout').html(counter.count);
                $('#sheets2TxtLogout').html(newDatabase.length - counter.count - 1);
                Swal.fire({
                    title : 'Información Compatible',
                    text: 'Datos importados correctamente',
                    icon : 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
                sheets = newDatabase;
            } catch (e) {
                Swal.fire({
                    title: 'Archivo no Válido',
                    text : 'Elige un archivo compatible!',
                    icon : 'error',
                    timer: 2000,
                    showConfirmButton: false
                });
            }
        }   
        fr.readAsText(this.files[0]);

    });

    $('#toInput').attr('placeholder', database.length - 1);

    var radioType = document.getElementsByName('inputType');

    var typeFlag = true;

    radioType.forEach(e => {
        $(e).change(() => {
            if (e.value === '1') {
                $('#rangeForm').removeClass('d-none');
                $('#numbersForm').addClass('d-none');
                typeFlag = true;
            }else{
                $('#rangeForm').addClass('d-none');
                $('#numbersForm').removeClass('d-none');
                typeFlag = false;
            }
            $('#fromInput').val("");
            $('#toInput').val("");
            $('#numbersFInput').val("");
            $('#fromInput').removeClass('is-invalid');
            $('#toInput').removeClass('is-invalid');
        })
    });

    $("#numbersFInput").on('input', function() { 
        var value=$(this).val().replace(/[^0-9.,]*/g, '');
        value=value.replace(/\.{2,}/g, ',');
        value=value.replace(/\.,/g, ',');
        value=value.replace(/\,\./g, ',');
        value=value.replace(/\,{2,}/g, ',');
        value=value.replace(/\.[0-9]+\./g, ',');
        value=value.replace('.', ',');
        $(this).val(value)
    });

    function rangeInput(text){
        $(String(text)).on('input', function() { 
            var value=$(this).val().replace(/[^0-9.,]*/g, '');
            value=value.replace(/\.{2,}/g, '');
            value=value.replace(/\.,/g, '');
            value=value.replace(/\,\./g, '');
            value=value.replace(/\,{2,}/g, '');
            value=value.replace(/\.[0-9]+\./g, '');
            value=value.replace('.', '');
            value=value.replace(',', '');
            $(this).val(value)
        });
    }

    rangeInput("#fromInput");
    rangeInput("#toInput");

    function check(){
        var fromA = 0;
        var toA = 0;
        var fromInputA = $('#fromInput');
        var toInputA = $('#toInput');
        if (fromInputA.val() === "" || fromInputA.val() <= 0) {
            fromA = 0;
        }else{
            fromA = fromInputA.val() - 1;
        }
        if (toInputA.val() === "" || toInputA.val() > (database.length - 1)) {
            toA = database.length - 2;
        }else{
            toA = toInputA.val() - 1;
        }
        if(fromA > toA){
            fromInputA.addClass('is-invalid');
            toInputA.addClass('is-invalid');
        }else{
            fromInputA.removeClass('is-invalid');
            toInputA.removeClass('is-invalid');
        }
    }

    $('#fromInput').keyup(() => {
        check();
    });

    $('#toInput').keyup(() => {
        check();
    });

    var numbersKeyUp = [];

    $('#newSendBtn').click(() => {
        if(typeFlag){
            var from = 0;
            var to = 0;
            var fromInput = $('#fromInput');
            var toInput = $('#toInput');
            if (fromInput.val() === "" || fromInput.val() <= 0) {
                from = 0;
            }else{
                from = fromInput.val() - 1;
            }
            if (toInput.val() === "") {
                to = database.length - 2;
            }else{
                to = toInput.val() - 1;
            }
            if(from > to){
                fromInput.focus();
                return false;
            }
            if(to > database.length - 2){
                Swal.fire({
                    title: 'Cantidad Inválida',
                    text : `Debes insertar valores menor o iguales a ${database.length - 1}`,
                    icon : 'error',
                    timer: 2000,
                    showConfirmButton: false
                });
                return false;
            }
            for (let i = from; i <= to; i++) {
                selectSheets(i);
            }
            fromInput.val("");
            toInput.val("");
        }else{
            var numbersFInput = $('#numbersFInput');
            var numbers = [];
            if(numbersFInput.val() === ""){
                numbers = [0];
            }else{
                var numbersArray = String(numbersFInput.val()).split(',');
                if(numbersFInput.val()[numbersFInput.val().length - 1] === ','){
                    numbersArray.splice((numbersArray.length - 1),1);
                }else if(numbersFInput.val()[0] === ','){
                    numbersArray.splice(0,1);
                }
                numbers = numbersArray;
                numbersKeyUp = numbers;
            }
            for (let i = 0; i < numbers.length; i++) {
                if(numbers[i] > database.length - 1){
                    Swal.fire({
                        title: 'Cantidad Inválida',
                        text : `Debes insertar valores menor o iguales a ${database.length - 1}`,
                        icon : 'error',
                        timer: 2000,
                        showConfirmButton: false
                    });
                    return false;
                }
                selectSheets(numbers[i] - 1);
                numbersFInput.val("");
            }
        }
        $('#newForm').modal('hide');
    });

    var newFormModal = document.getElementById('newForm');
    newFormModal.addEventListener('hidden.bs.modal', function () {
        $('#fromInput').val("");
        $('#toInput').val("");
        $('#numbersFInput').val("");
        if (window.innerWidth > 1024) {
            $('body').css({'overflow-y' : 'hidden'});
        }
    });

    var loginModal = document.getElementById('loginModal');
    loginModal.addEventListener('hidden.bs.modal', function () {
        if (window.innerWidth > 1024) {
            $('body').css({'overflow-y' : 'hidden'});
        }
    });

    var logoutModal = document.getElementById('logoutModal');
    logoutModal.addEventListener('hidden.bs.modal', function () {
        if (window.innerWidth > 1024) {
            $('body').css({'overflow-y' : 'hidden'});
        }
    });
    
    var sheetsFire = {};

    // Login

    var showFlag = true;

    $('#showPassLogin').click(() => {
        if(showFlag){
            $('#loginPass').attr('type','text');
            $('#showPassLogin').html('<i class="fa fa-eye-slash"></i>');
            showFlag = false;
        }else{
            $('#loginPass').attr('type','password');
            $('#showPassLogin').html('<i class="fa fa-eye"></i>');
            showFlag = true;
        }
    });

    async function syncAllData(){

        if(!internetFlag){
            $('#deleteText').html("No hay internet, se está eliminando solo la Tabla");
            internetAlert();
            return false;
        }

        database = JSON.parse(localStorage.getItem('sheets'));
        sheets = database;
        Swal.fire({
            title: 'Obteniendo datos del Servidor',
            html: 'Cargando...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading()
            }
        });
        var getValues = await getDocs(collection(db, `values${sessionId}`));
        var id = "";
        Swal.close();
        if(getValues.size === 0){
            Swal.fire({
                title: 'Insertando Datos',
                html: `Espere Por Favor...`,
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading()
                }
            });
            for (let i = 0; i <= elements - 1; i++) {
                sheetsFire[i] = database[i];
            }
            sheetsFire[elements] = {counter: countAll};
            await setDoc(doc(collection(db, `values${sessionId}`)), sheetsFire);
            Swal.close();
            console.log('All Inserted!');
        }else{
            console.log('All Updated!');
        }

        getValues = await getDocs(collection(db, `values${sessionId}`));

        getValues.forEach(doc => {
            id = doc.id;
        });

        const docRef = await doc(db, `values${sessionId}`, `${id}`);
        const docSnap = await getDoc(docRef);

        Swal.fire({
            title: 'Actualizando Datos',
            html: `Espere Por Favor...`,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading()
            }
        });

        var sheetsFire2 = {};

        var flagAll = false;

        if (docSnap.exists()) {
            sheetsFire2 = docSnap.data();
            for (let i = 0; i < database.length - 1; i++) {
                if(database[i].status === 1 && sheetsFire2[i].status === 0  && database[i].validate === false && sheetsFire2[i].validate === false){
                    console.log('1');
                    sheetsFire2[i].flag = database[i].flag;
                    sheetsFire2[i].status = database[i].status;
                    sheetsFire2[i].validate = database[i].validate;
                    flagAll = true;
                }
                
                if(database[i].status === 0 && sheetsFire2[i].status === 1 && sheetsFire2[i].validate === false && database[i].validate === false || database[i].status === 1 && sheetsFire2[i].status === 0 && database[i].validate === false && sheetsFire2[i].validate === true || database[i].status === 0 && sheetsFire2[i].status === 1 && database[i].validate === true && sheetsFire2[i].validate === false){
                    console.log('2');
                    flagAll = false;
                    sheets[i] = sheetsFire2[i];
                    selectSheets(i);
                }

                if(database[i].status === 0 && sheetsFire2[i].status === 1 && database[i].validate === true && sheetsFire2[i].validate === false){
                    console.log('3');
                    sheetsFire2[i].flag = database[i].flag;
                    sheetsFire2[i].status = database[i].status;
                    sheetsFire2[i].validate = database[i].validate;
                    flagAll = true;
                }
            }
            if(flagAll){
                sheetsFire2[database.length - 1].counter = database[database.length - 1].count;
                await updateDoc(docRef, sheetsFire2);
            }

            $('#output').html(sheets.length - database[database.length - 1].count - 1);
            $('#sheets2TxtLogout').html(sheets.length - database[database.length - 1].count - 1);

            Swal.close();
            console.log('Datos Actualizados');
        } else {
        console.log("No such document!");
        return false;
        }
    
    };

    $('#loginForm').submit(async e => {
        e.preventDefault();

        var loginEmail = $('#loginEmail');
        var loginPass = $('#loginPass');
        var userId = "";

        if(!internetFlag){
            internetAlert();
            loginEmail.removeClass('is-invalid');
            loginEmail.removeClass('is-valid');
            loginPass.removeClass('is-invalid');
            return false;
        }

        if(loginEmail.val() === ""){
            loginEmail.addClass("is-invalid");
            $('#errorMessageUser').html("Escribe un Nombre de Usuario!");
            loginEmail.focus();
            return false;
        }

        Swal.fire({
            title: 'Comprobando Datos',
            html: `Espere Por Favor...`,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading()
            }
        });

        const q = query(collection(db, "users"), where("username", "==", loginEmail.val()));

        const querySnapshot = await getDocs(q);

        Swal.close();

        if(querySnapshot.size > 0){
            var pass = "";
            loginEmail.removeClass("is-invalid");
            loginEmail.addClass("is-valid");
            querySnapshot.forEach((doc) => {
                userId = doc.id;
                pass = doc.data().password;
            });

            
            // var encryptedPass = CryptoJS.AES.encrypt(loginPass.val(), "Secret Passphrase");
            var decryptedPass = CryptoJS.AES.decrypt(pass, "Secret Passphrase").toString(CryptoJS.enc.Utf8);

            if(loginPass.val() != 0){
                if(decryptedPass === loginPass.val()){
                    loginEmail.removeClass("is-invalid");
                    loginEmail.removeClass("is-valid");
                    loginPass.removeClass("is-invalid");
                    user = {id: userId, username: loginEmail.val(), status: 1};
                    localStorage.setItem("user", JSON.stringify(user));

                    console.log('Inicio de Sesión Exitoso!');

                    Swal.fire({
                        title: `<p class="text-capitalize">bienvenido ${loginEmail.val()}!</p>`,
                        html : 'Inicio de Sesión Exitoso!',
                        icon : 'success',
                        timer: 2000,
                        showConfirmButton: false
                    });

                    userBtn();

                    loginEmail.val("");
                    loginPass.val("");
                    $('#loginModal').modal('hide');

                }else{
                    loginPass.addClass("is-invalid");
                    $('#errorMessagePass').html("Contraseña Incorrecta!");
                }
            }else{
                loginPass.addClass("is-invalid");
                $('#errorMessagePass').html("Escribe una Contraseña!");
                loginPass.focus();
            }

        }else{
            loginEmail.addClass("is-invalid");
            $('#errorMessageUser').html("El Usuario no Existe!");
        }

    });

    $('#loginEmail').keyup(() => {
        $('#loginEmail').removeClass("is-invalid");
        $('#loginEmail').removeClass("is-valid");
    });

    $('#loginPass').keyup(() => {
        $('#loginPass').removeClass("is-invalid");
    });

    function userBtn(){
        userStorage = JSON.parse(localStorage.getItem('user'));
        sessionUser = userStorage.username;
        sessionId = userStorage.id;
        sessionStatus = userStorage.status;
        if(sessionStatus === 1){

            $('#userTxtLogout').html(sessionUser);
            $('#sheetsTxtLogout').html(sheets[database.length - 1].count);
            $('#sheets2TxtLogout').html(database.length - sheets[database.length - 1].count - 1);

            $('#loginBtn').remove();

            $('body').append(`
                <div class="position-absolute" id="logoutBtn" style="right:10px; top: 10px;">
                    <button class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#logoutModal" style="border: 3px solid white; width: 50px; height: 50px; border-radius: 100%; box-shadow: 0 0 10px 1px rgba(0,0,0,0.8);">
                        <i class="fa fa-sign-out"></i>
                    </button>
                </div>
            `);

            $('#syncButton').append(`
                <button class="btn btn-info hvr-icon-spin" id="dbSync"><i class="fa fa-refresh hvr-icon"></i> Sincronizar</button>
            `);

            $('#dbSync').click(() => {
                syncAllData();
            });

        }else{
            $('#logoutBtn').remove();
            $('body').append(`
                <div class="position-absolute" id="loginBtn" style="right:10px; top: 10px;">
                    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#loginModal" style="border: 3px solid white; width: 50px; height: 50px; border-radius: 100%; box-shadow: 0 0 10px 1px rgba(0,0,0,0.8);">
                        <i class="fa fa-user"></i>
                    </button>
                </div>
            `);
            $('#syncButton').html("");
        }
    }

    userBtn();

    $('#logoutFinalBtn').click(() => {
        if(!internetFlag){
            internetAlert();
            return false;
        }

        Swal.fire({
            title: 'Deseas Cerrar tu Sesión Actual?',
            text: "Recuerda Sincronizar tus Datos antes de hacerlo, de lo contrario, los cambios realizados se perderán!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, Cerrar Sesión!',
            cancelButtonText: 'Cancelar!'
        }).then(async (result) => {
            if (result.isConfirmed) {

                user = {id: '', username: '', status: 0};
                localStorage.setItem('user', JSON.stringify(user));
                $('#logoutModal').modal('hide');
                userBtn();

                sheets = database;
                var sheetsRemove = {};
                for (let i = 0; i < sheets.length - 1; i++) {
                    sheets[i].flag = true;
                    sheets[i].status = 0;
                    sheets[i].validate = false;
                    $(`#${sheets[i].id}`).removeClass('buttonClick');
                    $(`#${sheets[i].id}`).attr(`flag${sheets[i].id}`, "true");
                    sheetsRemove[i] = sheets[i];
                }
                sheets[database.length - 1].count = 0;
                localStorage.setItem('sheets',JSON.stringify(sheets));
                $('#counter').html(sheets[database.length - 1].count);
                $('#output').html(database.length - sheets[database.length - 1].count - 1);
                $('#sheetsTxtLogout').html(sheets[database.length - 1].count);
                $('#sheets2TxtLogout').html(database.length - sheets[database.length - 1].count - 1);

                Swal.fire({
                    title: 'Sesión Cerrada!',
                    html : 'Ahora no podrás sincronizar tus datos en la Nube!',
                    icon : 'success',
                    timer: 2000,
                    showConfirmButton: false
                });
            }

        });

    });

}