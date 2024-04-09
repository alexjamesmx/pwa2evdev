function __vite__mapDeps(indexes) {
  if (!__vite__mapDeps.viteFileDeps) {
    __vite__mapDeps.viteFileDeps = ["assets/ListImages-D6l8X2Xa.js","assets/index-ULVKM2Ck.js","assets/index-BlJ5S-Ag.css"]
  }
  return indexes.map((i) => __vite__mapDeps.viteFileDeps[i])
}
import{r as s,_ as n,I as d,j as e}from"./index-ULVKM2Ck.js";const m=s.lazy(()=>n(()=>import("./ListImages-D6l8X2Xa.js"),__vite__mapDeps([0,1,2]))),x=()=>{const{storedImages:a,s_loading:t,setStoredImages:o,page:r,setPage:i}=s.useContext(d);return e.jsx("div",{className:"container mx-auto py-8",children:t?e.jsx("p",{children:"Loading images..."}):e.jsx(s.Suspense,{fallback:e.jsx("div",{children:"Loading..."}),children:e.jsx(m,{images:a,setImages:o,page:r,setPage:i})})})};export{x as default};
