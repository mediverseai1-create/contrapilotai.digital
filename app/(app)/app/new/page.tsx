import Link from 'next/link';
import { NewReviewForm } from './NewReviewForm';

export default function NewReviewPage() {
  return (
    <>
      <div className="app-header">
        <div>
          <div className="breadcrumb">
            <Link href="/app">Dashboard</Link>
            <span className="sep">/</span>New review
          </div>
          <h1 style={{ marginTop: 8 }}>Review a contract</h1>
        </div>
      </div>

      <NewReviewForm />
    </>
  );
}
