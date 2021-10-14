// App.js
// Kindacode.com
import React, {FunctionComponent, useEffect, useState} from "react";

const ScrollUpButton : FunctionComponent = () => {

    const [visible, setVisible] = useState(false)

    const toggleVisible = () => {
        const scrolled = document.documentElement.scrollTop;
        if (scrolled > 300){
            setVisible(true)
        }
        else if (scrolled <= 300){
            setVisible(false)
        }
    };

    window.addEventListener('scroll', toggleVisible);

    const scrollUp = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
            /* you can also use 'auto' behaviour
               in place of 'smooth' */
        });
    }
    return visible? <button onClick={scrollUp} className={"scroll"}>scroll up</button> : <div></div>
        ;
}

export default ScrollUpButton;

