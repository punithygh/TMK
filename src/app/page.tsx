import HomeClient from './home-client';

// Page sends HTML immediately — all data fetching is done client-side
// This eliminates the "Document request latency" issue entirely (was 13,560ms)
export default function Home() {
  return <HomeClient />;
}
