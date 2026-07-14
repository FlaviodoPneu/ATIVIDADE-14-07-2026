import { useState } from "react";

export default function App(){
 const [email,setEmail]=useState('admin@senac.com');
 const [senha,setSenha]=useState('123456');
 const [nome,setNome]=useState('');
 const [alunos,setAlunos]=useState([]);

 async function login(){
  const r=await fetch('http://localhost:3000/login',{
   method:'POST',headers:{'Content-Type':'application/json'},
   body:JSON.stringify({email,senha})
  });
  const d=await r.json();
  localStorage.setItem('token',d.token);
  alert('Login realizado');
 }

 async function listar(){
  const token=localStorage.getItem('token');
  const r=await fetch('http://localhost:3000/alunos',{headers:{Authorization:token}});
  const d=await r.json();
  setAlunos(d);
 }

 async function cadastrar(){
  const token=localStorage.getItem('token');
  await fetch('http://localhost:3000/alunos',{
   method:'POST',headers:{Authorization:token,'Content-Type':'application/json'},
   body:JSON.stringify({nome})
  });
  listar();
 }

 return (<div style={{padding:20}}>
 <h2>CRUD JWT UC14</h2>
 <button onClick={login}>Login</button><hr/>
 <input placeholder='Nome' value={nome} onChange={e=>setNome(e.target.value)} />
 <button onClick={cadastrar}>Cadastrar</button>
 <button onClick={listar}>Listar</button>
 <ul>{alunos.map(a=><li key={a.id}>{a.nome}</li>)}</ul>
 </div>);
}