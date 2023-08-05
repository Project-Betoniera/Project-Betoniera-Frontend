export function NotFound() {
    function randomImage() {
        const num = Math.round(Math.random() * 4) + 1; // 1-5

        return (
            <>
                <img src={`404gifs/cement_mixer_${num}.gif`} alt="Not Found" />
            </>
        );
    }

    return (
        <div className="container">
            <div className="container wide">
                <h1>404 Not Found</h1>
                <p>The page you are looking for does not exist.</p>
            </div>
            <div className="container">
                {randomImage()}
            </div>
        </div>
    );
}