import React, { useEffect } from "react";
import "./style.css";

const ScrollSpy = () => {
    useEffect(() => {
        const navLi = document.querySelectorAll("nav ul li a");
        const sections = document.querySelectorAll("div.sec");

        window.addEventListener("scroll", () => {
            let current = "";
            sections.forEach((div) => {
                let sectionTop = div.offsetTop;
                if (scrollY >= sectionTop - 65) {
                    current = div.getAttribute("id");
                }
            });
            navLi.forEach((li) => {
                li.classList.remove("active");
                document.querySelector("nav ul li a[href*= " + current + "]").classList.add("active");
            });
        });
    }, []);

    return (
        <div className="box">
            <div className="content">
                <main>
                    <div className="sec" id="home">
                        <h2>home</h2>
                    </div>
                    <div className="sec" id="about">
                        <h2>about us</h2>
                    </div>
                    <div className="sec" id="gallery">
                        <h2>gallery</h2>
                    </div>
                    <div className="sec" id="review">
                        <h2>review</h2>
                    </div>
                    <div className="sec" id="contact">
                        <h2>contact us</h2>
                    </div>
                </main>
            </div>
            <div className="scroll">
                <nav>
                    <ul>
                        <li>
                            <a href="#home" className="active">
                                home
                            </a>
                        </li>
                        <li>
                            <a href="#about">about</a>
                        </li>
                        <li>
                            <a href="#gallery">galllery</a>
                        </li>
                        <li>
                            <a href="#review">review</a>
                        </li>
                        <li>
                            <a href="#contact">contact us</a>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default ScrollSpy;
