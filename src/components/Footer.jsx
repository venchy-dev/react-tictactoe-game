export default function Footer() {
    return (
        <footer className="footer">
            <p>
                © {new Date().getFullYear()} TicTacToe Game —
                <span> Built & Designed with React By <a href="https://envycode-project.my.id/" target="_blank">EnvyCode</a></span>
            </p>
        </footer>
    );
}
