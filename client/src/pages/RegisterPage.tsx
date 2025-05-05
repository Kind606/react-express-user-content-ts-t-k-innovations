import RegisterForm from "../components/auth/RegisterForm";

function RegisterPage() {
  return (
    <div className="register-page">
      <h1>Register</h1>
      <p>Create a new account to start sharing content.</p>
      <RegisterForm />
    </div>
  );
}

export default RegisterPage;
