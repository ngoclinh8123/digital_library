import * as React from "react";
import { lazy, useEffect, useState } from "react";
import { RecoilRoot, useRecoilState } from "recoil";
import { useLocale } from "ttag";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { localeSt } from "./states";
import PrivateRoute from "component/common/route/private_route.jsx";
import NotMatch from "component/common/route/not_match";
import ScrollToTop from "component/common/scroll_to_top";
import Waiting from "component/common/waiting";
import Spinner from "component/common/spinner";
import BlankLayout from "component/common/layout/blank";
import MainLayout from "component/common/layout/main";
import Util from "service/helper/util";
import LocaleUtil from "service/helper/locale_util";

Util.responseIntercept();
const lazyImport = (Component) => (props) => {
  return (
    <React.Suspense fallback={<Waiting />}>
      <Component {...props} />
    </React.Suspense>
  );
};

const Login = lazyImport(lazy(() => import("component/auth/login")));
const Profile = lazyImport(lazy(() => import("component/auth/profile")));
const Staff = lazyImport(lazy(() => import("component/staff")));
const Role = lazyImport(lazy(() => import("component/role")));
const Variable = lazyImport(lazy(() => import("component/variable")));
const Statistic = lazyImport(lazy(() => import("component/admin/statistic")));
const Book = lazyImport(lazy(() => import("component/book")));
const BookDetail = lazyImport(lazy(() => import("component/book_detail")));
const Category = lazyImport(lazy(() => import("component/category")));
const Author = lazyImport(lazy(() => import("component/author")));
const Rack = lazyImport(lazy(() => import("component/rack")));
const Manage = lazyImport(lazy(() => import("component/manage")));
const ManageDetail = lazyImport(lazy(() => import("component/manage_detail")));

function Index() {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [locale, setLocale] = useRecoilState(localeSt);
  useLocale(locale);
  useEffect(() => {
    LocaleUtil.fetchLocales().then(() => {
      setDataLoaded(true);
      setLocale(LocaleUtil.setLocale(locale));
    });
  }, []);
  if (!dataLoaded) {
    return <div>Loading...</div>;
  }
  return (
    <div key={locale}>
      <Spinner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/login" element={<BlankLayout />}>
            <Route path="/login/" element={<Login />} />
          </Route>
          <Route path="/" element={<PrivateRoute />}>
            <Route path="/" element={<MainLayout />}>
              <Route path="/statistics" element={<Statistic />} />
              <Route path="/members" element={<Staff />} />
              <Route path="/role" element={<Role />} />
              <Route path="/variable" element={<Variable />} />
              <Route path="/books" element={<Book />} />
              <Route path="/books/:id" element={<BookDetail />} />
              <Route path="/categories" element={<Category />} />
              <Route path="/authors" element={<Author />} />
              <Route path="/racks" element={<Rack />} />
              <Route path="/" element={<Manage />} />
              <Route path="/manages/:id" element={<ManageDetail />} />
            </Route>
          </Route>
          <Route path="*" element={<NotMatch />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

function App() {
  return (
    <RecoilRoot>
      <Index />
    </RecoilRoot>
  );
}

export default App;
