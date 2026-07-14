const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(cors());

const SECRET = "senac2026";

const usuario = { email: "admin@senac.com", senha: "123456" };

let alunos = [{ id: 1, nome: "João" }];

function autenticar(req,res,next){
 const token=req.headers.authorization;
 if(!token){return res.status(401).json({erro:'Token não enviado'});}
 try{ jwt.verify(token,SECRET); next(); }
 catch(e){ return res.status(401).json({erro:'Token inválido'}); }
}

app.post('/login',(req,res)=>{
 const {email,senha}=req.body;
 if(email===usuario.email && senha===usuario.senha){
  const token=jwt.sign({email},SECRET,{expiresIn:'1h'});
  return res.json({token});
 }
 return res.status(401).json({erro:'Login inválido'});
});

app.get('/alunos',autenticar,(req,res)=>res.json(alunos));

app.post('/alunos',autenticar,(req,res)=>{
 const novoAluno={id:Date.now(),nome:req.body.nome};
 alunos.push(novoAluno);
 res.status(201).json(novoAluno);
});

app.put('/alunos/:id',autenticar,(req,res)=>{
 const id=parseInt(req.params.id);
 const aluno=alunos.find(a=>a.id===id);
 if(!aluno) return res.status(404).json({erro:'Não encontrado'});
 aluno.nome=req.body.nome;
 res.json(aluno);
});

app.delete('/alunos/:id',autenticar,(req,res)=>{
 const id=parseInt(req.params.id);
 alunos=alunos.filter(a=>a.id!==id);
 res.json({mensagem:'Aluno removido'});
});

app.listen(3000,()=>console.log('Servidor na porta 3000'));