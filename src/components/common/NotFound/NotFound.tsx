import React from "react";
import notFoundImg from "../../../assets/images/nothing-found.webp";

export const NotFound: React.FC = () => {
  return (
    <div
      style={{ display: "flex", alignItems: "center", flexDirection: "column" }}
    >
      <div>
        <img
          src={notFoundImg}
          alt="Nada por aqui"
          style={{ maxWidth: "10rem" }}
        />
      </div>
      <span>Nenhuma tarefa registrada</span>
    </div>
  );
};
