export default function Layout({ children }) {
  return (
    <div className="display-flex">
      <div className="sidebar position-fixed">
        <h2>Sidebar</h2>
        {/* Add sidebar content here */}
      </div>
      <main>
        {children}
      </main>
    </div>
  );
}
