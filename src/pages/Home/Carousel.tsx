import { useRef, useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import artists from "./CarouselData.json";
import { CarouselStoryType } from "../../components/tsTypes";

const bannerAnimation = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }`;

const CarouselContainer = styled.div`
  padding: 50px 80px;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(180deg, #000000 85%, #3c3c3c, #787878);
  position: relative;
  animation: ${bannerAnimation} 1s ease-in;
  @media screen and (min-width: 800px) and (max-width: 1199px) {
    padding: 30px 40px;
  }
  @media screen and (min-width: 300px) and (max-width: 799px) {
    padding: 10px;
  }
`;

const StoryContainer = styled.div<{ opacity: number; zIndex: number }>`
  width: calc(100% - 160px);
  height: calc(100% - 100px);
  position: absolute;
  transition: opacity 1s;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  opacity: ${(props) => props.opacity};
  z-index: ${(props) => props.zIndex};
  @media screen and (min-width: 800px) and (max-width: 1199px) {
    width: calc(100% - 80px);
    height: calc(100% - 60px);
  }
  @media screen and (min-width: 300px) and (max-width: 799px) {
    width: calc(100% - 20px);
    height: calc(100% - 20px);
  }
`;

const QuoteContainer = styled.div`
  max-width: 35%;
  display: flex;
  flex-direction: column;
  @media screen and (min-width: 1200px) and (max-width: 1599px) {
    max-width: 40%;
  }
  @media screen and (min-width: 300px) and (max-width: 1199px) {
    max-width: 45%;
  }
`;

const Quote = styled.div`
  padding-right: 50px;
  font-size: 50px;
  line-height: 70px;
  color: #ffffff;
  font-family: "Caveat", cursive;
  font-weight: 600;
  @media screen and (min-width: 1600px) and (max-width: 1859px) {
    line-height: 60px;
    font-size: 44px;
  }
  @media screen and (min-width: 1200px) and (max-width: 1599px) {
    line-height: 55px;
    font-size: 40px;
  }
  @media screen and (min-width: 700px) and (max-width: 1199px) {
    padding-right: 20px;
    line-height: 36px;
    font-size: 26px;
  }
  @media screen and (min-width: 300px) and (max-width: 699px) {
    padding-right: 10px;
    line-height: 24px;
    font-size: 16px;
  }
`;

const Name = styled.div`
  margin-left: auto;
  font-size: 30px;
  line-height: 50px;
  color: #ffffff;
  font-family: "Caveat", cursive;
  @media screen and (min-width: 1200px) and (max-width: 1599px) {
    line-height: 40px;
    font-size: 24px;
  }
  @media screen and (min-width: 700px) and (max-width: 1199px) {
    line-height: 30px;
    font-size: 16px;
  }
  @media screen and (min-width: 300px) and (max-width: 699px) {
    line-height: 25px;
    font-size: 12px;
  }
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
  bottom: 25px;
  left: 50%;
  transform: translate(-50%);
  display: flex;
  align-items: center;
  @media screen and (min-width: 800px) and (max-width: 1199px) {
    bottom: 20px;
  }
  @media screen and (min-width: 300px) and (max-width: 799px) {
    bottom: 15px;
  }
`;

const Doc = styled.div<{ backgroundColor: string }>`
  width: 10px;
  height: 10px;
  background-color: ${(props) => props.backgroundColor};
  border-radius: 50%;
  cursor: pointer;
  & + & {
    margin-left: 15px;
  }
  @media screen and (min-width: 800px) and (max-width: 1449px) {
    width: 8px;
    height: 8px;
    & + & {
      margin-left: 12px;
    }
  }
  @media screen and (min-width: 300px) and (max-width: 799px) {
    width: 6px;
    height: 6px;
    & + & {
      margin-left: 10px;
    }
  }
`;

function getArtistsData() {
  const randomIndexArtistsData = [];
  const randomIndex = [];
  do {
    const randomNum = Math.floor(Math.random() * artists.length);
    const repeatCheck = randomIndex.indexOf(randomNum);
    if (repeatCheck === -1) {
      randomIndex.push(randomNum);
      randomIndexArtistsData.push(artists[randomNum]);
    }
  } while (randomIndex.length < 3);
  return randomIndexArtistsData;
}

function Carousel() {
  const [stories, setStories] = useState<CarouselStoryType[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef<number>();

  useEffect(() => {
    const ArtistsData = getArtistsData();
    if (ArtistsData.length === 3) {
      intervalRef.current = window.setInterval(() => {
        setActiveIndex((prev) =>
          prev === ArtistsData.length - 1 ? 0 : prev + 1
        );
      }, 5000);
    }
    setStories(ArtistsData);
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <>
      <CarouselContainer>
        {stories.map(({ quote, name, photo, wikipedia }, index) => (
          <StoryContainer
            key={wikipedia}
            opacity={index === activeIndex ? 1 : 0}
            zIndex={index === activeIndex ? 1 : 0}
            onClick={() => window.open(`${wikipedia}`)}
          >
            <QuoteContainer>
              <Quote>{quote}</Quote>
              <Name>{`- ${name}`}</Name>
            </QuoteContainer>
            <Photo src={`${photo}`} />
          </StoryContainer>
        ))}
      </CarouselContainer>
      <DocsContainer>
        {stories.map((_, index) => (
          <Doc
            key={`${index + 1}`}
            backgroundColor={index === activeIndex ? "#ffffff" : "#787878"}
            onClick={() => {
              setActiveIndex(index);
              window.clearInterval(intervalRef.current);
              intervalRef.current = window.setInterval(() => {
                setActiveIndex((prev) =>
                  prev === stories.length - 1 ? 0 : prev + 1
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
