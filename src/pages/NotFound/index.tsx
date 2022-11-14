import React from "react";
import { PageTitle } from "../../components/common/PageTitle/PageTitle";
import { Error } from "../../components/Error/Error";
import error404 from "../../assets/images/error404.svg";

export default function NotFound() {
  return (
    <>
      <PageTitle>404</PageTitle>
      <Error img={error404} msg="Oops! Nada encontrado aqui" />
    </>
  );
}
