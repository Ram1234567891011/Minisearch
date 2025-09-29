/* src/MiniSearchApp.jsx - MiniSearch React prototype */
import React, { useEffect, useMemo, useState, useRef } from "react";
import Fuse from "fuse.js";

const SAMPLE_DOCS = [
  { id: 1, title: "OpenAI — AI research", url: "https://openai.com", snippet: "We build safe and useful AI.", type: "web", safe: true },
  { id: 2, title: "React – JavaScript library", url: "https://reactjs.org", snippet: "React makes UIs easy.", type: "web", safe: true }
];

const fuseOptions = { includeScore: true, keys: ["title","snippet","url"], threshold:0.4, ignoreLocation:true };

export default function MiniSearchApp(){
  const [query,setQuery] = useState("");
  const [results,setResults] = useState([]);
  const fuse = useMemo(()=>new Fuse(SAMPLE_DOCS,fuseOptions),[]);

  function handleSearch(){
    if(!query.trim()){ setResults(SAMPLE_DOCS); return; }
    const r = fuse.search(query).map(r=>r.item);
    setResults(r);
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">MiniSearch</h1>
      <div className="flex gap-2">
        <input value={query} onChange={e=>setQuery(e.target.value)} className="border p-2 flex-1"/>
        <button onClick={handleSearch} className="bg-blue-600 text-white px-4">Search</button>
      </div>
      <ul className="mt-4">
        {results.map(r=>(<li key={r.id}><a href={r.url} className="text-blue-600">{r.title}</a></li>))}
      </ul>
    </div>
  );
}
