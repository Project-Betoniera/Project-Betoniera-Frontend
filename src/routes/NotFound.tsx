import "../assets/logo.svg";

export function NotFound() {
    return (
        <div className="container">
            <img src="logo.svg" alt="logo" />
            <h1>404 Not Found</h1>
            <p>The page you are looking for does not exist.</p>
        </div>
    );
}