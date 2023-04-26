import { useEffect, useState } from 'react';
import { auth, storage, db } from './firebase.js';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import swal from 'sweetalert';
function Header(props) {

  useEffect(() => {

  }, [])

  const [progress, setProgress] = useState(0);
  const [file, setFile] = useState(null);

  function criarConta(e) {
    e.preventDefault();
    let email = document.getElementById('email-cadastro').value;
    let username = document.getElementById('username-cadastro').value;
    let senha = document.getElementById('senha-cadastro').value;
    auth.createUserWithEmailAndPassword(email, senha)
      .then((authUser) => {
        authUser.user.updateProfile({
          displayName: username
        })
        swal("Conta criada!", "Sua conta foi registrada com sucesso!", "success")
        let modal = document.querySelector('.modalCriarConta');
        modal.style.display = "none";
      }).catch((error) => {
        swal("Oops", error.message, "error")
      })
      ;
  }

  function logar(e) {
    e.preventDefault();
    let email = document.getElementById('email-login').value;
    let senha = document.getElementById('senha-login').value;
    auth.signInWithEmailAndPassword(email, senha)
      .then((auth) => {
        props.setUser(auth.user.displayName);
        window.location.href = "/";
      }).catch((err) => {
        swal("Email ou senha incorretos.", "Email inexistente ou senha incorreta.", "error");
      })
  }

  function abrirModalCriarConta(e) {
    e.preventDefault();
    let modal = document.querySelector('.modalCriarConta');
    modal.style.display = "block";
  }

  function abrirModalUpload(e) {
    e.preventDefault();
    let modal = document.querySelector('.modalUpload');
    modal.style.display = "block";
  }

  function fecharModalCriar() {
    let modal = document.querySelector('.modalCriarConta');
    modal.style.display = "none";
  }

  function fecharModalUpload() {
    let modal = document.querySelector('.modalUpload');
    modal.style.display = "none";
  }

  function deslogar(e) {
    e.preventDefault();
    auth.signOut().then(function (val) {
      props.setUser(null);
      window.location.href = "/";
    })
  }

  function uploadPost(e) {
    e.preventDefault();
    let tituloPost = document.getElementById('titulo-upload').value;

    const uploadTask = storage.ref(`images/${file.name}`).put(file);

    uploadTask.on("state_changed", function (snapshot) {
      const progress = Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setProgress(progress);
    }, function (error) {

    }, function () {

      storage.ref("images").child(file.name).getDownloadURL()
        .then(function (url) {
          db.collection('posts').add({
            titulo: tituloPost,
            image: url,
            userName: props.user,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
          })

          setProgress(0);
          setFile(null);

          swal("Publicação enviada!", "Sua publicação foi enviada com sucesso!", "success")

          document.getElementById('form-upload').reset();

          fecharModalUpload();

        })

    })
  }

  function navBar() {
    var element11 = document.querySelector("#navbar");
    element11.classList.toggle("open");
    var element22 = document.querySelector("#line1");
    element22.classList.toggle("l1");
    var element33 = document.querySelector("#line2");
    element33.classList.toggle("l2");
    var element44 = document.querySelector("#line3");
    element44.classList.toggle("l3");
  }

  return (
    <div className='header'>

      <div className='modalCriarConta'>
        <div className='formCriarConta'>
          <div onClick={() => fecharModalCriar()} className='close-modal-criar'>x</div>
          <h2>Criar Conta</h2>
          <form onSubmit={(e) => criarConta(e)}>
            <input id='email-cadastro' type='text' placeholder='Seu e-mail...' />
            <input id='username-cadastro' type='text' placeholder='Seu username...' />
            <input id='senha-cadastro' type='password' placeholder='Sua senha...' />
            <input type='submit' value='Criar Conta' />
          </form>
        </div>
      </div>

      <div className='modalUpload'>
        <div className='formUpload'>
          <div onClick={() => fecharModalUpload()} className='close-modal-criar'>x</div>
          <h2>Fazer Upload</h2>
          <form id='form-upload' onSubmit={(e) => uploadPost(e)}>
            <progress id='progress-upload' value={progress}></progress>
            <input id='titulo-upload' type='text' placeholder='Nome da sua foto...' />
            <input onChange={(e) => setFile(e.target.files[0])} type='file' name='file' accept="image/*" />
            <input type='submit' value='Publicar' />
          </form>
        </div>
      </div>

      <div className='center'>
        <div className='header_logo'>
          <a className='logo' href='/#'>Postgram</a>
        </div>


        {
          (props.user) ?
            <div className='header_logadoInfo'>
              <div className='div-post'>
                <span>Olá, <b>{props.user}</b></span>
                <div>
                <a onClick={(e) => abrirModalUpload(e)} href='/#'>Postar</a>
                <a href='/#' onClick={(e) => deslogar(e)}>Deslogar</a>
                </div>
              </div>
            </div>
            :
            <div className='normal-bar'>
              <div className='navbar-open'>
                <div className="mobile-menu" onClick={navBar}>
                  <div id="line1" className="line1"></div>
                  <div id="line2" className="line2"></div>
                  <div id="line3" className="line3"></div>
                </div>
              </div>
              <div className='header_loginForm nav-bar' id='navbar'>
                <form onSubmit={(e) => logar(e)}>
                  <div className='header-div'>
                    <input id='email-login' type='text' placeholder='Email...' />
                    <input id='senha-login' type='password' placeholder='Senha...' />
                  </div>
                  <input type='submit' name='acao' value='Logar' />
                </form>
                <div className='btn_criarConta'>
                  <a onClick={(e) => abrirModalCriarConta(e)} href='/#'>Criar Conta</a>
                </div>
              </div>
            </div>
        }

      </div>
    </div>
  )
}

export default Header;