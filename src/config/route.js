import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../component/Pages/Login/Login";
import Header from "../component/common/Header/Header";
import Sidebar from "../component/common/Sidebar/Sidebar";
import Footer from "../component/common/Footer/Footer";
import Dashboard from "../component/Dashboard/Dashboard";
import Reports from "../component/Reports/Reports";
import Expenses from "../component/Expenses/Expenses";
import Category from "../component/Category/Category";
import Budget from "../component/Budget/Budget";
import { ThemeProvider } from "../component/ThemeContext";
const Layout = ({ children }) => {
    // return (
    //     <>
    //         <Header />
    //         <div className="page-content d-flex">
    //             <Sidebar />
    //             <div className="content-wrapper flex-grow-1">
    //                 <div className="content-inner p-3">{children}</div>
    //                 {/* <Footer /> */}
    //             </div>
    //         </div>
    //     </>
    // );
     return (
    <ThemeProvider>
      <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1">
          <Header />
            <div className="content-wrapper flex-grow-1">
                   <div className="content-inner p-3">{children}</div>
                    {/* <Footer /> */}
                 </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

const MainRoute = () => {
    return (
        <Router>
            <Routes>
                <Route
                    path="/login"
                    element={

                        <Login />

                    }
                />
                <Route
                    path="/dashboard"
                    element={
                        <Layout>
                            <Dashboard />
                        </Layout>
                    }
                />
                <Route
                    path="/reports"
                    element={
                        <Layout>
                            <Reports />
                        </Layout>
                    }
                />
                <Route
                    path="/expenses"
                    element={
                        <Layout>
                            <Expenses />
                        </Layout>
                    }
                />
                 <Route
                    path="/category"
                    element={
                        <Layout>
                            <Category />
                        </Layout>
                    }
                />
                 <Route
                    path="/budget"
                    element={
                        <Layout>
                            <Budget />
                        </Layout>
                    }
                />
            </Routes>
        </Router>
    );
};

export default MainRoute;
