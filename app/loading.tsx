export default function Loading() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="hw-spinner" role="status" aria-label="Loading" />
    </div>
  );
}
