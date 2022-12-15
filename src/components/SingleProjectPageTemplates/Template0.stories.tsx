import { ComponentStory, ComponentMeta } from "@storybook/react";
import { GlobalStyle } from "../../App";
import Template0 from "./Template0";

export default {
  title: "Components/Templates/Template0",
  component: Template0,
  args: {
    photoUrl: [
      "https://firebasestorage.googleapis.com/v0/b/d-sig-2f338.appspot.com/o/images%2FXhPi8LCbNPPP1J56VUztx202k7S2%2Fdd498851-3692-425e-b0ee-0d4bcf11519b?alt=media&token=3792bd99-1fec-4a2a-918c-407ed0c513c8",
      "https://firebasestorage.googleapis.com/v0/b/d-sig-2f338.appspot.com/o/images%2FXhPi8LCbNPPP1J56VUztx202k7S2%2F20e69295-7f2c-46c0-a72d-5c5eb813d3cd?alt=media&token=7df364b9-434c-4f53-a531-bdd19848f40e",
    ],
    content: [
      `However, there are too many visitors especially on the weekend or special holiday, such as Valentine's day, Christmas, Mother's da and so on. I don't really recommend people to visit here in that kind of special days, unless you want to line up for 4 hours just to get a seat...Anyway, have a great night!`,
    ],
  },
} as ComponentMeta<typeof Template0>;

// eslint-disable-next-line react/function-component-definition
export const Template: ComponentStory<typeof Template0> = (args: {
  photoUrl: string[];
  content: string[];
}) => (
  <>
    <GlobalStyle />
    <Template0 {...args} />
  </>
);
