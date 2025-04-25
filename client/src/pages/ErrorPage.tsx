import { useRouteError } from "react-router";

const ErrorPage = () => {
  const error = useRouteError();

  return (
    <div className="error-container">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error instanceof Error ? error.message : "Unknown error"}</i>
      </p>
    </div>
  );
};

export default ErrorPage;
