import React, {
    useState,
    useEffect
} from 'react';
import './SpeedTypingGame.css';
import TypingArea from './TypingArea'; // Import the TypingArea component

const SpeedTypingGame = () => {
    const paragraphs = [
        "The sun shone, having no alternative, on the nothing new. - Samuel Beckett, Murphy.",
        "There is no greater agony than bearing an untold story inside you. - Maya Angelou.",
        "You have brains in your head. You have feet in your shoes. You can steer yourself any direction you choose. - Dr. Seuss, Oh, the Places You'll Go!",
        "Life is like riding a bicycle. To keep your balance, you must keep moving. - Albert Einstein.",
        "The only way to do great work is to love what you do. - Steve Jobs.",
        "It does not do to dwell on dreams and forget to live. - J.K. Rowling, Harry Potter and the Sorcerer's Stone.",
        "In three words I can sum up everything I've learned about life: it goes on. - Robert Frost.",
        "We are what we pretend to be, so we must be careful about what we pretend to be. - Kurt Vonnegut, Mother Night.",
        "We're all human, aren't we? Every human life is worth the same, and worth saving. - J.K. Rowling, Harry Potter and the Deathly Hallows.",
        "To live is the rarest thing in the world. Most people exist, that is all. - Oscar Wilde.",
        "It is our choices, Harry, that show what we truly are, far more than our abilities. - J.K. Rowling, Harry Potter and the Chamber of Secrets.",
        "It is never too late to be what you might have been. - George Eliot.",
        "Some infinities are bigger than other infinities. - John Green, The Fault in Our Stars.",
        "It is the time you have wasted for your rose that makes your rose so important. - Antoine de Saint-Exupéry, The Little Prince.",
        "Happiness is not something ready-made. It comes from your own actions. - Dalai Lama XIV.",
        "The only limits that exist are the ones you place on yourself. - Les Brown.",
        "Sometimes the heart sees what is invisible to the eye. - H. Jackson Brown, Jr.",
        "When you reach the end of your rope, tie a knot in it and hang on. - Franklin D. Roosevelt.",
        "All that is gold does not glitter, not all those who wander are lost. - J.R.R. Tolkien, The Fellowship of the Ring.",
        "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt."
    ];

    const [typingText, setTypingText] = useState('');
    const [inpFieldValue, setInpFieldValue] = useState('');
    const maxTime = 60;
    const [timeLeft, setTimeLeft] = useState(maxTime);
    const [charIndex, setCharIndex] = useState(0);
    const [mistakes, setMistakes] = useState(0);
    const [isTyping, setIsTyping] = useState(false);
    const [WPM, setWPM] = useState(0);
    const [CPM, setCPM] = useState(0);

    const loadParagraph = () => {
        const ranIndex = Math.floor(Math.random() * paragraphs.length);
        const inputField = document.getElementsByClassName('input-field')[0];
        document.addEventListener("keydown", () => inputField.focus());
        const content = Array.from(paragraphs[ranIndex]).map((letter, index) => (
            <span
                key={index}
                style={{ color: (letter !== ' ') ? 'black' : 'transparent' }}
                className={`char ${index === 0 ? 'active' : ''}`} >
                {(letter !== ' ') ? letter : '_'}
            </span>
        ));
        setTypingText(content);
        setInpFieldValue('');
        setCharIndex(0);
        setMistakes(0);
        setIsTyping(false);
    };
    const handleKeyDown = (event) => {
        const characters = document.querySelectorAll('.char');
        if (event.key === 'Backspace' && charIndex > 0 &&
            charIndex < characters.length && timeLeft > 0) {
            if (characters[charIndex - 1].classList.contains('correct')) {
                characters[charIndex - 1].classList.remove('correct');
            }
            if (characters[charIndex - 1].classList.contains('wrong')) {
                characters[charIndex - 1].classList.remove('wrong');
                setMistakes(mistakes - 1);
            }
            characters[charIndex].classList.remove('active');
            characters[charIndex - 1].classList.add('active');
            setCharIndex(charIndex - 1);
            let cpm = (charIndex - mistakes - 1) * (60 / (maxTime - timeLeft));
            cpm = cpm < 0 || !cpm || cpm === Infinity ? 0 : cpm;
            setCPM(parseInt(cpm, 10));
            let wpm = Math.round(((charIndex - mistakes) / 5) / (
                maxTime - timeLeft) * 60);
            wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
            setWPM(wpm);
        }
    }

    const initTyping = (event) => {
        const characters = document.querySelectorAll('.char');
        let typedChar = event.target.value;
        if (charIndex < characters.length && timeLeft > 0) {
            let currentChar = characters[charIndex].innerText;
            if (currentChar === '_') currentChar = ' ';
            if (!isTyping) {
                setIsTyping(true);
            }
            if (typedChar === currentChar) {
                setCharIndex(charIndex + 1);
                if (charIndex + 1 < characters.length) characters[charIndex +
                    1].classList.add('active');
                characters[charIndex].classList.remove('active');
                characters[charIndex].classList.add('correct');
            } else {
                setCharIndex(charIndex + 1);
                setMistakes(mistakes + 1);
                characters[charIndex].classList.remove('active');
                if (charIndex + 1 < characters.length) characters[charIndex +
                    1].classList.add('active');
                characters[charIndex].classList.add('wrong');
            }

            if (charIndex === characters.length - 1) setIsTyping(false);

            let wpm = Math.round(((charIndex - mistakes) / 5) / (
                maxTime - timeLeft) * 60);
            wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
            setWPM(wpm);

            let cpm = (charIndex - mistakes) * (60 / (maxTime - timeLeft));
            cpm = cpm < 0 || !cpm || cpm === Infinity ? 0 : cpm;
            setCPM(parseInt(cpm, 10));
        } else {
            setIsTyping(false);
        }
    };

    const resetGame = () => {
        setIsTyping(false);
        setTimeLeft(maxTime);
        setCharIndex(0);
        setMistakes(0);
        setTypingText('');
        setCPM(0);
        setWPM(0);
        const characters = document.querySelectorAll('.char');
        characters.forEach(span => {
            span.classList.remove("correct");
            span.classList.remove('wrong');
            span.classList.remove('active');
        });
        characters[0].classList.add('active');
        loadParagraph();
    };

    useEffect(() => {
        loadParagraph();
    }, []);

    useEffect(() => {
        let interval;
        if (isTyping && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(timeLeft - 1);
                let cpm = (charIndex - mistakes) * (60 / (maxTime - timeLeft));
                cpm = cpm < 0 || !cpm || cpm === Infinity ? 0 : cpm;
                setCPM(parseInt(cpm, 10));
                let wpm = Math.round(((charIndex - mistakes) / 5) / (
                    maxTime - timeLeft) * 60);
                wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
                setWPM(wpm);
            }, 1000);
        } else if (timeLeft === 0) {
            clearInterval(interval);
            setIsTyping(false);
        }
        return () => {
            clearInterval(interval);
        };
    }, [isTyping, timeLeft]);


    return (<div className="container" >
        <input
            type="text"
            className="input-field"
            value={inpFieldValue}
            onChange={initTyping}
            onKeyDown={handleKeyDown}
        />
        <TypingArea 
            typingText={typingText} 
            inpFieldValue={inpFieldValue} 
            timeLeft={timeLeft} 
            mistakes={mistakes}
            WPM={WPM}
            CPM={CPM}
            initTyping={initTyping}
            handleKeyDown={handleKeyDown}
            resetGame={resetGame}
        />
    </div >
    );
};

export default SpeedTypingGame;
