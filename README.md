# React Native - Cards

Pokemon Cards renderer demo. Hologram, gloss, background shader, RGB split, inner and outer hologram mask, different types of image outlines (white, hologram, masked holo gif).

[![Watch the video](https://img.youtube.com/vi/VbxFiI15JMs/0.jpg)](https://www.youtube.com/shorts/VbxFiI15JMs)

Gallery:

<h2 align="center">📟 Pokédex GIF Gallery</h2>

<p align="center">
  Click any card to open the file.
</p>

<table align="center">
  <tr>
    <td align="center">
      <a href="https://github.com/twboc/cards/blob/main/demo/01.%20Pikachu.gif">
        <img src="https://github.com/twboc/cards/raw/main/demo/01.%20Pikachu.gif" width="180" alt="Pikachu">
      </a><br>
      <sub><b>#001</b> Pikachu</sub>
    </td>
    <td align="center">
      <a href="https://github.com/twboc/cards/blob/main/demo/02.%20Blbasaur.gif">
        <img src="https://github.com/twboc/cards/raw/main/demo/02.%20Blbasaur.gif" width="180" alt="Blbasaur">
      </a><br>
      <sub><b>#002</b> Blbasaur</sub>
    </td>
    <td align="center">
      <a href="https://github.com/twboc/cards/blob/main/demo/03.%20Jolteon.gif">
        <img src="https://github.com/twboc/cards/raw/main/demo/03.%20Jolteon.gif" width="180" alt="Jolteon">
      </a><br>
      <sub><b>#003</b> Jolteon</sub>
    </td>
  </tr>
  <tr>
    <td align="center">
      <a href="https://github.com/twboc/cards/blob/main/demo/04.%20Charizard%20Big.gif">
        <img src="https://github.com/twboc/cards/raw/main/demo/04.%20Charizard%20Big.gif" width="180" alt="Charizard Big">
      </a><br>
      <sub><b>#004</b> Charizard Big</sub>
    </td>
    <td align="center">
      <a href="https://github.com/twboc/cards/blob/main/demo/05.%20Pikachu.gif">
        <img src="https://github.com/twboc/cards/raw/main/demo/05.%20Pikachu.gif" width="180" alt="Pikachu">
      </a><br>
      <sub><b>#005</b> Pikachu</sub>
    </td>
    <td align="center">
      <a href="https://github.com/twboc/cards/blob/main/demo/06.%20Chardizard.gif">
        <img src="https://github.com/twboc/cards/raw/main/demo/06.%20Chardizard.gif" width="180" alt="Chardizard">
      </a><br>
      <sub><b>#006</b> Chardizard</sub>
    </td>
  </tr>
  <tr>
    <td align="center">
      <a href="https://github.com/twboc/cards/blob/main/demo/07.%20Pikachu.gif">
        <img src="https://github.com/twboc/cards/raw/main/demo/07.%20Pikachu.gif" width="180" alt="Pikachu">
      </a><br>
      <sub><b>#007</b> Pikachu</sub>
    </td>
    <td align="center">
      <a href="https://github.com/twboc/cards/blob/main/demo/08.%20Chardizard%20Big.gif">
        <img src="https://github.com/twboc/cards/raw/main/demo/08.%20Chardizard%20Big.gif" width="180" alt="Chardizard Big">
      </a><br>
      <sub><b>#008</b> Chardizard Big</sub>
    </td>
    <td align="center">
      <a href="https://github.com/twboc/cards/blob/main/demo/09.%20Marill.gif">
        <img src="https://github.com/twboc/cards/raw/main/demo/09.%20Marill.gif" width="180" alt="Marill">
      </a><br>
      <sub><b>#009</b> Marill</sub>
    </td>
  </tr>
  <tr>
    <td align="center">
      <a href="https://github.com/twboc/cards/blob/main/demo/10.%20Mew.gif">
        <img src="https://github.com/twboc/cards/raw/main/demo/10.%20Mew.gif" width="180" alt="Mew">
      </a><br>
      <sub><b>#010</b> Mew</sub>
    </td>
    <td align="center">
      <a href="https://github.com/twboc/cards/blob/main/demo/11.%20Mew%20Controls.gif">
        <img src="https://github.com/twboc/cards/raw/main/demo/11.%20Mew%20Controls.gif" width="180" alt="Mew Controls">
      </a><br>
      <sub><b>#011</b> Mew Controls</sub>
    </td>
    <td align="center">
      <sub><b>🟡 ???</b><br>Coming soon</sub>
    </td>
  </tr>
</table>

I wanted to show how would a highly optimised version of react-native-skia demo would look like. Most of the examples on the internet used useStete to calculate the shader timer instead of useClock. Most of them had poorly optimised component rendering.

Shaders
Skia allows you to pass shaders that are used here in the background. I have implemented some of the popular shaders from https://www.shadertoy.com and a few of my own. Shader rendering optimisation was important.

Gesture
I have used react-native-sensors to provide phone movement feedback. Alos gestures are supported to move the cards around.

No Expo
I tried to keep the dependencies to the minimum. There are some things that had to be used like react-native-reanimated or react-native-worklets. Always because they gave us performance improvements.
