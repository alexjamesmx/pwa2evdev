function __vite__mapDeps(indexes) {
  if (!__vite__mapDeps.viteFileDeps) {
    __vite__mapDeps.viteFileDeps = ["assets/ListImages-BzHHu9Ex.js","assets/index-BBJ5OlNa.js","assets/index-W6YkGZUF.css","assets/index.esm2017-DsPuRcLz.js","assets/index-CfA_VwZE.js","assets/ListImages-CsR6CyfR.css"]
  }
  return indexes.map((i) => __vite__mapDeps.viteFileDeps[i])
}
import{r as e,_ as i,j as s}from"./index-BBJ5OlNa.js";import{a as m}from"./axios-Cm0UX6qg.js";const d=e.lazy(()=>i(()=>import("./ListImages-BzHHu9Ex.js"),__vite__mapDeps([0,1,2,3,4,5]))),f=()=>{const[a,o]=e.useState([]),[c,r]=e.useState(!0);return e.useEffect(()=>{(async()=>{try{const n=await m.get("https://api.unsplash.com/photos/random?count=5&client_id=73m9zE9ivuue_6Dl-i9sqsRUJGDdTGs9upcq3MNDf4I");o(n.data),r(!1)}catch(t){console.error("Error fetching images:",t)}})()},[]),s.jsx("div",{className:"mt-1",children:c?s.jsx("p",{children:"Loading images..."}):s.jsx(e.Suspense,{fallback:s.jsx("div",{children:"Loading..."}),children:s.jsx(d,{images:a})})})};export{f as default};
