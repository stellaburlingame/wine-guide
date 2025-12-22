import React from "react";
import { Link, useLocation } from "react-router-dom";
import version from "../../version"

function Index(props) {
    const location = useLocation();
    const showVersion = location.pathname === "/credits";

    return (
        <main className="footer col-lg-8 mx-auto p-3 py-md-5">
            <footer className="pt-5 my-5 text-muted border-top">
                Created by Daniel Vasquez 2022-2025 | <Link to="/credits">Credits &amp; Sources</Link>
                {showVersion && (
                    <span className="text-center" style={{ marginTop: "2rem" }}>
                        {' | '}Version: {version}
                    </span>
                )}
            </footer>
        </main>
    );
}

export default Index;
