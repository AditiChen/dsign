import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Friend } from "./FriendIcon";

export default {
  title: "Components/IconButtons/FriendIcon",
  component: Friend,
} as ComponentMeta<typeof Friend>;

// eslint-disable-next-line react/function-component-definition
export const IconButton: ComponentStory<typeof Friend> = () => (
  <div style={{ width: "40px", marginLeft: "0" }}>
    <Friend />
  </div>
);
