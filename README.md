# 📚 Flashcard Quiz App

A simple and intuitive flashcard quiz application for Android that helps you study and memorize information through interactive question-answer cards.

## Features

- **📁 File Support**: Load questions from XML or TXT files
- **👆 Intuitive Navigation**:
  - Swipe left/right to navigate between questions
  - Click left/right edges of card to navigate
  - Tap center to reveal/hide answers
- **🔀 Shuffle Mode**: Randomize question order for better learning
- **💾 Auto-Save**: Automatically remembers your last file and progress
- **📱 Mobile-Friendly**: Optimized for Android devices with touch gestures
- **🎨 Clean Interface**: Simple, distraction-free design

## Download

Download the latest APK from the [Releases page](https://github.com/volgachen/Flashcard-Quiz/releases).

### Installation

1. Download the APK file from releases
2. Enable "Install from unknown sources" on your Android device
3. Install the APK
4. Open the app and select your question file

## Supported File Formats

### XML Format
```xml
<?xml version="1.0" encoding="UTF-8"?>
<questions>
  <item>
    <question>Your question here</question>
    <answer>Your answer here</answer>
  </item>
</questions>
```

### TXT Format
```
Q: Your question here
A: Your answer here

Q: Another question
A: Another answer
```

## How to Use

1. **Load Questions**: Tap "Select Question File" and choose your XML or TXT file
2. **Study**: Read the question and tap the center to reveal the answer
3. **Navigate**:
   - Swipe left or click right edge → Next question
   - Swipe right or click left edge → Previous question
4. **Shuffle**: Tap "Shuffle & Restart" to randomize the order
5. **Continue Later**: The app automatically saves your progress

## For Developers

Want to build or modify this app? Check out [DEVELOP.md](DEVELOP.md) for:
- Development environment setup
- Project structure
- Build instructions
- Contributing guidelines

## Requirements

- Android 5.0 (API level 21) or higher
- Permission to read files from storage

## Privacy

This app:
- ✅ Works completely offline
- ✅ Stores data only on your device (localStorage)
- ✅ Does not collect or transmit any personal information
- ✅ Does not require internet connection

## Support

If you encounter any issues or have suggestions, please [open an issue](https://github.com/volgachen/Flashcard-Quiz/issues).
