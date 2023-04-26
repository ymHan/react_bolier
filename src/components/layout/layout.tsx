import { ReactNode } from "react";
import Header from "./Header/Header"
import Footer from "./Footer/Footer"

const Layout = (props: {
  children: ReactNode
}) => {
  return (
    <div>
      <Header />
      <main>
        {props.children}
      </main>
      <Footer />
    </div>
  )
}

export default Layout
