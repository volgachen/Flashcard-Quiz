# Development Guide - Flashcard Quiz App

## Project Overview

This is a Capacitor-based flashcard quiz application that runs on Android. The app loads question-answer pairs from XML or TXT files and displays them as swipeable flashcards.

**Key Features:**
- XML and TXT file format support
- Swipe gestures for navigation
- Click zones (left/right edges) for navigation
- Shuffle functionality
- localStorage persistence (auto-loads last file)
- Responsive design for mobile and desktop

## Prerequisites

### Required Software
- **Node.js** (v14 or higher)
- **npm** (comes with Node.js)
- **Java JDK** (v11 or higher) - for Android builds
- **Android Studio** (optional, but recommended for advanced Android development)
- **Git** - for version control

### Verify Installation
```bash
node --version
npm --version
java -version
```

## Environment Setup (First Time Only)

If you're setting up the development environment from scratch, follow these steps:

### 1. Install OpenJDK 21

#### Ubuntu/Debian
```bash
sudo apt update
sudo apt install openjdk-21-jdk
```

#### macOS (using Homebrew)
```bash
brew install openjdk@21
```

#### Verify Installation
```bash
java -version
# Should show: openjdk version "21.x.x"
```

### 2. Download Android Command Line Tools

#### Download
Visit: https://developer.android.com/studio#command-tools

Or download directly:
```bash
# Linux
wget https://dl.google.com/android/repository/commandlinetools-linux-latest.zip

# macOS
wget https://dl.google.com/android/repository/commandlinetools-mac-latest.zip
```

#### Extract and Setup
```bash
# Create Android SDK directory
mkdir -p ~/Android/Sdk/cmdline-tools

# Extract (replace with your downloaded file)
unzip commandlinetools-linux-latest.zip -d ~/Android/Sdk/cmdline-tools

# Rename to 'latest'
mv ~/Android/Sdk/cmdline-tools/cmdline-tools ~/Android/Sdk/cmdline-tools/latest
```

### 3. Set Environment Variables

Add these to your `~/.bashrc` or `~/.zshrc`:

```bash
# Java
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64  # Adjust path for your system
export PATH=$JAVA_HOME/bin:$PATH

# Android
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$ANDROID_HOME/cmdline-tools/latest/bin:$PATH
export PATH=$ANDROID_HOME/platform-tools:$PATH
export PATH=$ANDROID_HOME/build-tools/34.0.0:$PATH  # Adjust version as needed
```

Reload your shell:
```bash
source ~/.bashrc  # or source ~/.zshrc
```

### 4. Install Android SDK Packages

```bash
# Accept licenses
sdkmanager --licenses

# Install required packages
sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"

# Install additional tools (optional)
sdkmanager "emulator" "system-images;android-34;google_apis;x86_64"
```

### 5. Verify Setup

```bash
# Check Java
java -version

# Check Android SDK
sdkmanager --list | head -20

# Check adb (Android Debug Bridge)
adb version
```

### Alternative: Using local.properties (Simpler)

Instead of setting system-wide environment variables, you can configure the Android SDK path in a project-specific file. **This is what's actually used in this project.**

#### Create local.properties

Create or edit `android/local.properties`:

```properties
sdk.dir=/path/to/your/android-sdk
```

For example:
```properties
sdk.dir=/home/username/Android/Sdk
# or
sdk.dir=/mnt/sda/chenzhiyang/Others/android-sdk
```

#### Benefits
- **Project-specific**: Each project can use different SDK versions
- **Not committed**: File is in .gitignore, so each developer configures their own path
- **Simpler**: No need to modify shell configuration files
- **Gradle reads it automatically**: Works seamlessly with Android builds

#### Note
- This file is automatically created by Android Studio
- If building from command line, create it manually
- Java is still found through system PATH

## Project Structure

```
my-capacitor-app/
├── www/                    # Web assets (HTML, CSS, JS)
│   ├── index.html         # Main HTML file
│   ├── style.css          # Styles
│   ├── app.js             # Application logic
│   └── example.xml        # Sample question file
├── android/               # Android native project
│   ├── app/              # Android app module
│   └── gradle/           # Gradle wrapper
├── capacitor.config.json  # Capacitor configuration
├── package.json          # Node dependencies
└── .gitignore           # Git ignore rules
```

## Development Setup

### 1. Install Dependencies
```bash
cd /path/to/my-capacitor-app
npm install
```

### 2. Install Capacitor CLI (if not already installed)
```bash
npm install -g @capacitor/cli
```

## Development Workflow

### Making Changes to the App

#### 1. Edit Web Assets
All app logic is in the `www/` directory:

- **HTML**: Edit `www/index.html` for structure
- **CSS**: Edit `www/style.css` for styling
- **JavaScript**: Edit `www/app.js` for functionality

#### 2. Test in Browser (Quick Testing)
Open `www/index.html` directly in a browser for quick testing:
```bash
# Using Python's built-in server
cd www
python3 -m http.server 8000
# Then open http://localhost:8000 in browser
```

**Note**: File picker may not work in all browsers when testing locally.

#### 3. Sync Changes to Android
After making changes, sync them to the Android project:
```bash
npx cap sync android
```

This command:
- Copies web assets to `android/app/src/main/assets/public`
- Updates Capacitor plugins
- Updates configuration

#### 4. Build APK
Build a debug APK for testing:
```bash
cd android
./gradlew assembleDebug
```

The APK will be at: `android/app/build/outputs/apk/debug/app-debug.apk`

#### 5. Install on Device
```bash
# Using adb (Android Debug Bridge)
adb install android/app/build/outputs/apk/debug/app-debug.apk

# Or manually transfer the APK to your device
```

## Common Development Tasks

### Adding New Features

1. **Modify JavaScript** (`www/app.js`):
   - Add new functions
   - Update state management
   - Add event listeners

2. **Update UI** (`www/index.html` and `www/style.css`):
   - Add new HTML elements
   - Style with CSS

3. **Sync and Build**:
   ```bash
   npx cap sync android
   cd android && ./gradlew assembleDebug
   ```

### Debugging

#### Browser Console
- Open `www/index.html` in browser
- Use browser DevTools (F12) to debug JavaScript
- Check console for errors

#### Android Debugging
1. Enable USB debugging on Android device
2. Connect device via USB
3. Use Chrome DevTools:
   - Open `chrome://inspect` in Chrome
   - Select your device
   - Inspect the WebView

### Modifying App Behavior

#### Change File Formats
Edit parsing functions in `www/app.js`:
- `parseXML()` - for XML format
- `parseTXT()` - for TXT format

#### Change Navigation
Edit navigation functions in `www/app.js`:
- `nextQuestion()` - next card
- `previousQuestion()` - previous card
- `handleCardClick()` - click zone detection
- `handleSwipe()` - swipe gesture handling

#### Change Persistence
Edit state persistence in `www/app.js`:
- `saveState()` - save to localStorage
- `loadState()` - load from localStorage
- `clearState()` - clear saved data

### Styling Changes

Edit `www/style.css`:
- `.flashcard` - card appearance
- `.screen` - screen layouts
- Media queries - responsive behavior

## Building for Production

### Debug Build (Current)
```bash
cd android
./gradlew assembleDebug
```
Output: `android/app/build/outputs/apk/debug/app-debug.apk`

### Release Build (For Publishing)

Release APKs must be signed with a keystore. Follow these steps:

#### Step 1: Create Keystore (First Time Only)

```bash
cd /path/to/my-capacitor-app
keytool -genkey -v -keystore my-release-key.keystore \
  -alias my-key-alias \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

You'll be prompted for:
- **Keystore password** (at least 6 characters) - Remember this!
- **Key password** (can be same as keystore password)
- Your name, organization, etc. (can use defaults)

**Important**: Save the passwords securely - you'll need them for all future updates!

#### Step 2: Configure Signing in build.gradle

Edit `android/app/build.gradle` and add the signing configuration:

```gradle
android {
    // ... existing config ...

    signingConfigs {
        release {
            storeFile file('../../my-release-key.keystore')
            storePassword 'your-keystore-password'
            keyAlias 'my-key-alias'
            keyPassword 'your-key-password'
        }
    }

    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

Replace `'your-keystore-password'` and `'your-key-password'` with your actual passwords.

#### Step 3: Build Signed Release APK

```bash
cd android
./gradlew assembleRelease
```

Output: `android/app/build/outputs/apk/release/app-release.apk`

#### Step 4: Install Release APK

**Important**: Release and debug APKs have different signatures. Uninstall debug version first:

```bash
# Uninstall debug version
adb uninstall com.example.mycapacitorapp

# Install release version
adb install android/app/build/outputs/apk/release/app-release.apk
```

Or transfer the APK to your device and install manually.

## File Format Specifications

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

## Git Workflow

### Commit Changes
```bash
git add .
git commit -m "Description of changes"
```

### View Status
```bash
git status
git log --oneline
```

### Create Branch
```bash
git checkout -b feature-name
```

## Troubleshooting

### Build Fails
- **Clean build**: `cd android && ./gradlew clean`
- **Check Java version**: Ensure JDK 11+ is installed
- **Sync Gradle**: Open project in Android Studio and sync

### Changes Not Appearing
- **Sync first**: Always run `npx cap sync android` after web changes
- **Clear app data**: Uninstall and reinstall the app
- **Check localStorage**: Clear browser/app storage

### File Picker Not Working
- **Browser testing**: File picker may not work in all browsers locally
- **Test on device**: Always test file picker on actual Android device

### APK Won't Install
- **Uninstall old version**: Remove previous version first
- **Enable unknown sources**: Allow installation from unknown sources
- **Check signature**: Debug and release APKs have different signatures

## Performance Tips

### Optimize JavaScript
- Remove `console.log()` statements for production
- Minimize DOM manipulations
- Use event delegation where possible

### Optimize Assets
- Compress images
- Minify CSS (for production)
- Remove unused code

### Reduce APK Size
- Enable ProGuard/R8 (release builds)
- Remove unused resources
- Use WebP for images

## Useful Commands

```bash
# Sync web assets to Android
npx cap sync android

# Build debug APK
cd android && ./gradlew assembleDebug

# Build release APK
cd android && ./gradlew assembleRelease

# Clean build
cd android && ./gradlew clean

# List connected devices
adb devices

# Install APK
adb install path/to/app.apk

# View device logs
adb logcat

# Git status
git status

# Git commit
git add . && git commit -m "message"
```

## Additional Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Android Developer Guide](https://developer.android.com/guide)
- [Web APIs Documentation](https://developer.mozilla.org/en-US/docs/Web/API)

## Notes

- **localStorage**: Data persists across app sessions
- **File formats**: Both XML and TXT are supported
- **Navigation**: Swipe, click zones, and buttons all work
- **Responsive**: App works on various screen sizes
- **No backend**: App runs entirely on device (no server needed)
