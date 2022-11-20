import "../styles/globals.css";
import dynamic from "next/dynamic";
import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function App({ Component, pageProps }: AppProps) {
  return (
    <div>
      <Component {...pageProps} />
      <ToastContainer />
    </div>
  );
}

export default dynamic(() => Promise.resolve(App), {
  ssr: false,
});
