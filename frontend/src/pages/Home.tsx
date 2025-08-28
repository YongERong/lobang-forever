const Home = ({user}) => {
  return (
    user ? <>User</> : <p>No user</p>
  );
};

export default Home;
