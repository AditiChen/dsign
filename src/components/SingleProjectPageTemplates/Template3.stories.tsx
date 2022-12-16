import { ComponentStory, ComponentMeta } from "@storybook/react";
import { GlobalStyle } from "../../App";
import Template3 from "./Template3";

export default {
  title: "Components/Templates/Template3",
  component: Template3,
  args: {
    photoUrl: [
      "https://firebasestorage.googleapis.com/v0/b/d-sig-2f338.appspot.com/o/images%2FFGNFbAm6GPPF8NZKuPGIxT6wPwp2%2Fd44dc369-a7cb-4806-9ca4-44b34d896aa9?alt=media&token=f3e90bdf-3cfa-402d-893b-d2f77e3c8984",
      "https://firebasestorage.googleapis.com/v0/b/d-sig-2f338.appspot.com/o/images%2FFGNFbAm6GPPF8NZKuPGIxT6wPwp2%2Fa271541a-7d49-497d-b3a5-898b000fb4d2?alt=media&token=b22706bd-2d3e-473d-a730-251265718bbd",
      "https://firebasestorage.googleapis.com/v0/b/d-sig-2f338.appspot.com/o/images%2FFGNFbAm6GPPF8NZKuPGIxT6wPwp2%2Ff1866ebd-157c-4716-b79e-8618aebf96cd?alt=media&token=631bdfa7-e223-4627-bce9-943cee42da7f",
      "https://firebasestorage.googleapis.com/v0/b/d-sig-2f338.appspot.com/o/images%2FFGNFbAm6GPPF8NZKuPGIxT6wPwp2%2F3ed6d4fb-b1fd-4831-b3e0-b795176a813f?alt=media&token=f8d6ed78-ebbc-4731-a5c4-22df73970b3b",
    ],
    content: [
      `犬にとって散歩は楽しみだけではなく、健康に欠かせないものでもあります。`,
    ],
  },
} as ComponentMeta<typeof Template3>;

// eslint-disable-next-line react/function-component-definition
export const Template: ComponentStory<typeof Template3> = (args: {
  photoUrl: string[];
  content: string[];
}) => (
  <>
    <GlobalStyle />
    <Template3 {...args} />
  </>
);
