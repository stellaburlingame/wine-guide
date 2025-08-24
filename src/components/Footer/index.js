import React from "react";
import { Link } from "react-router-dom";

function Index(props) {
    return (
        <main className="footer col-lg-8 mx-auto p-3 py-md-5">
            <footer className="pt-5 my-5 text-muted border-top">
                Created by Daniel Vasquez 2022 | <Link to="/credits">Credits &amp; Sources</Link>
            </footer>
        </main>
    );
}

export default Index;