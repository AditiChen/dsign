import { useRef, useEffect, useState } from "react";
import styled from "styled-components";
import artists from "./CarouselData.json";

const CarouselContainer = styled.div`
  padding: 50px 80px;
  width: 100%;
  height: 100%;
  background-color: #000000;
  position: relative;
`;

const StoryContainer = styled.div<{ opacity: number; zIndex: number }>`
  width: calc(100% - 160px);
  height: calc(100% - 100px);
  position: absolute;
  transition: opacity 1s;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: space-around;
  opacity: ${(props) => props.opacity};
  z-index: ${(props) => props.zIndex};
`;

const QuoteContainer = styled.div`
  max-width: 40%;
  display: flex;
  flex-direction: column;
`;

const Quote = styled.div`
  padding-right: 50px;
  font-size: 50px;
  line-height: 70px;
  color: #ffffff;
  font-family: "Caveat", cursive;
  font-weight: 600;
`;

const Name = styled.div`
  margin-left: auto;
  font-size: 30px;
  line-height: 50px;
  color: #ffffff;
  font-family: "Caveat", cursive;
`;

const Photo = styled.img`
  max-width: 40%;
  max-height: 85%;
  &:hover {
    cursor: pointer;
  }
`;

const DocsContainer = styled.div`
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translate(-50%);
  display: flex;
  align-items: center;
`;

const Doc = styled.div<{ backgroundColor: string }>`
  width: 10px;
  height: 10px;
  background-color: ${(props) => props.backgroundColor};
  border-radius: 50%;
  cursor: pointer;
  & + & {
    margin-left: 20px;
  }
`;

function Carousel() {
  const [storys, setStorys] = useState<
    {
      name: string;
      quote: string;
      photo: string;
      wikipedia: string;
    }[]
  >([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef<number>();

  useEffect(() => {
    const randomIndexData = [];
    const randomIndex = [];
    do {
      const randomNum = Math.floor(Math.random() * artists.length);
      const repeatCheck = randomIndex.indexOf(randomNum);
      if (repeatCheck === -1) {
        randomIndex.push(randomNum);
        randomIndexData.push(artists[randomNum]);
      }
    } while (randomIndex.length < 3);
    setStorys(randomIndexData);
  }, []);

  useEffect(() => {
    intervalRef.current = window.setInterval(() => {
      setActiveIndex((prev) => (prev === storys.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(intervalRef.current);
  }, [storys]);

  return (
    <>
      <CarouselContainer>
        {storys.map(({ quote, name, photo, wikipedia }, index) => (
          <StoryContainer
            key={wikipedia}
            opacity={index === activeIndex ? 1 : 0}
            zIndex={index === activeIndex ? 1 : 0}
          >
            <QuoteContainer>
              <Quote>{quote}</Quote>
              <Name>{`- ${name}`}</Name>
            </QuoteContainer>
            <Photo
              src={`${photo}`}
              onClick={() => window.open(`${wikipedia}`)}
            />
          </StoryContainer>
        ))}
      </CarouselContainer>
      <DocsContainer>
        {storys.map((_, index) => (
          <Doc
            key={`${index + 1}`}
            backgroundColor={index === activeIndex ? "#ffffff" : "#787878"}
            onClick={() => {
              setActiveIndex(index);
              window.clearInterval(intervalRef.current);
              intervalRef.current = window.setInterval(() => {
                setActiveIndex((prev) =>
                  prev === storys.length - 1 ? 0 : prev + 1
                );
              }, 5000);
            }}
          />
        ))}
      </DocsContainer>
    </>
  );
}

export default Carousel;
