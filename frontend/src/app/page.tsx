import HomeCategories from './HomeCategories';

// Full homepage composition and browse routing remain in #48/#50.
const Home = () => (
  <div className="py-10">
    <h1>ReDiCycle</h1>
    <p className="mt-2 text-body">someone&apos;s old, your new</p>
    <HomeCategories />
  </div>
);

export default Home;
