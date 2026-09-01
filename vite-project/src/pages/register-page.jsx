import { RegisterForm } from "../components/auth";

function RegisterPage() {
  return (
    <section className="auth-page">
      <div className="auth-panel register-panel">
        <h1>Register</h1>
        <RegisterForm />
      </div>
    </section>
  );
}

export default RegisterPage;
