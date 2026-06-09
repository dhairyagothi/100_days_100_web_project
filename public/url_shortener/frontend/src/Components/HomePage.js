import HPnav from './HPnav'
import HPhero from './HPhero'
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { endpoints} from '../utils/api';


export default function HomePage() {

  const [user, setUser] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  useEffect(() => {
    const authCheck = async () => {
      try {
        const response = await fetch(endpoints.ME, {  // endpoints.ME ka API env and api.js main store hai
          credentials: "include"
        });

        if (!response.ok) {
          setIsLoggedIn(false);
          return;
        }

        const data = await response.json();
        setUser(data);
        setIsLoggedIn(true);

      } catch (err) {
        setIsLoggedIn(false);
      }
    };

    authCheck();
  }, []);

  return (
    <>
      <Helmet>
        <title> URL Shortener</title>

        <meta
          name="description"
  content="URL shortener, link shortener app, free URL shortener, secure link shortener, password protected links, link expiry tool, QR code generator online, custom short links, link management tool, URL analytics, modern URL shortener, App Nests, app ecosystem platform, smart link sharing, shorten links online" 
        />

        <meta
          name="keywords"
          content="URL shortener, link shortener, QR code generator, secure links, App Nests"
        />

        <meta name="author" content="Chandan Koranga" />

        <meta property="og:title" content="App Nests - Smart URL Shortener" />
        <meta
          property="og:description"
          content="Shorten, secure, and manage your links with App Nests."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://chandankoranga.in" />
      </Helmet>

       {/* UI module Below */}


      <HPnav status={isLoggedIn} />
      <HPhero User_name={user} status={isLoggedIn} />
    </>
  );
}