export function NotFound() {

    function randomImage() {

        const images = ["cement_mixer.gif", "eddsworld_cement.gif", "spinning_1.gif", "spinning_2.gif", "what_cement_mixer_are_you.gif"]
        const num = Math.floor(Math.random() * images.length);

        return (
            <>
                <img src={images[num]} alt="logo" />
            </>
        )
    }

    return (
        <div className="container">
            {randomImage()}
            <h1>404 Not Found</h1>
            <p>The page you are looking for does not exist.</p>
        </div>
    );
}