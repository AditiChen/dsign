import { ComponentStory, ComponentMeta } from "@storybook/react";
import { GlobalStyle } from "../../App";
import Template1 from "./Template1";

export default {
  title: "Components/Templates/Template1",
  component: Template1,
  args: {
    photoUrl: [
      "https://firebasestorage.googleapis.com/v0/b/d-sig-2f338.appspot.com/o/images%2FXhPi8LCbNPPP1J56VUztx202k7S2%2F79a2c21a-1053-4466-9354-1e7dc727f0f0?alt=media&token=ccd202ca-60c4-4ba1-a7e9-f937d407f0cf",
      "https://firebasestorage.googleapis.com/v0/b/d-sig-2f338.appspot.com/o/images%2FXhPi8LCbNPPP1J56VUztx202k7S2%2F5ae3cc65-00f0-4ccd-b168-ad143cd02242?alt=media&token=0548d8a1-19f7-490c-be19-d683ac721364",
      "https://firebasestorage.googleapis.com/v0/b/d-sig-2f338.appspot.com/o/images%2FXhPi8LCbNPPP1J56VUztx202k7S2%2F8ca72b69-c13b-4155-9e61-3703217dd539?alt=media&token=23a5684b-150a-4373-b864-5dc3451fc384",
    ],
    content: [`The ambience here is like Europe. Tranquil and peaceful~`],
  },
} as ComponentMeta<typeof Template1>;

// eslint-disable-next-line react/function-component-definition
export const Template: ComponentStory<typeof Template1> = (args: {
  photoUrl: string[];
  content: string[];
}) => (
  <>
    <GlobalStyle />
    <Template1 {...args} />
  </>
);
