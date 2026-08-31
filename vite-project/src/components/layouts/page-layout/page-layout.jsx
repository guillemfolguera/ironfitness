function PageLayout({ title, action, children }) {
  return (
    <section className="page">
      <header className="page-header">
        <h1>{title}</h1>
        {action}
      </header>
      {children}
    </section>
  );
}

export default PageLayout;
