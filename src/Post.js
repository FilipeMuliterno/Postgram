import { db } from './firebase.js';
import { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import swal from 'sweetalert';

function Post(props) {

    const [comentarios, setComentarios] = useState([]);

    useEffect(() => {
        db.collection('posts').doc(props.id).collection('comentarios').orderBy('timestamp', 'asc').onSnapshot(function (snapshot) {
            setComentarios(snapshot.docs.map(function (document) {
                return { id: document.id, info: document.data() }
            }))
        })
    })

    function comentar(id, e) {
        e.preventDefault();

        let comentarioAtual = document.querySelector('#comentario-' + id).value;

        db.collection('posts').doc(id).collection('comentarios').add({
            nome: props.user,
            comentario: comentarioAtual,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })

        swal("Comentário enviado!", "Seu comentário foi enviado com sucesso!", "success")

        document.querySelector('#comentario-' + id).value = "";
    }



    return (
        <div className='postSingle'>
            <div className="imgClass"><img alt='Foto da publicação.' src={props.info.image} /></div>
            <div className='title-post'><p><b className='user-name'>{props.info.userName}</b>: {props.info.titulo}</p></div>
            <div className='coments'>
                <h3>Comentários:</h3>
                <div id='scrollbar2' className='all-coments'>
                    {
                        comentarios.map(function (val) {
                            return (
                                <div className='coment-single'>
                                    <p><b>{val.info.nome}</b>: {val.info.comentario}</p>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            {
                (props.user) ?
                    <form onSubmit={(e) => comentar(props.id, e)}>
                        <textarea placeholder='Escreva um comentário...' id={"comentario-" + props.id}></textarea>
                        <input type='submit' value='Comentar' />
                    </form>
                    :
                    <div></div>
            }
        </div>
    )
}

export default Post;