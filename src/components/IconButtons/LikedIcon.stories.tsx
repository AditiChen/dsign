import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Liked } from "./LikeIcons";

export default {
  title: "Components/IconButtons/LikedIcon",
  component: Liked,
  // parameters: {
  //   actions: {
  //     handles: ["click", "click .btn"],
  //   },
  // },
} as ComponentMeta<typeof Liked>;

// eslint-disable-next-line react/function-component-definition
const IconButton: ComponentStory<typeof Liked> = (args) => <Liked {...args} />;

export const PrimaryDesktop = IconButton.bind({});
PrimaryDesktop.args = {
  margin: "10px",
  $width: "30px",
  $height: "30px",
};

export const SecondaryDesktop = IconButton.bind({});
SecondaryDesktop.args = {
  margin: "10px",
  $width: "24px",
  $height: "24px",
};

export const Mobile = IconButton.bind({});
Mobile.args = {
  margin: "10px",
  $width: "18px",
  $height: "18px",
};
