# React Native - Cards

Pokemon Cards renderer demo. Hologram, gloss, background shader, RGB split, inner and outer hologram mask, different types of image outlines (white, hologram, masked holo gif).

I wanted to show how would a highly optimised version of react-native-skia demo would look like. Most of the examples on the internet used useStete to calculate the shader timer instead of useClock. Most of them had poorly optimised component rendering.

Shaders
Skia allows you to pass shaders that are used here in the background. I have implemented some of the popular shaders from https://www.shadertoy.com and a few of my own. Shader rendering optimisation was important.

Gesture
I have used react-native-sensors to provide phone movement feedback. Alos gestures are supported to move the cards around.

No Expo
I tried to keep the dependencies to the minimum. There are some things that had to be used like react-native-reanimated or react-native-worklets. Always because they gave us performance improvements.
