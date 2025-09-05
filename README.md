🚀 Project Setup Guide

Follow these steps to get the project up and running:

🔧 Installation

Install dependencies
Open your project folder in VS Code and run:

  **npm install**

Set up Expo Go (for mobile testing)
Download the Expo Go app on your mobile device.

Available on both Google Play Store and Apple App Store
Start the development server
In your VS Code terminal, run:

  **npx expo start**

A QR code will appear in your terminal or browser.

Scan it using the Expo Go app to preview your project on your phone.

🌱 Branching Workflow

To maintain clean and collaborative development:

main → Always contains production-ready code.

dev → Integration branch where new features are merged after review.

feature/your-feature-name → Create a new branch for each feature or bug fix.

Example workflow
# Create a new branch for your feature
git checkout -b feature/login-page

# Work on your changes, commit regularly
git add .
git commit -m "Added login page UI"

# Push branch to remote
git push origin feature/login-page

Once the feature is complete, open a Pull Request (PR) into dev. After testing and approval, code will be merged into main.

✅ You’re all set to start developing!
