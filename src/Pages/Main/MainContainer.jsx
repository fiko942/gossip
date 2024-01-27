export default function MainContainer({ children }) {
  return (
    <div className="main-page-container min-w-full min-h-full max-h-full max-w-full overflow-hidden rounded-md relative">
      {children}
    </div>
  );
}
