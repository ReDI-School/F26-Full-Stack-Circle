import HomeCategories from './HomeCategories';

// Full homepage composition and browse routing remain in #48/#50.
const Home = () => (
  <main className="mx-auto max-w-285 px-5 py-10">
    <h1>ReDiCycle</h1>
    <p className="mt-2 text-body">someone&apos;s old, your new</p>
    <HomeCategories />
  </main>
);

export default Home;
