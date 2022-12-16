import { ComponentStory, ComponentMeta } from "@storybook/react";
import { GlobalStyle } from "../../App";
import Template7 from "./Template7";

export default {
  title: "Components/Templates/Template7",
  component: Template7,
  args: {
    photoUrl: [
      "https://firebasestorage.googleapis.com/v0/b/d-sig-2f338.appspot.com/o/images%2FFGNFbAm6GPPF8NZKuPGIxT6wPwp2%2Fd44dc369-a7cb-4806-9ca4-44b34d896aa9?alt=media&token=f3e90bdf-3cfa-402d-893b-d2f77e3c8984",
      "https://firebasestorage.googleapis.com/v0/b/d-sig-2f338.appspot.com/o/images%2FFGNFbAm6GPPF8NZKuPGIxT6wPwp2%2Fa271541a-7d49-497d-b3a5-898b000fb4d2?alt=media&token=b22706bd-2d3e-473d-a730-251265718bbd",
      "https://firebasestorage.googleapis.com/v0/b/d-sig-2f338.appspot.com/o/images%2FFGNFbAm6GPPF8NZKuPGIxT6wPwp2%2Ff1866ebd-157c-4716-b79e-8618aebf96cd?alt=media&token=631bdfa7-e223-4627-bce9-943cee42da7f",
    ],
    content: [
      `However, there are too many visitors especially on the weekend or special holiday, such as Valentine's day, Christmas, Mother's da and so on. I don't really recommend people to visit here in that kind of special days, unless you want to line up for 4 hours just to get a seat...Anyway, have a great night!`,
    ],
  },
} as ComponentMeta<typeof Template7>;

// eslint-disable-next-line react/function-component-definition
export const Template: ComponentStory<typeof Template7> = (args: {
  photoUrl: string[];
  content: string[];
}) => (
  <>
    <GlobalStyle />
    <Template7 {...args} />
  </>
);
