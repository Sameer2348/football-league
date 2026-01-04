// Firebase config
const firebaseConfig={apiKey:"YOUR_KEY",authDomain:"YOUR_DOMAIN",projectId:"YOUR_PROJECT_ID"};
firebase.initializeApp(firebaseConfig);
const auth=firebase.auth();const db=firebase.firestore();
function login(role){
 auth.signInAnonymously().then(r=>{
  db.collection("users").doc(r.user.uid).set({role,created:Date.now()});
  localStorage.setItem("role",role);
  location.href="dashboard.html";
 });
}
function logout(){auth.signOut();localStorage.clear();location.href="index.html";}
function initDashboard(){
 const role=localStorage.getItem("role");
 document.getElementById("roleText").innerText="Role: "+role;
 db.collection("matches").onSnapshot(s=>{
  let h="";
  s.forEach(d=>{
   const m=d.data();
   h+=`<div class='card'>${m.teamA} ${m.scoreA}-${m.scoreB} ${m.teamB}<br>${m.status}</div>`;
  });
  document.getElementById("matches").innerHTML=h;
 });
}
function createMatch(){
 db.collection("matches").add({teamA:"FC Alpha",teamB:"FC Beta",scoreA:0,scoreB:0,status:"LIVE",time:Date.now()});
}
function finishMatch(){
 db.collection("matches").orderBy("time","desc").limit(1).get().then(s=>{
  s.forEach(d=>d.ref.update({scoreA:Math.floor(Math.random()*5),scoreB:Math.floor(Math.random()*5),status:"FINISHED"}));
 });
}
let wallet=JSON.parse(localStorage.getItem("wallet"))||{coins:0};
function earnCoins(){wallet.coins+=100;localStorage.setItem("wallet",JSON.stringify(wallet));showWallet();}
function showWallet(){const e=document.getElementById("coins");if(e)e.innerText=wallet.coins;}
async function connectWallet(){
 if(!window.ethereum)return alert("Install MetaMask");
 const a=await ethereum.request({method:"eth_requestAccounts"});
 alert("Connected: "+a[0]);
}
function convertCrypto(){alert("Converted (demo)");}
function initAdmin(){
 db.collection("matches").get().then(s=>document.getElementById("totalMatches").innerText=s.size);
 db.collection("users").get().then(s=>document.getElementById("totalUsers").innerText=s.size);
}
function verifyLastMatch(){
 db.collection("matches").orderBy("time","desc").limit(1).get().then(s=>{
  s.forEach(d=>d.ref.update({verified:true}));
 });
}