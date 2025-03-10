# Tapture

![translation](./public/translation.gif)

#### **[DEMO SITE](https://tapture.vercel.app/)**

## 개요

Tapture는 마우스로 선택한 영역만 번역할 수 있는 Chrome 확장 프로그램입니다. 기존 번역기들은 전체 페이지 번역이나 새로운 탭이동, 번거로운 복사 & 붙여넣기 과정이 필요하지만, Tapture는 이런 불필요한 과정을 줄이고 원하는 부분만 즉시 번역하는 데 초점을 맞췄습니다.

## 주요 기능

- **마우스로 지정한 영역만 번역**: 전체 페이지 번역이 필요 없는 경우, 원하는 부분만 번역할 수 있습니다.
- **새 탭 없이 즉시 번역**: 현재 보고 있는 페이지에서 직접 번역 결과를 확인할 수 있습니다.
- **로컬 모델 사용**: Hugging Face의 Xenova Translation 모델을 사용하며, 유저가 직접 모델을 다운로드하여 오프라인에서도 사용 가능합니다.

## 기술적 고려 사항

Tapture는 ONNX 기반의 Xenova/nllb-200-distilled-600M 모델을 사용하여 번역을 수행합니다. 이 방식의 특성상:

- **Google 번역기나 전문 번역기보다 품질이 낮을 수 있습니다.**
- **번역 속도(성능)는 사용자의 컴퓨터 성능에 따라 다릅니다.**

이 프로젝트는 단순한 UX 아이디어에서 출발했으며, 기존 번역기의 번거로운 과정을 개선하는 데 중점을 두고 개발되었습니다. 높은 번역 품질보다는 편리한 사용자 경험을 목표로 하고 있습니다.
