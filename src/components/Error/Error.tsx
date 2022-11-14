import React from "react";
import { Link } from "react-router-dom";

interface ErrorProps {
  img: string;
  msg: string;
}

export const Error: React.FC<ErrorProps> = ({ img, msg }) => {
  return (
    <div>
      <img src={img} alt="Não encontrado" />
      <div>
        <h1>Oops!</h1>
        <span>{msg}</span>
        <Link to="/" className="ant-btn ant-btn-link">
          voltar
        </Link>
      </div>
    </div>
  );
};
