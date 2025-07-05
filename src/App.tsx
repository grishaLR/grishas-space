import { FC } from "react";
import { Layout } from "./components/common/Layout";
import { LandingPage } from "./components/common/LandingPage";

const App: FC = () => {
  return (
    <Layout>
      <LandingPage />
    </Layout>
  );
};

export default App;