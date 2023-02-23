# Retor-Style Space Shooting Game

![picture alt](https://shape2ee.github.io/shooting-game/images/readme_image.png "Retor-Style Space Shooting Game")

## 🎮 Play
[Play the Game](https://shape2ee.github.io/shooting-game/)

## 🕹 Controls
- ↑↓←→: Move the ship
- Space: Fire a missile

## 🖥 프로젝트 소개
이 프로젝트는 Canvas와 JavaScript의 기능들을 다양하게 사용하여<br>
많은 경험을 할 수 있을 것이라 생각하여 작업을 하기 시작했습니다.<br>
class문법을 이용하여 객체지향 문법에 대해 공부하고 이해하며<br>
Canvas API를 이용하여 부드러운 움직임을 구현하도록 노력했습니다.<br>
지금은 현재 JavaScript로 작업이 되어있는 구조를<br>
TypeScript로 변경하는 중 입니다.

## 🔑 문제해결 및 정리
- 여러개의 함수들을 하나의 class문법으로 연결하면서 this의 이해도가 부족하여<br>
  정확한 값을 요청하지 못했던 점을 this에 대해 블로그에 정리를 하면서 문제를 해결해 나아갔습니다.
- keyup event로 bullet을 발사하게 했는데 게임오버 후 다시 시작하면<br>
  오류와 함께 bullet이 발사가 되었고, 원인이 추가했었던 event를 remove해주지 않아<br>
  event가 다시 추가 되는 문제였고, 이것을 게임이 종류되면 remove 해주는 것으로 해결 했습니다.

## 📝 배운 점
- 객체지향 문법에 대해서 일정부분 이해하게 되는 계기가 되었습니다.
- JavaScript class문법에서 this에 대해서 이해하게 되었습니다.
- JavaScript 코드에서 연관이 있는 부분끼리 class문법으로 묶어서 코드를 좀 더 깔끔하게 작업을 할 수 있게 되었다.
- Canvas로 2D를 그리고 간단한 애니메이션을 만드는 방법에 대해서 배웠습니다.

## 추후 추가하면 좋을 기능
- rank 추가 기능
- 배경이나 운석 애니메이션
- 타입스크립트