import{r as s,U as x,u as m,j as e}from"./index-Cn4arxNs.js";import{g as j,d as f,c as v,a as C}from"./index.esm2017-CgHaIfis.js";const N=s.memo(()=>{var n;const{user:a}=s.useContext(x),{showCategory:t}=s.useContext(u),r=m(),[c,d]=s.useState([]);s.useEffect(()=>{(async()=>{try{const o=j(),l=a.uid,p=f(v(o,"images"),l),g=await C(p);if(g.exists()){const y=g.data()[t]||[];d([{category:t,images:y}])}}catch(o){console.error("Error checking saved status",o)}})()},[t,a]);const i=s.useMemo(()=>()=>r(`/library?category=${t}`),[r,t]);return e.jsx(e.Fragment,{children:e.jsx("div",{className:"library-preview-card",onClick:i,children:((n=c[0])==null?void 0:n.images.length)===0?e.jsx("div",{className:"d-flex justify-content-center",children:e.jsx("p",{children:"Nothing to show...yet! Create your first libraries."})}):c.map((h,o)=>e.jsx("div",{className:"category-card pointer",children:e.jsx("div",{className:"image-grid",children:h.images.splice(0,1).map(l=>e.jsx("div",{className:"library-container",children:e.jsx("img",{src:l.url,alt:"Saved"})},l.id))})},o))})})}),u=s.createContext(),F=()=>{const{user:a}=s.useContext(x),t=m(),[r,c]=s.useState("saved"),d=()=>{t("/editProfile")},i=n=>{c(n)};return console.log("showCategory",r),e.jsx(u.Provider,{value:{showCategory:r,toggleCategory:i},children:e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"perfil-header",children:e.jsxs("div",{className:"perfil-info",children:[e.jsx("img",{src:a.photoURL,alt:"Foto de perfil",className:"perfil-photo",style:{width:120,height:120}}),e.jsx("div",{className:"perfil-section",children:e.jsx("h3",{children:a.email})}),e.jsxs("div",{className:"perfil-section",children:[e.jsx("h3",{children:a.displayName}),e.jsx("button",{className:"bg-blue-gray-700 text-white p-3 rounded-full mt-3",onClick:d,children:"Editar perfil"})]})]})}),e.jsx("div",{className:"perfil-library",children:e.jsxs("div",{className:"perfil-section justify-content-center gap-5 flex",children:[e.jsx("h3",{className:`pointer ${r==="saved"?"underline text-blue-500":""}`,onClick:()=>i("saved"),children:"Saved"}),e.jsx("h3",{className:`pointer ${r!=="saved"?"text-blue-500 underline":""}`,onClick:()=>i("library"),children:"Library"})]})}),e.jsx(N,{})]})})};export{u as CategoryContext,F as default};
