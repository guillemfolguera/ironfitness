import { LoginForm } from "../components/auth";

function LoginPage() {
  return (
    <section className="auth-page">
      <div className="auth-panel">
        <h1>Login</h1>
        <LoginForm />
      </div>
    </section>
  );
}

export default LoginPage;
