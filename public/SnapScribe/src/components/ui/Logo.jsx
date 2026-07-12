import { memo } from "react";

const Logo = memo(() => {
  return (
    <div className="logo-wrap">
      <img src="./logo.webp" alt="SnapScribe logo" className="logo-img" />
      <div className="logo-text-wrap">
        <h1 className="logo-title">SnapScribe</h1>
        <p className="logo-tagline">AI-powered caption magic</p>
      </div>
    </div>
  );
});

export default Logo;
