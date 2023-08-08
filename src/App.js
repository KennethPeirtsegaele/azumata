import React from "react";
import Tree from "./components/Tree";
import "./style/styles.css";

export default function App() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-center m-4">
        Created by{" "}
        <a href="https://kennethpeirtsegaele.be/" target="_black" className="hover:text-slate-400	">
          Kenneth Peirtsegaele
        </a>
      </h1>
      <Tree />
    </div>
  );
}
