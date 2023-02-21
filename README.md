# Retor-Style Space Shooting Game

![picture alt](https://shape2ee.github.io/shooting-game/images/readme_image.png "Retor-Style Space Shooting Game")

## 🎮 Play
[Play the Game](https://shape2ee.github.io/shooting-game/)

## 🕹 Controls
- ↑↓←→: Move the ship
- Space: Fire a missile

## 🖥 소개
이 프로젝트는 오로지 JavaScript를 이용하여 기능구현을 했습니다.<br>
class문법으로 작성하여 객체지향에 대한 공부를 하였고, <br>
CANVAS API를 사용함으로 인해서 좀 더 부드러운 움직임을 만들어 냈습니다.

## 🔑 문제해결 및 정리
- 여러개의 함수들을 하나의 class문법으로 연결하면서 this의 이해도가 부족하여<br>
  정확한 값을 요청하지 못했던 점을 해결했습니다.
- keyup event로 bullet을 발사하게 했는데 게임오버 후 다시 시작하면<br>
  오류와 함께 bullet이 발사가 되었고, 이유가 추가했었던 event를 remove해주지 않아<br>
  event가 추가 되는 문제였고, 이것을 게임이 종류되면 remove 해주는 것으로 해결 했습니다.

## 📝 배운 점
- JavaScript class문법에서 this에 대해서 이해하게 되었습니다.
- JavaScript 코드에서 연관이 있는 부분끼리 class문법으로 묶어서 코드를 좀 더 깔끔하게 작업을 할 수 있게 되었다.
- Canvas로 2D를 그리고 간단한 애니메이션을 만드는 방법에 대해서 배웠습니다.

## 추후 추가하면 좋을 기능
- rank 추가 기능
- 배경이나 운석 애니메이션
- 타입스크립트 적용



